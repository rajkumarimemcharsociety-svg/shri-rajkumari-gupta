
import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import Report from "../models/Report.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

const uploadDirectory = path.resolve("uploads", "reports");
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedCategories = [
  "Annual Report",
  "Financial Report",
  "Registration Document",
  "Program Report",
  "Other",
];

const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      await fs.mkdir(uploadDirectory, { recursive: true });
      callback(null, uploadDirectory);
    } catch (error) {
      callback(error);
    }
  },
  filename: (req, file, callback) => {
    callback(null, `${randomUUID()}.pdf`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const isPdf =
      file.mimetype === "application/pdf" &&
      path.extname(file.originalname).toLowerCase() === ".pdf";

    if (!isPdf) {
      return callback(new Error("Only PDF files are allowed."));
    }

    callback(null, true);
  },
});

async function removeUploadedFile(filename) {
  if (!filename || path.basename(filename) !== filename) return;

  try {
    await fs.unlink(path.join(uploadDirectory, filename));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

// ADMIN: List all reports, including unpublished ones.
router.get("/admin", requireAdmin, async (req, res, next) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .select("-storedName");

    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Upload a report.
router.post(
  "/admin",
  requireAdmin,
  upload.single("file"),
  async (req, res, next) => {
    let savedReport;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a PDF file.",
        });
      }

      // Verify the actual PDF signature, not only the extension/MIME type.
      const handle = await fs.open(req.file.path, "r");

      let signature;
      try {
        signature = Buffer.alloc(5);
        await handle.read(signature, 0, 5, 0);
      } finally {
        await handle.close();
      }

      if (signature.toString("ascii") !== "%PDF-") {
        await removeUploadedFile(req.file.filename);

        return res.status(400).json({
          success: false,
          message: "The selected file is not a valid PDF.",
        });
      }

      const title =
        typeof req.body.title === "string" ? req.body.title.trim() : "";

      const description =
        typeof req.body.description === "string"
          ? req.body.description.trim()
          : "";

      const category =
        typeof req.body.category === "string"
          ? req.body.category
          : "Other";

      if (!title || title.length > 150) {
        await removeUploadedFile(req.file.filename);

        return res.status(400).json({
          success: false,
          message: "Title is required and must be 150 characters or fewer.",
        });
      }

      if (description.length > 1000) {
        await removeUploadedFile(req.file.filename);

        return res.status(400).json({
          success: false,
          message: "Description must be 1000 characters or fewer.",
        });
      }

      if (!allowedCategories.includes(category)) {
        await removeUploadedFile(req.file.filename);

        return res.status(400).json({
          success: false,
          message: "Choose a valid report category.",
        });
      }

      savedReport = await Report.create({
        title,
        description,
        category,
        storedName: req.file.filename,
        originalName: path.basename(req.file.originalname).slice(0, 200),
        fileSize: req.file.size,
        uploadedBy: req.admin.username,
        published: false,
      });

      const report = savedReport.toObject();
      delete report.storedName;

      res.status(201).json({
        success: true,
        message: "Report uploaded as an unpublished draft.",
        report,
      });
    } catch (error) {
      if (req.file && !savedReport) {
        await removeUploadedFile(req.file.filename).catch(() => {});
      }
      next(error);
    }
  }
);

// ADMIN: Publish or unpublish a report.
router.patch(
  "/admin/:id/publish",
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!validId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid report ID.",
        });
      }

      if (typeof req.body.published !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Published must be true or false.",
        });
      }

      const report = await Report.findByIdAndUpdate(
        req.params.id,
        { published: req.body.published },
        { new: true, runValidators: true }
      ).select("-storedName");

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found.",
        });
      }

      res.json({ success: true, report });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN: Delete a report and its file.
router.delete("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    await removeUploadedFile(report.storedName);
    await report.deleteOne();

    res.json({ success: true, message: "Report deleted." });
  } catch (error) {
    next(error);
  }
});

// PUBLIC: Only published reports are listed.
router.get("/", async (req, res, next) => {
  try {
    const reports = await Report.find({ published: true })
      .sort({ createdAt: -1 })
      .select("-storedName -uploadedBy");

    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
});

// PUBLIC: Download a published report only.
router.get("/:id/download", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    const report = await Report.findOne({
      _id: req.params.id,
      published: true,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Published report not found.",
      });
    }

    const filePath = path.join(uploadDirectory, report.storedName);

    res.download(filePath, report.originalName, (error) => {
      if (error && !res.headersSent) next(error);
    });
  } catch (error) {
    next(error);
  }
});

export default router;

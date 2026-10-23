
import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import PrivateDocument from "../models/PrivateDocument.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();
const uploadDirectory = "/mydata";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
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

async function removeFile(filename) {
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

// List private documents (admin only)
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const documents = await PrivateDocument.find()
      .sort({ createdAt: -1 })
      .select("-storedName");

    res.json({ success: true, documents });
  } catch (error) {
    next(error);
  }
});

// Upload a private PDF (admin only)
router.post("/", requireAdmin, upload.single("file"), async (req, res, next) => {
  let savedDocument;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF file.",
      });
    }

    // Verify the actual PDF signature.
    const handle = await fs.open(req.file.path, "r");
    let signature;

    try {
      signature = Buffer.alloc(5);
      await handle.read(signature, 0, 5, 0);
    } finally {
      await handle.close();
    }

    if (signature.toString("ascii") !== "%PDF-") {
      await removeFile(req.file.filename);
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

    if (!title || title.length > 150 || description.length > 1000) {
      await removeFile(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Check the title (required, max 150 characters) and description (max 1000 characters).",
      });
    }

    savedDocument = await PrivateDocument.create({
      title,
      description,
      storedName: req.file.filename,
      originalName: path.basename(req.file.originalname).slice(0, 200),
      fileSize: req.file.size,
      uploadedBy: req.admin.username,
    });

    const document = savedDocument.toObject();
    delete document.storedName;

    res.status(201).json({ success: true, document });
  } catch (error) {
    if (req.file && !savedDocument) {
      await removeFile(req.file.filename).catch(() => {});
    }
    next(error);
  }
});

// Download a private PDF (admin only)
router.get("/:id/download", requireAdmin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID.",
      });
    }

    const document = await PrivateDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    res.download(
      path.join(uploadDirectory, document.storedName),
      document.originalName,
      (error) => {
        if (error && !res.headersSent) next(error);
      }
    );
  } catch (error) {
    next(error);
  }
});

// Delete a private PDF (admin only)
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID.",
      });
    }

    const document = await PrivateDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    await removeFile(document.storedName);
    await document.deleteOne();

    res.json({ success: true, message: "Private document deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;

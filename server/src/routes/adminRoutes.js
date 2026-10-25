
import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Enquiry from "../models/Enquiry.js";
import Donation from "../models/Donation.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

// ADMIN LOGIN
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET, JWT_EXPIRES_IN } =
      process.env;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Admin login is not configured on the server.",
      });
    }

    const username =
      typeof req.body?.username === "string" ? req.body.username.trim() : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (!username || !password || password.length > 1024) {
      return res.status(400).json({
        success: false,
        message: "Enter your username and password.",
      });
    }

    const usernameMatches = username === ADMIN_USERNAME;
    const passwordMatches = await bcrypt.compare(
      password,
      ADMIN_PASSWORD_HASH
    );

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      { role: "admin", username: ADMIN_USERNAME },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN || "1h",
        issuer: "shri-rajkumari-gupta-api",
        audience: "shri-rajkumari-gupta-admin",
      }
    );

    return res.json({
      success: true,
      token,
      username: ADMIN_USERNAME,
      expiresIn: JWT_EXPIRES_IN || "1h",
    });
  } catch (error) {
    console.error("Admin login failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in right now.",
    });
  }
});

// ADMIN DASHBOARD
router.get("/dashboard", requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is temporarily unavailable.",
      });
    }

    const [total, newCount, inProgress, resolved, recentEnquiries] =
      await Promise.all([
        Enquiry.countDocuments(),
        Enquiry.countDocuments({ status: "new" }),
        Enquiry.countDocuments({ status: "in-progress" }),
        Enquiry.countDocuments({ status: "resolved" }),
        Enquiry.find()
          .select("-emailError")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
      ]);

    return res.json({
      success: true,
      stats: {
        total,
        new: newCount,
        inProgress,
        resolved,
      },
      recentEnquiries,
    });
  } catch (error) {
    console.error("Admin dashboard failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard data.",
    });
  }
});

// GET ALL ENQUIRIES
router.get("/enquiries", requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is temporarily unavailable.",
      });
    }

    const allowedStatuses = ["new", "in-progress", "resolved"];

    const requestedStatus =
      typeof req.query.status === "string" ? req.query.status : "";

    const filter = {};

    if (requestedStatus && requestedStatus !== "all") {
      if (!allowedStatuses.includes(requestedStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid enquiry status.",
        });
      }

      filter.status = requestedStatus;
    }

    const enquiries = await Enquiry.find(filter)
      .select("-emailError")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.json({
      success: true,
      enquiries,
    });
  } catch (error) {
    console.error("Admin enquiries failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load enquiries.",
    });
  }
});

// UPDATE ENQUIRY STATUS
router.patch("/enquiries/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};

    const allowedStatuses = ["new", "in-progress", "resolved"];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry reference.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid enquiry status.",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .select("-emailError")
      .lean();

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.json({
      success: true,
      enquiry,
    });
  } catch (error) {
    console.error("Updating enquiry status failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update enquiry status.",
    });
  }
});

// DELETE ENQUIRY PERMANENTLY FROM MONGODB
router.delete("/enquiries/:id", requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is temporarily unavailable.",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry reference.",
      });
    }

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found. It may already have been deleted.",
      });
    }

    return res.json({
      success: true,
      message: "Enquiry permanently deleted.",
      deletedId: deletedEnquiry._id,
    });
  } catch (error) {
    console.error("Deleting enquiry failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete enquiry right now.",
    });
  }
});


/* DEMO DONATIONS — NOT REAL PAYMENT RECORDS */

// GET demo donation records
router.get("/donations", requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is temporarily unavailable.",
      });
    }

    const donations = await Donation.find({ mode: "demo" })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const totals = {
      count: donations.length,
      demoSuccess: donations.filter(
        (item) => item.status === "demo-success"
      ).length,
      demoPending: donations.filter(
        (item) => item.status === "demo-pending"
      ).length,
      demoFailed: donations.filter(
        (item) => item.status === "demo-failed"
      ).length,
      demoAmount: donations
        .filter((item) => item.status === "demo-success")
        .reduce((sum, item) => sum + item.amount, 0),
    };

    return res.json({
      success: true,
      disclaimer: "All records are simulated demo transactions, not real donations.",
      totals,
      donations,
    });
  } catch (error) {
    console.error("Loading demo donations failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load demo donation records.",
    });
  }
});

// CREATE a simulated demo transaction
router.post("/donations/demo", requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is temporarily unavailable.",
      });
    }

    const donorName =
      typeof req.body?.donorName === "string"
        ? req.body.donorName.trim()
        : "Demo Donor";

    const amount = req.body?.amount;
    const allowedStatuses = [
      "demo-success",
      "demo-pending",
      "demo-failed",
    ];
    const status = req.body?.status || "demo-pending";

    if (
      donorName.length > 100 ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount < 1 ||
      amount > 10000000 ||
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid demo name, amount, and status.",
      });
    }

    const { randomUUID } = await import("node:crypto");

    const donation = await Donation.create({
      donorName: donorName || "Demo Donor",
      amount,
      status,
      reference: `DEMO-${randomUUID()}`,
      mode: "demo",
    });

    return res.status(201).json({
      success: true,
      message: "Demo transaction created. No payment was made or received.",
      donation,
    });
  } catch (error) {
    console.error("Creating demo donation failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create demo transaction.",
    });
  }
});


export default router;

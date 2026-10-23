
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Enquiry from "./models/Enquiry.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import privateDocumentRoutes from "./routes/privateDocumentRoutes.js";


const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "20kb" }));
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/private-documents", privateDocumentRoutes);

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SHRI RAJKUMARI GUPTA API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many enquiries. Please try again later.",
  },
});

const allowedCategories = [
  "General enquiry",
  "Education & scholarships",
  "Samuhik Vivah",
  "Women's skill training",
  "Volunteering",
  "Documentation & transparency",
  "Other",
];

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

app.post("/api/enquiries", enquiryLimiter, async (req, res) => {
  try {
    // Honeypot field: real visitors should leave this blank.
    if (cleanText(req.body?.website)) {
      return res.status(400).json({
        success: false,
        message: "Unable to submit this enquiry.",
      });
    }

    const name = cleanText(req.body?.name);
    const email = cleanText(req.body?.email).toLowerCase();
    const mobile = cleanText(req.body?.mobile);
    const category = cleanText(req.body?.category);
    const message = cleanText(req.body?.message);

    if (
      name.length < 2 ||
      name.length > 100 ||
      !validEmail(email) ||
      email.length > 254 ||
      !/^[+()\d\s-]{7,20}$/.test(mobile) ||
      !allowedCategories.includes(category) ||
      message.length < 10 ||
      message.length > 3000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check your details and try again.",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "The enquiry service is temporarily unavailable.",
      });
    }

    // Save first so a mail failure does not lose the enquiry.
    const enquiry = await Enquiry.create({
      name,
      email,
      mobile,
      category,
      message,
    });

    let emailSent = false;
    let emailError = "";

    try {
      const transporter = createMailer();

      if (!transporter || !process.env.ENQUIRY_TO_EMAIL) {
        throw new Error("Email service is not configured.");
      }

      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: process.env.ENQUIRY_TO_EMAIL,
        replyTo: email,
        subject: `Website enquiry: ${category}`,
        text: [
          "A new enquiry was submitted through the society website.",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Mobile: ${mobile}`,
          `Category: ${category}`,
          `Received: ${enquiry.createdAt.toISOString()}`,
          "",
          "Message:",
          message,
          "",
          `Enquiry reference: ${enquiry._id}`,
        ].join("\n"),
      });

      emailSent = true;

      await Enquiry.updateOne(
        { _id: enquiry._id },
        { $set: { emailStatus: "sent" }, $unset: { emailError: 1 } }
      );
    } catch (mailError) {
      emailError = mailError?.message || "Email delivery failed.";

      console.error("Enquiry email delivery failed:", emailError);

      await Enquiry.updateOne(
        { _id: enquiry._id },
        {
          $set: {
            emailStatus: "failed",
            emailError: emailError.slice(0, 500),
          },
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Thank you. Your enquiry has been submitted successfully."
        : "Your enquiry has been saved, but email notification is temporarily unavailable.",
      emailSent,
      reference: String(enquiry._id),
    });
  } catch (error) {
    console.error("Enquiry submission failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "We could not process your enquiry. Please try again later.",
    });
  }
});

export default app;

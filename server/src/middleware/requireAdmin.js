import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  const secret = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Admin authentication is not configured.",
    });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Please log in to access this page.",
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, secret);

    if (
      decoded.role !== "admin" ||
      decoded.username !== process.env.ADMIN_USERNAME
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    req.admin = {
      username: decoded.username,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your login session has expired. Please log in again.",
    });
  }
}

import jwt from "jsonwebtoken";

export function verifyAdmin(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (decoded.role !== "admin") return null;

    return decoded;

  } catch {
    return null;
  }
}
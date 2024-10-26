import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { AuthenticatedRequest } from "../interfaces/helpers";

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
    req.user = user as { id: string };
    next();
  });
}

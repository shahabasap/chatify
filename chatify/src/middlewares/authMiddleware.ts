import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase/firebaseConfig"


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
     res.status(401).json({ message: "Unauthorized" });
     return
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    res.locals.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

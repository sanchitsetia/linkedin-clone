import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoutes= async (req, res, next) => {
  const token = req.cookies.token;
  if(!token) {
    return res.status(401).send("Unauthorized");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if(!user) {
    return res.status(401).send("Unauthorized");
  }
  req.user = user;
  next();
}
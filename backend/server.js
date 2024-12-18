import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cookieParser());
const port = process.env.PORT || 8080;

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("api/v1/posts",postRoutes);


app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
  connectDB();
});


import express from "express"
import { getFeedPosts, createPost,deletePost,getPostById,createComment } from "../controllers/post.controller.js";
import { protectRoutes } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/",protectRoutes,getFeedPosts);
router.post("/create",protectRoutes,createPost);
router.delete("/delete/:id",protectRoutes,deletePost);
router.get("/:id",protectRoutes,getPostById);
router.post("/:id/comments",protectRoutes,createComment);

export default router;
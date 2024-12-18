import express from "express";
const router = express.Router();

import { protectRoutes } from "../middlewares/auth.middleware.js";
import { suggestedUsers,getPublicProfile,updateProfile} from "../controllers/user.controller.js";

router.get("/suggested-users",protectRoutes,suggestedUsers);
router.get("/:username",protectRoutes,getPublicProfile);
router.put("/profile",protectRoutes,updateProfile);

export default router;
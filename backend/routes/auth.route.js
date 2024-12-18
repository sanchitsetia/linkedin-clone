import express from "express";
const router = express.Router();

import { getUserDetails, logout, signin, signup } from "../controllers/auth.controller.js";
import { protectRoutes } from "../middlewares/auth.middleware.js";

router.post("/logout",logout);
router.post("/signin",signin);
router.post("/signup",signup);

router.get("/me",protectRoutes,getUserDetails);

export default router;
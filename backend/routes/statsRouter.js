import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";

const statsRouter = express.Router();

// GET /api/stats/dashboard - Get all dashboard statistics (admin only)
statsRouter.get("/dashboard", getDashboardStats);

export default statsRouter;

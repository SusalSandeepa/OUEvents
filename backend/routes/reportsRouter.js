import express from "express";
import { getGeneralStats, getReportsData, getReportFilters } from "../controllers/reportsController.js";

const router = express.Router();

// Get general dashboard stats (Total events, users, registrations, etc)
router.get("/stats", getGeneralStats);

// Get unique values for filters (categories, faculties)
router.get("/filters", getReportFilters);

// Get detailed reports data (Events, Users, Registrations, Feedback)
router.get("/data/:type", getReportsData);

export default router;

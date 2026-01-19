import express from "express";
import {
    submitFeedback,
    getEventFeedback,
    checkUserFeedback,
    getAllFeedback,
    deleteFeedback,
} from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

// Submit feedback (authenticated user, requires registration)
feedbackRouter.post("/", submitFeedback);

// Get all feedback (admin only)
feedbackRouter.get("/", getAllFeedback);

// Get feedback for a specific event
feedbackRouter.get("/event/:eventID", getEventFeedback);

// Check if user has submitted feedback for an event
feedbackRouter.get("/check/:eventID", checkUserFeedback);

// Delete feedback (admin only)
feedbackRouter.delete("/:id", deleteFeedback);

export default feedbackRouter;

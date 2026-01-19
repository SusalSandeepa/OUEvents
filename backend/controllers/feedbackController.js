import Feedback from "../models/feedback.js";
import Event from "../models/event.js";
import EventRegistration from "../models/eventRegistration.js";
import { isAdmin } from "./userController.js";

// Submit feedback for an event
export async function submitFeedback(req, res) {
    // Check if user is logged in
    if (req.user == null) {
        res.status(401).json({
            message: "Please login to submit feedback",
        });
        return;
    }

    const { eventID, rating, comment } = req.body;

    // Validate required fields
    if (!eventID || !rating) {
        res.status(400).json({
            message: "Event ID and rating are required",
        });
        return;
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
        res.status(400).json({
            message: "Rating must be between 1 and 5",
        });
        return;
    }

    try {
        // Check if event exists and is inactive
        const event = await Event.findOne({ eventID: eventID });

        if (!event) {
            res.status(404).json({
                message: "Event not found",
            });
            return;
        }

        if (event.status !== "inactive") {
            res.status(400).json({
                message: "Feedback can only be submitted for completed events",
            });
            return;
        }

        // Check if user is registered for the event
        const registration = await EventRegistration.findOne({
            eventID: eventID,
            userEmail: req.user.email,
            status: { $in: ["registered", "attended"] },
        });

        if (!registration) {
            res.status(403).json({
                message: "Only registered attendees can submit feedback",
            });
            return;
        }

        // Check if user has already submitted feedback
        const existingFeedback = await Feedback.findOne({
            eventID: eventID,
            userEmail: req.user.email,
        });

        if (existingFeedback) {
            res.status(400).json({
                message: "You have already submitted feedback for this event",
            });
            return;
        }

        // Create new feedback
        const feedback = new Feedback({
            eventID: eventID,
            userEmail: req.user.email,
            rating: rating,
            comment: comment || "",
        });

        await feedback.save();

        res.json({
            message: "Feedback submitted successfully",
            feedback: feedback,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to submit feedback",
        });
    }
}

// Get all feedback for a specific event
export async function getEventFeedback(req, res) {
    const eventID = req.params.eventID;

    try {
        const feedback = await Feedback.find({ eventID: eventID }).sort({
            createdAt: -1,
        });

        res.json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to get feedback",
        });
    }
}

// Check if user has submitted feedback for an event
export async function checkUserFeedback(req, res) {
    if (req.user == null) {
        res.json({
            hasSubmitted: false,
        });
        return;
    }

    const eventID = req.params.eventID;

    try {
        const feedback = await Feedback.findOne({
            eventID: eventID,
            userEmail: req.user.email,
        });

        res.json({
            hasSubmitted: feedback != null,
            feedback: feedback,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to check feedback status",
        });
    }
}

// Get all feedback (admin only)
export async function getAllFeedback(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "You are not authorized to view all feedback",
        });
        return;
    }

    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to get feedback",
        });
    }
}

// Delete feedback (admin only)
export async function deleteFeedback(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "You are not authorized to delete feedback",
        });
        return;
    }

    const feedbackId = req.params.id;

    try {
        const result = await Feedback.findByIdAndDelete(feedbackId);

        if (!result) {
            res.status(404).json({
                message: "Feedback not found",
            });
            return;
        }

        res.json({
            message: "Feedback deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to delete feedback",
        });
    }
}

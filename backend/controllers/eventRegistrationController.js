import EventRegistration from "../models/eventRegistration.js";
import Event from "../models/event.js";
import Feedback from "../models/feedback.js";
import { isAdmin } from "./userController.js";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import { getReminderEmail } from "../utils/reminderEmail.js";

// Nodemailer transporter for registration emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

// Send registration confirmation email (fire-and-forget)
async function sendRegistrationEmail(userEmail, event) {
  try {
    const user = await User.findOne({ email: userEmail });
    const firstName = user?.firstName || "there";

    const now = new Date();
    const eventDate = new Date(event.eventDateTime);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.max(0, Math.ceil((eventDate - now) / msPerDay));

    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await transporter.sendMail({
      from: `"OUEvents" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `[OUEvents] You're registered for "${event.title}"!`,
      html: getReminderEmail({
        firstName,
        eventTitle: event.title,
        eventDate: formattedDate,
        venue: event.location,
        daysLeft,
      }),
    });

    console.log(`[Email] Confirmation sent to ${userEmail} for "${event.title}"`);
  } catch (err) {
    console.error(`[Email] Failed to send confirmation to ${userEmail}:`, err.message);
  }
}

// Register for an event
export function registerForEvent(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Please login to register for events",
    });
    return;
  }

  const eventID = req.body.eventID;
  const regNo = req.body.regNo;
  const academicYear = req.body.academicYear;
  const faculty = req.body.faculty;

  // Check if event exists first
  Event.findOne({ eventID: eventID })
    .then((event) => {
      if (event == null) {
        res.status(404).json({
          message: "Event not found",
        });
        return;
      }

      // Check if already registered
      EventRegistration.findOne({
        eventID: eventID,
        userEmail: req.user.email,
        status: "registered",
      })
        .then((existingReg) => {
          if (existingReg != null) {
            res.status(400).json({
              message: "You are already registered for this event",
            });
            return;
          }

          // Create new registration
          const registration = new EventRegistration({
            eventID: eventID,
            userEmail: req.user.email,
            regNo: regNo,
            academicYear: academicYear,
            faculty: faculty,
          });

          registration
            .save()
            .then(() => {
              // Respond to the user immediately
              res.json({
                message: "Successfully registered for the event",
              });
              // Send confirmation email in the background (non-blocking)
              sendRegistrationEmail(req.user.email, event);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({
                message: "Failed to register for event",
              });
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: "Failed to check registration",
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Failed to find event",
      });
    });
}

// Cancel registration
export function cancelRegistration(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Please login to cancel registration",
    });
    return;
  }

  const eventID = req.params.eventID;
  const userEmail = req.user.email;

  // Find registration by eventID and userEmail
  EventRegistration.findOne({
    eventID: eventID,
    userEmail: userEmail,
    status: "registered",
  })
    .then((registration) => {
      if (registration == null) {
        res.status(404).json({
          message: "Registration not found",
        });
        return;
      }

      registration.status = "cancelled";
      registration
        .save()
        .then(() => {
          res.json({
            message: "Registration cancelled successfully",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: "Failed to cancel registration",
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Failed to find registration",
      });
    });
}

// Get my registrations (logged in user)
export function getMyRegistrations(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Please login to view your registrations",
    });
    return;
  }

  EventRegistration.find({
    userEmail: req.user.email,
    status: "registered",
  })
    .then((registrations) => {
      if (registrations.length === 0) {
        return res.json([]);
      }

      // Fetch event details and check feedback for each registration
      const promises = registrations.map((reg) => {
        return Promise.all([
          Event.findOne({ eventID: reg.eventID }),
          Feedback.findOne({ eventID: reg.eventID, userEmail: req.user.email }),
        ]).then(([event, feedback]) => {
          const regObj = reg.toObject();
          return {
            _id: regObj._id,
            eventID: regObj.eventID,
            userEmail: regObj.userEmail,
            regNo: regObj.regNo,
            academicYear: regObj.academicYear,
            faculty: regObj.faculty,
            status: regObj.status,
            feedbackSubmitted: !!feedback,
            event: event,
          };
        });
      });

      Promise.all(promises)
        .then((registrationsWithEvents) => {
          // Filter out events with pending status
          const filteredEvents = registrationsWithEvents.filter(
            (item) => item.event && item.event.status !== "pending",
          );
          res.json(filteredEvents);
        })
        .catch((err) => {
          console.error("Error fetching event details:", err);
          res.status(500).json({
            message: "Failed to get event details",
          });
        });
    })
    .catch((err) => {
      console.error("Error fetching registrations:", err);
      res.status(500).json({
        message: "Failed to get registrations",
      });
    });
}

// Check if user is registered for an event
export function checkRegistration(req, res) {
  if (req.user == null) {
    res.json({
      isRegistered: false,
    });
    return;
  }

  const eventID = req.params.eventID;

  EventRegistration.findOne({
    eventID: eventID,
    userEmail: req.user.email,
    status: "registered",
  })
    .then((registration) => {
      if (registration != null) {
        res.json({
          isRegistered: true,
        });
      } else {
        res.json({
          isRegistered: false,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Failed to check registration",
      });
    });
}

// Get all registrations for an event (admin only)
export function getEventRegistrations(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({
      message: "You are not authorized to view registrations",
    });
    return;
  }

  const eventID = req.params.eventID;

  EventRegistration.find({
    eventID: eventID,
    status: "registered",
  })
    .then((registrations) => {
      res.json(registrations);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Failed to get registrations",
      });
    });
}

// Get all registrations (admin only)
export function getAllRegistrations(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({
      message: "You are not authorized to view all registrations",
    });
    return;
  }

  EventRegistration.find()
    .then((registrations) => {
      res.json(registrations);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Failed to get registrations",
      });
    });
}

import EventRegistration from "../models/eventRegistration.js";
import Event from "../models/event.js";
import Feedback from "../models/feedback.js";
import { isAdmin } from "./userController.js";

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
              res.json({
                message: "Successfully registered for the event",
              });
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

  const registrationId = req.params.id;

  EventRegistration.findById(registrationId)
    .then((registration) => {
      if (registration == null) {
        res.status(404).json({
          message: "Registration not found",
        });
        return;
      }

      // Check if user owns this registration or is admin
      if (registration.userEmail != req.user.email && !isAdmin(req)) {
        res.status(403).json({
          message: "You can only cancel your own registrations",
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
          Feedback.findOne({ eventID: reg.eventID, userEmail: req.user.email })
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
            (item) => item.event && item.event.status !== "pending"
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

// Mark attendance (admin only)
export function markAttendance(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({
      message: "You are not authorized to mark attendance",
    });
    return;
  }

  const registrationId = req.params.id;

  EventRegistration.findById(registrationId)
    .then((registration) => {
      if (registration == null) {
        res.status(404).json({
          message: "Registration not found",
        });
        return;
      }

      registration.status = "attended";
      registration
        .save()
        .then(() => {
          res.json({
            message: "Attendance marked successfully",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: "Failed to mark attendance",
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

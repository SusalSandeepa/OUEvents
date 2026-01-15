import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  checkRegistration,
  getEventRegistrations,
  getAllRegistrations,
  markAttendance,
} from "../controllers/eventRegistrationController.js";

const eventRegistrationRouter = express.Router();

eventRegistrationRouter.post("/", registerForEvent);
eventRegistrationRouter.get("/my", getMyRegistrations);
eventRegistrationRouter.get("/check/:eventID", checkRegistration);
eventRegistrationRouter.delete("/:id", cancelRegistration);
eventRegistrationRouter.get("/", getAllRegistrations);
eventRegistrationRouter.get("/event/:eventID", getEventRegistrations);
eventRegistrationRouter.put("/attend/:id", markAttendance);

export default eventRegistrationRouter;

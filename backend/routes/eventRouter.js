import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.get("/",getEvents)
eventRouter.post("/",createEvent)
eventRouter.delete("/:eventID",deleteEvent)
eventRouter.put("/:eventID",updateEvent)
eventRouter.get("/:eventID",getEventById)

export default eventRouter
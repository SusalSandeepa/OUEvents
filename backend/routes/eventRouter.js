import express from "express";
import { createEvent, getEvents } from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.get("/",getEvents)
eventRouter.post("/",createEvent)

export default eventRouter
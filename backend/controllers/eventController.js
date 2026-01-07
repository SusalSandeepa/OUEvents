import Event from "../models/event.js";
import { isAdmin } from "./userController.js";

export async function createEvent(req,res){

    if(!isAdmin(req)){
        res.status(401).json({
            message: "You are not authorized to create an event"
        })
        return;
    }

    try{
        const eventData = req.body;
        const event = new Event(eventData);

        await event.save();

        res.json({
            message: "Event created successfully",
            event: event
        })

    }catch(err){        
        console.error(err);
        res.status(500).json({
            message: "Failed to create event"           
        })
    }
}

export async function getEvents(req,res){

    try{
        const events = await Event.find();
        res.json(events);

    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch events"
        })
    }
}
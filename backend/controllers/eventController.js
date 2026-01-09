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

        if(!eventData.eventDateTime && eventData.date && eventData.time){
            const date = new Date(eventData.date);
            const timeSplit = eventData.time.split(":");
            date.setUTCHours(parseInt(timeSplit[0]));
            date.setUTCMinutes(parseInt(timeSplit[1]));
            eventData.eventDateTime = date;
        }
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

export async function deleteEvent(req,res){

    if(!isAdmin(req)){
        res.status(401).json({
            message: "You are not authorized to delete an event"
        })
        return;
    }
 
    try{
        const eventID = req.params.eventID

        await Event.deleteOne({
            eventID: eventID
        })

        res.json({
            message: "Event deleted successfully"
        })

    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Failed to delete event"
        })
    }
}

export async function updateEvent(req,res){

    if(!isAdmin(req)){
        res.status(401).json({
            message: "You are not authorized to update an event"
        })
        return;
    }
 
    try{
        const eventID = req.params.eventID
        const updatedData = req.body
        
        if(!updatedData.eventDateTime && updatedData.date && updatedData.time){
            const date = new Date(updatedData.date);
            const timeSplit = updatedData.time.split(":");
            date.setUTCHours(parseInt(timeSplit[0]));
            date.setUTCMinutes(parseInt(timeSplit[1]));
            updatedData.eventDateTime = date;
        }

        await Event.updateOne(
            {eventID: eventID},
            updatedData
        )

        res.json({
            message: "Event updated successfully"
        })

    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Failed to update event"
        })
    }
}

export async function getEventById(req,res){
    try{
        const eventID = req.params.eventID
        const event = await Event.findOne(
            {eventID: eventID}
        )
        
        if(event == null){
            res.status(404).json({
                message: "Event not found"
            })
        }else{
            res.json(event)
        }
    
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch event by ID"
        })
    }
}
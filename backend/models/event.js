import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        eventID: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        eventDateTime: {
            type: Date,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            required: true
        },
        organizer: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    }
)

export default mongoose.model("Event", eventSchema)

import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema({
  eventID: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["registered", "cancelled", "attended"],
    default: "registered",
  },
});

const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);
export default EventRegistration;

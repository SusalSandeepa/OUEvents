import { Link } from "react-router-dom";
import { LuUpload, LuArrowLeft } from "react-icons/lu";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mediaUpload from "../../../utils/mediaUpload";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function UpdateEventForm() {
  const navigate = useNavigate();
  const selectedEventInfo = useLocation();
  const eventData = selectedEventInfo.state;

  // Format date and time from eventDateTime
  const eventDate = new Date(eventData.eventDateTime);
  const formattedDate = eventDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const formattedTime = eventDate.toTimeString().slice(0, 5); // "HH:MM"

  const [eventID, setEventID] = useState(eventData.eventID);
  const [title, setTitle] = useState(eventData.title);
  const [description, setDescription] = useState(eventData.description);
  const [date, setDate] = useState(formattedDate);
  const [time, setTime] = useState(formattedTime);
  const [location, setLocation] = useState(eventData.location);
  const [category, setCategory] = useState(eventData.category);
  const [organizer, setOrganizer] = useState(eventData.organizer);
  const [status, setStatus] = useState(eventData.status);
  const [image, setImage] = useState(eventData.image); // URL string initially

  async function updateEvent() {
    // Validate required fields
    if (!description.trim()) {
      toast.error("Please enter a Description");
      return;
    }
    if (!date) {
      toast.error("Please select a Date");
      return;
    }
    if (!time) {
      toast.error("Please select a Time");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter a Location");
      return;
    }
    if (!category) {
      toast.error("Please select a Category");
      return;
    }
    if (!organizer.trim()) {
      toast.error("Please enter an Organizer");
      return;
    }
    if (!image) {
      toast.error("Please upload an Event Image");
      return;
    }

    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/login");
      return;
    }

    try {
      // Upload image only if a new file was selected, otherwise use existing URL
      let imageUrl = image;
      if (image instanceof File) {
        imageUrl = await mediaUpload(image);
      }

      const event = {
        title: title.trim(),
        description: description.trim(),
        eventDateTime: new Date(date + " " + time),
        location: location.trim(),
        image: imageUrl,
        category: category,
        status: status,
        organizer: organizer.trim(),
      };

      // Call backend API to update event
      await axios.put(
        import.meta.env.VITE_API_URL + "api/events/" + eventID,
        event,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
      toast.success("Event updated successfully");
      navigate("/admin/events");
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while uploading the image");
      return;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/events"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LuArrowLeft className="w-5 h-5 text-secondary" />
        </Link>
        <h2 className="text-2xl font-bold text-secondary">Update Event</h2>
      </div>

      <form className="space-y-6">
        {/* Event ID and Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Event ID <span className="text-red-500">*</span>
            </label>
            <input
              disabled
              value={eventID}
              onChange={(e) => setEventID(e.target.value)}
              type="text"
              placeholder="e.g., EVT-2026-001"
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Enter event title"
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Describe your event..."
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              type="date"
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
              }}
              type="time"
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            />
          </div>
        </div>

        {/* Location and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
              type="text"
              placeholder="Event venue or address"
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            >
              <option value="">Select a category</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Academic">Academic</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Organizer and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Organizer <span className="text-red-500">*</span>
            </label>
            <input
              value={organizer}
              onChange={(e) => {
                setOrganizer(e.target.value);
              }}
              type="text"
              placeholder="Organizing department or person"
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Event Image <span className="text-red-500">*</span>
          </label>
          {!image ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all">
              <LuUpload className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Click to upload event image
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </span>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
              <img
                src={image instanceof File ? URL.createObjectURL(image) : image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            to="/admin/events"
            className="px-6 py-2.5 bg-gray-100 text-secondary font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={updateEvent}
            type="button"
            className="px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
}

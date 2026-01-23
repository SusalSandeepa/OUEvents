import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hasShownLoginToast = useRef(false);

  const [formData, setFormData] = useState({
    regNo: "",
    academicYear: "",
    faculty: "",
  });

  const academicYears = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
    "Postgraduate",
  ];

  const faculties = [
    "Faculty of Engineering Technology",
    "Faculty of Natural Sciences",
    "Faculty of Health Sciences",
    "Faculty of Humanities & Social Sciences",
    "Faculty of Education",
    "Faculty of Management Studies",
  ];

  useEffect(() => {
    // Check if user is logged in - redirect to login if not
    const token = localStorage.getItem("token");
    if (!token) {
      // Prevent duplicate toast from React StrictMode double-rendering
      if (!hasShownLoginToast.current) {
        hasShownLoginToast.current = true;
        toast.error("Please login to register for events");
      }
      navigate("/login");
      return;
    }

    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch event details
        const eventRes = await axios.get(
          `${import.meta.env.VITE_API_URL}api/events/${id}`,
        );
        const eventData = eventRes.data?.data || eventRes.data;
        setEvent(eventData);

        // Check if user is already registered (token is guaranteed to exist at this point)
        const regRes = await axios.get(
          `${import.meta.env.VITE_API_URL}api/registrations/check/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setIsRegistered(regRes.data?.isRegistered || false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      // Safety fallback - useEffect should have already redirected
      navigate("/login");
      return;
    }

    if (!formData.regNo || !formData.academicYear || !formData.faculty) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}api/registrations`,
        {
          eventID: id,
          regNo: formData.regNo,
          academicYear: formData.academicYear,
          faculty: formData.faculty,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Successfully registered for the event!");
      navigate(`/events/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center">
        <p className="text-gray-800 font-semibold mb-4">Event not found</p>
        <button
          onClick={() => navigate("/events")}
          className="px-4 py-2 bg-[var(--color-accent,#7a1d1a)] text-white rounded-lg"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (event.status === "inactive") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Event Has Ended
          </h2>
          <p className="text-gray-600 mb-6">
            Registration for this event is closed as the event has already
            ended.
          </p>
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="px-6 py-2 bg-[var(--color-accent,#7a1d1a)] text-white rounded-lg"
          >
            View Event Details
          </button>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Already Registered!
          </h2>
          <p className="text-gray-600 mb-6">
            You have already registered for this event. We look forward to
            seeing you!
          </p>
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="px-6 py-2 bg-[var(--color-accent,#7a1d1a)] text-white rounded-lg"
          >
            View Event Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--color-accent,#7a1d1a)] mb-6"
        >
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Event
        </button>

        {/* Event Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-40 w-full">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-xl font-bold text-white">{event.title}</h1>
              <p className="text-white/80 text-sm">
                {formatDate(event.eventDateTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Event Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Registration Number */}
            <div>
              <label
                htmlFor="regNo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="regNo"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                placeholder="e.g., S/20/001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Academic Year */}
            <div>
              <label
                htmlFor="academicYear"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Faculty */}
            <div>
              <label
                htmlFor="faculty"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Faculty <span className="text-red-500">*</span>
              </label>
              <select
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                required
              >
                <option value="">Select Faculty</option>
                {faculties.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--color-accent,#7a1d1a)] hover:bg-[#5e1512] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-150"
            >
              {submitting ? "Registering..." : "Confirm Registration"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-4">
            By registering, you agree to attend this event. Your registration
            details will be shared with the event organizers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;

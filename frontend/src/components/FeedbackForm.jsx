import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FeedbackForm = ({ eventID, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to submit feedback");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/feedback`,
                {
                    eventID,
                    rating,
                    comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(response.data.message || "Feedback submitted successfully");
            setRating(0);
            setComment("");
            if (onSuccess) {
                onSuccess(response.data.feedback);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStar = (index) => {
        const filled = index <= (hoveredRating || rating);
        return (
            <button
                key={index}
                type="button"
                onClick={() => setRating(index)}
                onMouseEnter={() => setHoveredRating(index)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${index} stars`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            </button>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                Share Your Feedback
            </h3>
            <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
                    </div>
                    {rating > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Very Good"}
                            {rating === 5 && "Excellent"}
                        </p>
                    )}
                </div>

                {/* Comment */}
                <div className="mb-4">
                    <label
                        htmlFor="feedback-comment"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Comments (Optional)
                    </label>
                    <textarea
                        id="feedback-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this event..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full bg-[var(--color-accent,#7a1d1a)] hover:bg-[#5e1512] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all duration-150"
                >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;

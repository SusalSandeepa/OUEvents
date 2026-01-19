import React from "react";

const FeedbackList = ({ feedbackList, loading }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInitials = (email) => {
        if (!email) return "?";
        const parts = email.split("@")[0].split(".");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return email.slice(0, 2).toUpperCase();
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((index) => (
                    <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${index <= rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
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
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-gray-500 text-center">Loading feedback...</p>
            </div>
        );
    }

    if (!feedbackList || feedbackList.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-gray-500 text-center">
                    No feedback yet. Be the first to share your experience!
                </p>
            </div>
        );
    }

    // Calculate average rating
    const avgRating =
        feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Event Feedback</h3>
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        {renderStars(Math.round(avgRating))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                        {avgRating.toFixed(1)} ({feedbackList.length}{" "}
                        {feedbackList.length === 1 ? "review" : "reviews"})
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {feedbackList.map((feedback) => (
                    <div
                        key={feedback._id}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-accent,#7a1d1a)] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                {getInitials(feedback.userEmail)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {feedback.userEmail.split("@")[0]}
                                    </p>
                                    <span className="text-xs text-gray-400 shrink-0">
                                        {formatDate(feedback.createdAt)}
                                    </span>
                                </div>
                                <div className="mt-1">{renderStars(feedback.rating)}</div>
                                {feedback.comment && (
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        {feedback.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackList;

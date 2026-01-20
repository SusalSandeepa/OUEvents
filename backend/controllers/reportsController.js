import Event from "../models/event.js";
import User from "../models/user.js";
import EventRegistration from "../models/eventRegistration.js";
import Feedback from "../models/feedback.js";

/**
 * Controller for handling reports and data aggregation/logic
 */

// Get general stats for the top cards of the dashboard
export const getGeneralStats = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRegistrations = await EventRegistration.countDocuments();

        // Calculate average rating
        const feedbackStats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);

        const avgRating = feedbackStats.length > 0 ? feedbackStats[0].avgRating.toFixed(1) : "0.0";

        res.status(200).json({
            totalEvents,
            totalUsers,
            totalRegistrations,
            avgRating
        });
    } catch (error) {
        console.error("Error fetching general stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get detailed reports data based on type and filters
export const getReportsData = async (req, res) => {
    const { type } = req.params;
    const { search, startDate, endDate, category, status, role, faculty, rating } = req.query;

    try {
        let query = {};
        let data = [];
        let metrics = [];

        // Common date filter logic - Skip for users report
        if ((startDate || endDate) && type !== 'users') {
            const dateField = type === 'events' ? 'eventDateTime' :
                type === 'registrations' ? 'registrationDate' : 'createdAt';

            query[dateField] = {};
            if (startDate) query[dateField].$gte = new Date(startDate);
            if (endDate) query[dateField].$lte = new Date(endDate);
        }

        switch (type) {
            case 'events':
                if (search) query.title = { $regex: search, $options: 'i' };
                if (category && category !== 'All Categories') query.category = category;
                if (status && status !== 'All Status') query.status = status.toLowerCase();

                data = await Event.find(query).sort({ eventDateTime: -1 });

                // Event Metrics
                const totalEventsCount = await Event.countDocuments();
                const activeEvents = await Event.countDocuments({ status: 'active' });
                metrics = [
                    { label: 'Total Events', value: totalEventsCount.toString(), icon: 'fa-calendar', color: 'secondary' },
                    { label: 'Active Events', value: activeEvents.toString(), icon: 'fa-play-circle', color: 'secondary' },
                    { label: 'Inactive', value: (totalEventsCount - activeEvents).toString(), icon: 'fa-pause-circle', color: 'secondary' }
                ];
                break;

            case 'users':
                if (search) {
                    query.$or = [
                        { firstName: { $regex: search, $options: 'i' } },
                        { lastName: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ];
                }
                if (role && role !== 'All Roles') query.role = role.toLowerCase();
                if (status && status !== 'All Status') {
                    if (status === 'Active') query.isBlock = false;
                    if (status === 'Blocked') query.isBlock = true;
                }

                data = await User.find(query);

                const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
                const organizers = await User.countDocuments({ role: 'organizer' });
                metrics = [
                    { label: 'Total Users', value: data.length.toString(), icon: 'fa-users', color: 'secondary' },
                    { label: 'Verified Users', value: verifiedUsers.toString(), icon: 'fa-user-check', color: 'secondary' },
                    { label: 'Organizers', value: organizers.toString(), icon: 'fa-user-tie', color: 'secondary' }
                ];
                break;

            case 'registrations':
                if (search) {
                    query.$or = [
                        { userEmail: { $regex: search, $options: 'i' } },
                        { eventID: { $regex: search, $options: 'i' } },
                        { regNo: { $regex: search, $options: 'i' } }
                    ];
                }
                if (faculty && faculty !== 'All Faculties') query.faculty = faculty;
                if (status && status !== 'All Status') query.status = status.toLowerCase();

                data = await EventRegistration.find(query).sort({ registrationDate: -1 });

                const attended = data.filter(r => r.status === 'attended').length;
                const registered = data.filter(r => r.status === 'registered').length;
                metrics = [
                    { label: 'Total Registrations', value: data.length.toString(), icon: 'fa-ticket', color: 'secondary' },
                    { label: 'Attended', value: attended.toString(), icon: 'fa-user-check', color: 'secondary' },
                    { label: 'Cancelled', value: (data.length - attended - registered).toString(), icon: 'fa-xmark', color: 'secondary' }
                ];
                break;

            case 'feedback':
                if (search) {
                    query.$or = [
                        { userEmail: { $regex: search, $options: 'i' } },
                        { eventID: { $regex: search, $options: 'i' } },
                        { comment: { $regex: search, $options: 'i' } }
                    ];
                }
                if (rating && rating !== 'All Ratings') {
                    query.rating = parseInt(rating.split(' ')[0]);
                }

                data = await Feedback.find(query).sort({ createdAt: -1 });

                const ratings = data.map(f => f.rating);
                const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0.0";
                metrics = [
                    { label: 'Total Feedback', value: data.length.toString(), icon: 'fa-comments', color: 'secondary' },
                    { label: 'Average Rating', value: avg, icon: 'fa-star', color: 'secondary' },
                    { label: 'Positive', value: data.filter(f => f.rating >= 4).length.toString(), icon: 'fa-face-smile', color: 'secondary' }
                ];
                break;

            default:
                return res.status(400).json({ message: "Invalid report type" });
        }

        res.status(200).json({
            data,
            metrics,
            totalRecords: data.length
        });

    } catch (error) {
        console.error(`Error fetching ${type} reports:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get unique values for filters (categories, faculties)
export const getReportFilters = async (req, res) => {
    try {
        const categories = await Event.distinct("category");
        const faculties = await EventRegistration.distinct("faculty");

        res.status(200).json({
            categories: categories.sort(),
            faculties: faculties.sort()
        });
    } catch (error) {
        console.error("Error fetching report filters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

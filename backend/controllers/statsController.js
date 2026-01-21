import User from "../models/user.js";
import Event from "../models/event.js";
import EventRegistration from "../models/eventRegistration.js";
import { isAdmin } from "./userController.js";

// this function gets all stats for the admin dashboard
export async function getDashboardStats(req, res) {
  // first check if user is admin
  if (!isAdmin(req)) {
    return res.status(401).json({
      message: "You are not authorized to view dashboard statistics",
    });
  }

  try {
    // get total users and admins count
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // get total events and registrations count
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await EventRegistration.countDocuments({
      status: "registered",
    });

    // get today's start and end time
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // count how many people registered today
    const todaysRegistrations = await EventRegistration.countDocuments({
      registrationDate: { $gte: todayStart, $lte: todayEnd },
      status: "registered",
    });

    // get next 5 upcoming events
    const now = new Date();
    const upcomingEvents = await Event.find({
      eventDateTime: { $gt: now },
      status: "active",
    })
      .sort({ eventDateTime: 1 })
      .limit(5)
      .select("eventID title eventDateTime category location image");

    // get last 5 registrations
    const recentRegistrations = await EventRegistration.find({
      status: "registered",
    })
      .sort({ registrationDate: -1 })
      .limit(5);

    // add event title to each registration
    const recentRegistrationsWithTitles = [];
    for (let i = 0; i < recentRegistrations.length; i++) {
      const reg = recentRegistrations[i];
      const event = await Event.findOne({ eventID: reg.eventID }).select(
        "title",
      );

      recentRegistrationsWithTitles.push({
        _id: reg._id,
        eventID: reg.eventID,
        eventTitle: event ? event.title : "Unknown Event",
        userEmail: reg.userEmail,
        registrationDate: reg.registrationDate,
        faculty: reg.faculty,
      });
    }

    // group events by category for pie chart
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // calculate start date for last 7 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // set start date to 6 days ago from today
    startDate.setHours(0, 0, 0, 0);

    // get registrations count for each day
    const registrationsByDay = await EventRegistration.aggregate([
      {
        $match: {
          registrationDate: { $gte: startDate },
          status: "registered",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$registrationDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // build data for line chart showing last 7 days
    const engagementData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const dateString = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      // find if we have registrations for this day
      let count = 0;
      for (let j = 0; j < registrationsByDay.length; j++) {
        if (registrationsByDay[j]._id === dateString) {
          count = registrationsByDay[j].count;
          break;
        }
      }

      engagementData.push({
        day: dayName,
        date: dateString,
        registrations: count,
      });
    }

    // send everything to frontend
    res.json({
      totalUsers,
      totalAdmins,
      totalEvents,
      totalRegistrations,
      todaysRegistrations,
      upcomingEvents,
      recentRegistrations: recentRegistrationsWithTitles,
      eventsByCategory,
      userEngagement: engagementData,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
}

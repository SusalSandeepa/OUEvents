import cron from "node-cron";
import nodemailer from "nodemailer";
import Event from "../models/event.js";
import EventRegistration from "../models/eventRegistration.js";
import User from "../models/user.js";
import { getReminderEmail } from "./reminderEmail.js";

// Nodemailer transporter (same Gmail config as OTP emails)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL certificate issues
  },
});

// Days before an event to send a reminder
const REMINDER_DAYS = [7, 3, 1];

/**
 * Sends a single reminder email to a user for a given event.
 */
async function sendReminderEmail({ toEmail, firstName, event, daysLeft }) {
  const eventDate = new Date(event.eventDateTime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject =
    daysLeft === 1
      ? `[OUEvents] Reminder: "${event.title}" is tomorrow!`
      : `[OUEvents] Reminder: "${event.title}" starts in ${daysLeft} days`;

  await transporter.sendMail({
    from: `"OUEvents" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: getReminderEmail({
      firstName: firstName || "there",
      eventTitle: event.title,
      eventDate,
      venue: event.location,
      daysLeft,
    }),
  });
}

/**
 * Core logic: finds events due for reminders and sends emails.
 * Exported so it can also be triggered manually (e.g. for testing).
 */
export async function runReminderJob() {
  console.log("[Reminder] Running reminder job at", new Date().toISOString());

  const now = new Date();

  for (const days of REMINDER_DAYS) {
    // Calculate the target date window (midnight-to-midnight for that day)
    const targetStart = new Date(now);
    targetStart.setDate(targetStart.getDate() + days);
    targetStart.setHours(0, 0, 0, 0);

    const targetEnd = new Date(targetStart);
    targetEnd.setHours(23, 59, 59, 999);

    // Find events starting on that day
    const events = await Event.find({
      eventDateTime: { $gte: targetStart, $lte: targetEnd },
      status: "active",
    });

    for (const event of events) {
      // Get all registered users for this event
      const registrations = await EventRegistration.find({
        eventID: event.eventID,
        status: "registered",
      });

      for (const reg of registrations) {
        try {
          // Look up user for their first name
          const user = await User.findOne({ email: reg.userEmail });
          const firstName = user?.firstName || "there";

          await sendReminderEmail({
            toEmail: reg.userEmail,
            firstName,
            event,
            daysLeft: days,
          });

          console.log(
            `[Reminder] Sent ${days}-day reminder to ${reg.userEmail} for "${event.title}"`
          );
        } catch (err) {
          console.error(
            `[Reminder] Failed to send to ${reg.userEmail}:`,
            err.message
          );
        }
      }
    }
  }

  console.log("[Reminder] Job complete.");
}

/**
 * Start the daily cron scheduler.
 * Runs every day at 8:00 AM server time.
 */
export function startReminderScheduler() {
  cron.schedule("0 8 * * *", () => {
    runReminderJob().catch((err) =>
      console.error("[Reminder] Cron job error:", err)
    );
  });

  console.log("[Reminder] Scheduler started — runs daily at 8:00 AM.");
}

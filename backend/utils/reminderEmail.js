/**
 * getReminderEmail
 * Generates a styled HTML reminder email.
 *
 * @param {object} params
 * @param {string} params.firstName     - Recipient's first name
 * @param {string} params.eventTitle    - Event title
 * @param {string} params.eventDate     - Formatted event date string
 * @param {string} params.venue         - Event location
 * @param {number} params.daysLeft      - Days until event (0 = just registered)
 */
export function getReminderEmail({ firstName, eventTitle, eventDate, venue, daysLeft }) {
  // Determine the badge color and message based on days left
  const isConfirmation = daysLeft === 0;
  const isTomorrow = daysLeft === 1;

  let badgeText;
  let badgeBg;
  let headingText;
  let bodyText;

  if (isConfirmation) {
    badgeText = "Registration Confirmed";
    badgeBg = "linear-gradient(135deg, #1a5e2e 0%, #2d7a45 100%)";
    headingText = "You're all set! 🎉";
    bodyText = `Your registration for <strong>${eventTitle}</strong> has been confirmed. We look forward to seeing you there!`;
  } else if (isTomorrow) {
    badgeText = "Tomorrow!";
    badgeBg = "linear-gradient(135deg, #7a1e1e 0%, #9a2e2e 100%)";
    headingText = "Your event is tomorrow! 🚀";
    bodyText = `Just a reminder — <strong>${eventTitle}</strong> starts <strong>tomorrow</strong>. Don't forget to attend!`;
  } else {
    badgeText = `${daysLeft} Days Left`;
    badgeBg = "linear-gradient(135deg, #2f3e4e 0%, #3d5466 100%)";
    headingText = `${daysLeft} days to go!`;
    bodyText = `Just a friendly reminder that <strong>${eventTitle}</strong> is coming up in <strong>${daysLeft} days</strong>. Mark your calendar!`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf7f2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf7f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 3px solid #7a1e1e;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #2f3e4e;">OUEvents</h1>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280; letter-spacing: 2px; text-transform: uppercase;">
                Open University of Sri Lanka
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">

              <p style="margin: 0 0 8px 0; font-size: 15px; color: #6b7280;">Hi ${firstName},</p>
              <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #2f3e4e;">${headingText}</h2>
              <p style="margin: 0 0 28px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">${bodyText}</p>

              <!-- Countdown Badge -->
              <div style="background: ${badgeBg}; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 28px 0;">
                <p style="margin: 0 0 6px 0; font-size: 12px; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 2px;">
                  ${isConfirmation ? "Registered" : "Starts in"}
                </p>
                <p style="margin: 0; font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: 4px;">
                  ${badgeText}
                </p>
              </div>

              <!-- Event Details Card -->
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 0 0 28px 0; border-left: 4px solid #7a1e1e;">
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Event Details</p>
                <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #2f3e4e;">${eventTitle}</p>
                <p style="margin: 0 0 6px 0; font-size: 14px; color: #6b7280;">📅 ${eventDate}</p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">📍 ${venue}</p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.6;">
                This is an automated message from OUEvents. Please do not reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #2f3e4e; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; text-align: center;">
                <strong>OUEvents</strong> — Your Campus Event Platform
              </p>
              <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.6); text-align: center;">
                © ${new Date().getFullYear()} Open University of Sri Lanka. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

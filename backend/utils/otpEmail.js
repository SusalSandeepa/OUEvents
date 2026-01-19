// Email template for OTP password reset
export function getOTPEmail(otp) {
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
        <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Logo/Brand -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 3px solid #7a1e1e;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #2f3e4e;">
                OUEvents
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280; letter-spacing: 2px; text-transform: uppercase;">
                Open University of Sri Lanka
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #2f3e4e; text-align: center;">
                Password Reset Request
              </h2>
              <p style="margin: 0 0 30px 0; font-size: 15px; color: #6b7280; text-align: center; line-height: 1.6;">
                We received a request to reset your password. Use the verification code below to complete the process.
              </p>
              
              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #7a1e1e 0%, #9a2e2e 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 30px 0;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 2px;">
                  Your Verification Code
                </p>
                <p style="margin: 0; font-size: 42px; font-weight: 700; color: #ffffff; letter-spacing: 8px;">
                  ${otp}
                </p>
              </div>
              
              <!-- Warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 16px; margin: 0 0 30px 0;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  ⚠️ This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
                </p>
              </div>
              
              <!-- Footer Note -->
              <p style="margin: 0; font-size: 14px; color: #9ca3af; text-align: center; line-height: 1.6;">
                If you didn't request this password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #2f3e4e; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; text-align: center;">
                <strong>OUEvents</strong> - Your Campus Event Platform
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

// process.env mapping loaded securely by backend/server.js
const nodemailer = require("nodemailer");

function sendAlert(subject, message) {
  const EMAIL = process.env.ALERT_EMAIL;
  const PASSWORD = process.env.ALERT_PASSWORD;
  const RECIPIENTS = process.env.ALERT_RECIPIENTS || EMAIL;

  if (!EMAIL || !PASSWORD) {
    console.log("⚠️ EMAIL ALERTS DISABLED. Add ALERT_EMAIL and ALERT_PASSWORD to backend/.env");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: RECIPIENTS,
    subject: `[SPECTR SYSTEM] ${subject}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("❌ Failed to send alert email:", err.message);
    } else {
      console.log(`✅ Intrusion Alert Email Sent Successfully to ${RECIPIENTS}!`);
    }
  });
}

module.exports = { sendAlert };
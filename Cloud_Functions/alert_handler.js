require("dotenv").config();
const nodemailer = require("nodemailer");

const EMAIL = "your_email@gmail.com";
const PASSWORD = "abcdefghijklmnop";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

function sendAlert(subject, message) {
  const mailOptions = {
    from: EMAIL,
    to: EMAIL,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { sendAlert };
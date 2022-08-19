var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();

var transporter = nodemailer.createTransport(
  smtpTransport({
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
);

exports.sendMail = (text) => {
  var mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.TARGET_MAIL,
    subject: "Train Update",
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

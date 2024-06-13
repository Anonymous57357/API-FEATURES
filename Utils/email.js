const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // CREATE A TRANSPORTER (MAIL-TRAP)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // a transporter is a service is reponsible to send the email

  // DEFINE EMAIL OPTIONS
  const emailOptions = {
    from: `Cineflex support<support>@cineflix.com`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;

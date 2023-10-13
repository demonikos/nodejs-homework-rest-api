const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD, BASE_URL } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "gorskyidmytro@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (UserEmail, verificationToken) => {
  try {
    const email = {
      to: UserEmail,
      from: "gorskyidmytro@meta.ua",
      subject: "Registration successfull, please verify yourself",
      html: `To verify your account, please follow the link: <a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify</a>`,
    };

    // const email = { ...data, from: "rest-api@gmail.com" };
    await transporter.sendMail(email);
    console.log("Email send success!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;

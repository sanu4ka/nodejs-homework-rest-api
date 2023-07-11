const sgMail = require("@sendgrid/mail");

const sendMail = async function (email, token) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Sending with SendGrid is Fun",
    text: "Please click link below to pass verification",
    html: `<a href="/users/verify/${token}">"Please click link to pass verification"</a>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Verification email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendMail;

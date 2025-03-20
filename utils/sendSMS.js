const twilio = require("twilio");
require("dotenv").config(); // Load environment variables

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const sendSMS = async (phoneNumber, message) => {
  try {
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    console.log("SMS sent successfully");
  } catch (error) {
    console.error("SMS send failed", error);
  }
};

module.exports = sendSMS;

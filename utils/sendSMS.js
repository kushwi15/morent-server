// const twilio = require("twilio");
// require("dotenv").config(); // Load environment variables

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// const client = new twilio(accountSid, authToken);

// const sendSMS = async (phoneNumber, message) => {
//   try {
//     await client.messages.create({
//       body: message,
//       from: twilioPhoneNumber,
//       to: phoneNumber,
//     });
//     console.log("SMS sent successfully");
//   } catch (error) {
//     console.error("SMS send failed", error);
//   }
// };

// module.exports = sendSMS;


const twilio = require("twilio");
require("dotenv").config();

// Validate environment variables immediately
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error("Twilio credentials are missing in environment variables");
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send SMS with enhanced validation and retry logic
 * @param {string} phoneNumber - Recipient phone number in E.164 format
 * @param {string} message - Message content
 * @param {number} retries - Number of retry attempts (default: 1)
 * @returns {Promise<boolean>} - Returns true if successful
 */
const sendSMS = async (phoneNumber, message, retries = 1) => {
  // Enhanced phone number validation
  if (typeof phoneNumber !== 'string' || !phoneNumber.startsWith('+')) {
    throw new Error('Phone number must be in E.164 format (e.g., +1234567890)');
  }

  // Message length validation (Twilio limit: 1600 chars)
  if (message.length > 1600) {
    throw new Error('Message exceeds maximum length of 1600 characters');
  }

  let attempt = 0;
  let lastError = null;

  while (attempt < retries) {
    try {
      attempt++;
      
      const result = await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: phoneNumber
      });
      
      console.log(`SMS sent successfully to: ${phoneNumber} (attempt ${attempt})`);
      console.log(`Twilio message SID: ${result.sid}`);
      return true;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for ${phoneNumber}:`, error.message);
      
      // Only retry on rate limit or temporary errors
      if (error.code !== 20429 && attempt < retries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`All ${retries} attempts failed for ${phoneNumber}`);
  throw lastError || new Error('Failed to send SMS');
};

module.exports = sendSMS;
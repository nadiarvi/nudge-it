const HttpError = require("../models/http-error");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { checkGroupExists, checkUserExists } = require("../utils/validators");

dotenv.config();

const sendPushNotification = async (receiverId, groupId, taskId) => {
  // Simulate sending a push notification
  console.log(`Push notification sent to user ${receiverId} for group ${groupId}, task ${taskId}`);
  return true;
};

const simulatePhoneCall = async (receiverId, groupId, taskId) => {
  // Simulate a phone call
  console.log(`Simulated phone call to user ${receiverId} for group ${groupId}, task ${taskId}`);
  return true;
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendEmailToTA = async (taEmail, groupId, receiverId) => {
    // let existingGroup, receiver;
    // try {
    //     existingGroup = await checkGroupExists(groupId);
    // } catch (err) {
    //     return next(err);
    // }

    // try {
    //     receiver = await checkUserExists(receiverId);
    // } catch (err) {
    //     return next(err);
    // }

    // Dummy data, to be deleted later
    const existingGroup = {
        name: "CS473"
    }

    const receiver = {
        name: "free-rider"
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: taEmail,
        subject: `[Nudge] Issue with Group Member in Group ${existingGroup.name}`,
        text: `Dear TA,
I'm writing you this email to notify that ${receiver.name} did not do their part in the group project.
We have sent reminders to them but they still did not do their part.

Thank you for your help!

Best,
Student
        `
    };

    await transporter.sendMail(mailOptions);
    console.log("An email is sent to TA");
}

const handleNudgeDelivery = async (type, receiverId, groupId, taskId, taEmail) => {
  try {
    switch (type) {
      case "reminder":
        await sendPushNotification(receiverId, groupId, taskId);
        break;

      case "phone_call":
        await simulatePhoneCall(receiverId, groupId, taskId);
        break;

      case "email_ta":
        if (!taEmail) throw new HttpError("TA email not available", 400);
        await sendEmailToTA(taEmail, groupId, receiverId);
        break;

      default:
        throw new HttpError("Unknown nudge type", 400);
    }

  } catch (err) {
        console.error("Nudge delivery failed:", err);
        if (err instanceof HttpError) throw err;
        throw new HttpError("Nudge delivery failed", 500);
  }
};


// For testing purposes
// if (require.main === module) {
//     (async () => {
//         try {
//             await sendEmailToTA(
//                 "dellptri@gmail.com",
//                 "dummyGroupId",
//                 "dummyReceiverId"
//             );
//             console.log("Test email sent successfully!");
//         } catch (err) {
//             console.error("Error sending test email:", err);
//         }
//     })();
// }
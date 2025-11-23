const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { Expo } = require("expo-server-sdk");
const ExpoSDK = require("expo-server-sdk").Expo;
const ExpoPush = new ExpoSDK();

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Group = require("../models/group");
const Task = require("../models/task");
const { checkGroupExists, checkUserExists } = require("../utils/validators");
const user = require("../models/user");

dotenv.config();

const sendPushNotification = async (receiverId, groupId, taskId) => {
    try {
        const [receiver, group, task] = await Promise.all([
            User.findById(receiverId),
            Group.findById(groupId),
            Task.findById(taskId)
        ]);

        if (!receiver) throw new HttpError("Receiver not found", 404);
        if (!group) throw new HttpError("Group not found", 404);
        if (!task) throw new HttpError("Task not found", 404);

        const tokens = receiver.expo_push_tokens || [];
        if (tokens.length === 0) {
            console.log("No Expo push token for user", receiver.name);
            return false;
        }

        // send a push notification
        const messages = tokens.map(token => {
            if (!ExpoPush.isExpoPushToken(token)) {
                console.warn("Invalid Expo push token:", token);
                return null;
            }

            return {
                to: token,
                sound: 'default',
                title: `[${group.name}] ${task.title} 🌱`,
                body: 'Someone sent you a nudge. A quick start today keeps the team moving.',
                data: {
                    groupId: groupId.toString(),
                    taskId: taskId.toString()
                }
            }
        }).filter(Boolean);

        const chunks = ExpoPush.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of chunks) {
            try {
                const ticketChunk = await ExpoPush.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (err) {
                console.error("Error sending push chunk:", err);
            }
        }
        console.log("Pushed a notification");
        return true;
    } catch (err) {
        console.error("Failed to send push notification:", err);
        return false;
    }
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

module.exports = {
  sendPushNotification,
  simulatePhoneCall,
  sendEmailToTA,
  handleNudgeDelivery
}


// For testing purposes
if (require.main === module) {
    (async () => {
        try {
            await sendEmailToTA(
                "yonglin2902@gmail.com",
                "dummyGroupId",
                "dummyReceiverId"
            );
            console.log("Test email sent successfully!");
        } catch (err) {
            console.error("Error sending test email:", err);
        }
    })();
}
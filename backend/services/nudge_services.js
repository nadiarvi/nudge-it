const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { Expo } = require("expo-server-sdk");
const ExpoSDK = require("expo-server-sdk").Expo;
const ExpoPush = new ExpoSDK();

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Group = require("../models/group");
const Task = require("../models/task");
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
            if (!ExpoSDK.isExpoPushToken(token)) {
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
            if (!ExpoSDK.isExpoPushToken(token)) {
                console.warn("Invalid Expo push token:", token);
                return null;
            }

            return {
                to: token,
                sound: 'default',
                title: `[${group.name}] ${task.title} ⚠️`,
                body: 'Someone sent you a phone call. Please do your task immediately.',
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

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendEmailToTA = async (taEmail, groupId, senderId, receiverId) => {
    try {
        const [sender, receiver, group, task] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId),
            Group.findById(groupId),
            Task.findById(taskId)
        ]);

        if (!receiver) throw new HttpError("Receiver not found", 404);
        if (!group) throw new HttpError("Group not found", 404);
        if (!task) throw new HttpError("Task not found", 404);

        const receiverTokens = receiver.expo_push_tokens || [];
        if (receiverTokens.length === 0) {
            console.log("No Expo push token for user", receiver.name);
            return false;
        }

        // send a push notification to the receiver
        const messages = receiverTokens.map(token => {
            if (!ExpoSDK.isExpoPushToken(token)) {
                console.warn("Invalid Expo push token:", token);
                return null;
            }

            return {
                to: token,
                sound: 'default',
                title: `[${group.name}] ${task.title} ‼️`,
                body: 'An email was sent to the TA because you did not do this work.',
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
        console.log("Pushed a notification to receiver");

        // send a push notification to the sender
        const senderTokens = sender?.expo_push_tokens || [];
        if (senderTokens.length > 0) {
            const senderMessages = senderTokens.map(token => {
                if (!ExpoSDK.isExpoPushToken(token)) {
                    console.warn("Invalid Expo push token for sender:", token);
                    return null;
                }
                return {
                    to: token,
                    sound: 'default',
                    title: `[${group.name}] Nudge Sent`,
                    body: `An email is sent to the TA regarding ${receiver.first_name}`,
                    data: {
                        groupId: groupId.toString(),
                        taskId: taskId.toString()
                    }
                }
            }).filter(Boolean);
            const senderChunks = ExpoPush.chunkPushNotifications(senderMessages);
            for (const chunk of senderChunks) {
                try {
                    await ExpoPush.sendPushNotificationsAsync(chunk);
                } catch (err) {
                    console.error("Error sending push chunk to sender:", err);
                }
            }
            console.log("Pushed a notification to sender");
        }
    } catch (err) {
        console.error("Failed to send push notification:", err);
    }

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

const handleNudgeDelivery = async (type, senderId, receiverId, groupId, taskId, taEmail) => {
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
                await sendEmailToTA(taEmail, groupId, senderId, receiverId);
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
// if (require.main === module) {
//     (async () => {
//         try {
//             await sendEmailToTA(
//                 "yonglin2902@gmail.com",
//                 "dummyGroupId",
//                 "dummyReceiverId"
//             );
//             console.log("Test email sent successfully!");
//         } catch (err) {
//             console.error("Error sending test email:", err);
//         }
//     })();
// }
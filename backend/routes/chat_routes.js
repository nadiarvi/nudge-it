const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const chatControllers = require("../controllers/chat_controllers");
const {
    createOrGetChat,
    getUserChats,
    getChatById,
    sendUserMessage,
    confirmUserMessage,
    sendNuggetMessage,
    markMessagesAsRead,
    getNotificationCount
} = chatControllers;

// Create or get a chat between two users in a group
router.post(
    "/create/:uid",
    [
        check("otherUserId").notEmpty(),
        check("groupId").notEmpty(),
        check("type").isIn(["user", "nugget"]),
    ],
    createOrGetChat
);

// Get all chats for current user in the current group
router.get("/:gid/:uid", getUserChats);

// Get a specific chat
router.get("/:cid", getChatById);

// Send a message for user chat (with revision check)
router.post(
    "/:cid/:uid/user",
    [
        check("content").notEmpty()
    ],
    sendUserMessage
);

// Confirm and save user message after revision
router.post(
    "/:cid/:uid/confirm",
    [
        check("chosenContent").notEmpty()
    ],
    confirmUserMessage
);

// Send a message for nugget chat
router.post(
    "/:cid/:uid/nugget",
    [
        check("content").notEmpty()
    ],
    sendNuggetMessage
);

// Mark all messages as read for a user in a chat
router.patch("/:cid/:uid/read", markMessagesAsRead);

// Get notification count for a chat partner
router.post("/notification/:uid", getNotificationCount);

module.exports = router;

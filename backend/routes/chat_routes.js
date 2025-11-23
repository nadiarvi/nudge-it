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
    sendNuggetMessage
} = chatControllers;

// Create or get a chat between two users in a group
router.post(
    "/create",
    [
        check("otherUserId").notEmpty(),
        check("groupId").notEmpty(),
        check("type").isIn(["user", "nugget"]),
    ],
    createOrGetChat
);

// Get all chats for current user
router.get("/get", getUserChats);

// Get a specific chat
router.get("/:cid", getChatById);

// Send a message for user chat (with revision check)
router.post(
    "/:cid/messages/user",
    [
        check("content").notEmpty()
    ],
    sendUserMessage
);

// Confirm and save user message after revision
router.post(
    "/:cid/messages/confirm",
    [
        check("chosenContent").notEmpty()
    ],
    confirmUserMessage
);

// Send a message for nugget chat
router.post(
    "/:cid/messages/nugget",
    [
        check("content").notEmpty()
    ],
    sendNuggetMessage
);

module.exports = router;

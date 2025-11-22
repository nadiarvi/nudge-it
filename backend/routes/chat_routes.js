const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const chatControllers = require("../controllers/chat_controllers");
const {createOrGetChat, getUserChats, getChatById, sendMessage} = chatControllers;

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

// Send a message (user or nugget)
router.post(
    "/:cid/messages",
    [
        check("content").notEmpty(),
        check("senderType").isIn(["user", "nugget"]),
    ],
    sendMessage
);

module.exports = router;

const Chat = require("../models/chat");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const createOrGetChat = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(JSON.stringify(errors.array()), 422));
    }

    const { otherUserId, groupId, type } = req.body;
    const currentUserId = req.userData?.userId || req.body.currentUserId;

    if (!currentUserId) {
        return next(new HttpError("No current user specified.", 400));
    }

    if (currentUserId.toString() === otherUserId.toString()) {
        return next(new HttpError("Cannot create a chat with yourself.", 400));
    }

    try {
        // Try to find an existing chat for this pair + group + type
        const existingChat = await Chat.findOne({
            type,                     // "user" or "nugget" chat
            group_id: groupId,
            people: { $all: [currentUserId, otherUserId] },
        })
        .populate("people")
        .populate("messages.sender"); // populate human senders

        if (existingChat) {
            return res.status(200).json({ chat: existingChat });
        }

        // Otherwise create a new chat
        const newChat = new Chat({
            type,
            people: [currentUserId, otherUserId],
            group_id: groupId,
            messages: [],
        });

        await newChat.save();

        await newChat.populate("people");
        await newChat.populate("messages.sender");

        const populated = newChat;

        res.status(201).json({ chat: populated });
    } catch (err) {
        console.error(err);
        return next(
            new HttpError("Creating chat failed, please try again later.", 500)
        );
    }
};

const getUserChats = async (req, res, next) => {
    const currentUserId = req.userData?.userId || req.query.userId;

    if (!currentUserId) {
        return next(new HttpError("No current user specified.", 400));
    }

    try {
        const chats = await Chat.find({
            people: currentUserId,
        })
        .populate("people")
        .populate("messages.sender")
        .sort({ updatedAt: -1 });

        res.json({ chats });
    } catch (err) {
        console.error(err);
        return next(
            new HttpError("Fetching chats failed, please try again later.", 500)
        );
    }
};

const getChatById = async (req, res, next) => {
    const chatId = req.params.cid;

    try {
        const chat = await Chat.findById(chatId)
            .populate("people")
            .populate("messages.sender");

        if (!chat) {
            return next(new HttpError("Chat not found.", 404));
        }

        res.json({ chat });
    } catch (err) {
        console.error(err);
        return next(
            new HttpError("Fetching chat failed, please try again later.", 500)
        );
    }
};

const sendMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(JSON.stringify(errors.array()), 422));
    }

    const chatId = req.params.cid;
    const { content, senderType, senderId } = req.body;

    // For user messages, figure out who is sending
    const currentUserId =
        senderType === "user" ? (req.userData?.userId || senderId) : null;

    if (senderType === "user" && !currentUserId) {
        return next(new HttpError("No sender specified for user message.", 400));
    }

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return next(new HttpError("Chat not found.", 404));
        }

        // If it's a user message, ensure the sender is in this chat
        if (senderType === "user") {
            const isParticipant = chat.people.some(
                (id) => id.toString() === currentUserId.toString()
            );
            if (!isParticipant) {
                return next(
                    new HttpError("You are not a participant in this chat.", 403)
                );
            }

            chat.messages.push({
                senderType: "user",
                sender: currentUserId,
                content,
            });
        } else {
            chat.messages.push({
                senderType: "nugget",
                content,
            });
        }

        await chat.save();

        await chat.populate("messages.sender");
        await chat.populate("people");

        const populated = chat;

        res.status(201).json({
            message: "Message sent.",
            chat: populated,
        });
    } catch (err) {
        console.error(err);
        return next(
            new HttpError("Sending message failed, please try again later.", 500)
        );
    }
};

module.exports = {
    createOrGetChat,
    getUserChats,
    getChatById,
    sendMessage,
};

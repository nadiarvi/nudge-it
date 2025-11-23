const Chat = require("../models/chat");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { checkGroupExists } = require("../utils/validators");
const { getAdvice, reviseMessage } = requier("../services/openai_services");

const createOrGetChat = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(JSON.stringify(errors.array()), 422));
    }

    const { otherUserId, groupId, type } = req.body;
    const currentUserId = req.userData?.id || req.params?.uid;

    if (!currentUserId) {
        return next(new HttpError("No current user specified.", 400));
    }

    if (currentUserId.toString() === otherUserId?.toString()) {
        if (type === "user") {
            return next(new HttpError("Cannot create a chat with yourself.", 400));
        }
        else if (type === "nugget") {
            return next(new HttpError("Cannot consult about yourself.", 400));
        }
    }

    try {
        // Try to find an existing chat for this pair + group + type
        let existingChat;

        if (type === "user") {
            existingChat = await Chat.findOne({
                type: "user",
                group_id: groupId,
                people: { $all: [currentUserId, otherUserId] },
            });
        } else if (type === "nugget") {
            existingChat = await Chat.findOne({
                type: "nugget",
                group_id: groupId,
                people: currentUserId,
                about: otherUserId,
            });
        }

        if (existingChat) {
            return res.status(200).json({ chat: existingChat });
        }

        // Otherwise create a new chat
        let newChat;
        if (type === "user") {
            newChat = new Chat({
                type: "user",
                people: [currentUserId, otherUserId],
                group_id: groupId,
                messages: [],
            });
        } else if (type === "nugget") {
            newChat = new Chat({
                type: "nugget",
                people: [currentUserId],
                group_id: groupId,
                about: otherUserId,
                messages: [],
            });
        }

        await newChat.save();
        await newChat.populate("people").populate("messages");

        res.status(201).json({ chat: newChat });
    } catch (err) {
        console.error(err);
        return next(
            new HttpError("Creating chat failed, please try again later.", 500)
        );
    }
};

// get all chats that involves the current user in the current group
const getUserChats = async (req, res, next) => {
    const { gid } = req.params;
    const currentUserId = req.userData?.id || req.query.uid;

    try {
        const existingGroup = checkGroupExists(gid);
    } catch (err) {
        return next(new HttpError("Fetching group failed", 500));
    }

    if (!currentUserId) {
        return next(new HttpError("No current user specified.", 400));
    }

    try {
        const chats = await Chat.find({
            people: currentUserId,
            group_id: gid
        })
        .populate("people")
        .sort({ updatedAt: -1 });

        res.status(200).json({ chats });
    } catch (err) {
        console.error(err);
        return next(
            new HttpError("Fetching chats failed, please try again later.", 500)
        );
    }
};

const getChatById = async (req, res, next) => {
    const { cid } = req.params;
    let existingChat;

    try {
        existingChat = await Chat.findById(cid)
            .populate("people")
        
        if (!existingChat) {
            return next(new HttpError("Chat not found", 404));
        }

        res.status(200).json({ existingChat });
    } catch (err) {
        console.error(err);
        return next(
            new HttpError("Fetching chat failed, please try again later.", 500)
        );
    }
}

// send message for user chat (revise tone)
const sendUserMessage = async (req, res, next) => {
    const { content } = req.body;
    const chatId = req.params.cid;
    const currentUserId = req.userData.id;
    try {
        let chat = await Chat.findById(chatId);
        if (!chat) return next(new HttpError("Chat not found", 404));
        const otherUserId = chat.people.find(p => p.toString() !== currentUserId.toString());

        // Revise tone
        const revision = await reviseMessage(content);
        if (revision.revise) {
            // Ask user to confirm which message to use
            return res.status(200).json({
                needsRevision: true,
                original: content,
                suggestion: revision.suggestion
            });
        } else {
            // Save original message
            chat.messages.push({
                senderType: "user",
                sender: currentUserId,
                receiver: otherUserId,
                content
            });
            await chat.save();
            return res.status(201).json({ message: "Message sent", chat, needsRevision: false });
        }
    } catch (err) {
        return next(new HttpError("Sending failed", 500));
    }
};

const confirmUserMessage = async (req, res, next) => {
    const { chosenContent } = req.body;
    const chatId = req.params.cid;
    const currentUserId = req.userData.id;

    try {
        let chat = await Chat.findById(chatId);
        if (!chat) return next(new HttpError("Chat not found", 404));
        const otherUserId = chat.people.find(p => p.toString() !== currentUserId.toString());
        chat.messages.push({
            senderType: "user",
            sender: currentUserId,
            receiver: otherUserId,
            content: chosenContent,
            timestamp: Date.now
        });
        await chat.save();
        return res.status(201).json({ message: "Message sent", chat });
    } catch (err) {
        return next(new HttpError("Confirming message failed", 500));
    }
};

// send message for nugget chat (get advice)
const sendNuggetMessage = async (req, res, next) => {
    const { content } = req.body;
    const chatId = req.params.cid;
    const currentUserId = req.userData.id;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return next(new HttpError("Chat not found", 404));
        
        // Save user's message
        chat.messages.push({
            senderType: "user",
            sender: currentUserId,
            content,
            timestamp: Date.now
        });
        await chat.save();

        // Generate nugget response
        const botReply = await getAdvice(chat.group_id, currentUserId, chat.about, content);
        chat.messages.push({
            senderType: "nugget",
            sender: null,
            receiver: currentUserId,
            content: botReply,
            timestamp: Date.now
        });

        await chat.save();
        res.status(201).json({ chat });
    } catch (err) {
        return next(new HttpError("Sending nugget message failed", 500));
    }
};

module.exports = {
    createOrGetChat,
    getUserChats,
    getChatById,
    sendUserMessage,
    confirmUserMessage,
    sendNuggetMessage,
};
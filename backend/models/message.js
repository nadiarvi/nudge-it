const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    senderType: {
        type: String,
        enum: ["user", "nugget"],   // who sent this message
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",               // only used when senderType === "user"
        default: null             // will stay null for nugget
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = MessageSchema;


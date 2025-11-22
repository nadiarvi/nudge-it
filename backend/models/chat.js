const mongoose = require("mongoose");
const MessageSchema = require("./message");

const ChatSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["user", "nugget"],
        required: true
    }, // contact type
    people: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    group_id: { type: mongoose.Types.ObjectId, ref: "Group" },
    messages: [MessageSchema]
  },
  { timestamps: true });
  
  module.exports = mongoose.model('Chat', ChatSchema);
const mongoose = require("mongoose");
const MessageSchema = require("./message");

const ChatSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["user", "nugget"],
        required: true
    }, // contact type
    people: {
        type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length >= 1;
            },
            message: "Chat must include at least one user in `people`."
        }
    },
    group_id: { type: mongoose.Types.ObjectId, ref: "Group" , required: true},
    about: { type: mongoose.Types.ObjectId, ref: "User" }, // if nugget chat
    messages: [MessageSchema]
  },
  { timestamps: true }
);
  
  module.exports = mongoose.model('Chat', ChatSchema);
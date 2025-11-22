const mongoose = require("mongoose");

const NudgeSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["reminder", "phone_call", "email_ta"],
        required: true
    },
    group_id: { type: mongoose.Types.ObjectId, ref: "Group", required: true },
    task_id: { type: mongoose.Types.ObjectId, ref: "Task", required: true }, 
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    ta_email: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Nudge", NudgeSchema);
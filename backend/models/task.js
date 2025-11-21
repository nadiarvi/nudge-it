const mongoose = require("mongoose");
const { TASK_STATUS } = require("../constants");

// Comment inside of the task
const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Nudge per task
const NudgeSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: Number, enum: [1, 2, 3], required: true }, // type of nudge (1, 2, 3)
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    title: { type: String },
    deadline: { type: Date, default: Date.now },
    assignee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: TASK_STATUS.ALL, default: TASK_STATUS.TODO },
    comments: [CommentSchema],
    nudges: [NudgeSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Task', TaskSchema);
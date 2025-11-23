const mongoose = require("mongoose");
const Nudge = require ("../models/nudge");
const { TASK_STATUS } = require("../constants");

// Comment inside of the task
const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    title: { type: String },
    deadline: { type: Date, default: Date.now },
    assignee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: TASK_STATUS.ALL, default: TASK_STATUS.TODO },
    comments: [CommentSchema],
    nudges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Nudge' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Task', TaskSchema);
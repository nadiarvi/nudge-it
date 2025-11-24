const Task = require("../models/task");
const HttpError = require("../models/http-error");
const { checkGroupExists } = require("../utils/validators");
const { validationResult } = require("express-validator");

const createTask = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError(JSON.stringify(errors), 422)
        );
    }

    const { group_id, title, deadline, assignee, reviewer, status, comments, nudges, createdAt, updatedAt } = req.body;

    let newTask;
    try {
        newTask = new Task({
            group_id,
            title,
            deadline,
            assignee,
            reviewer,
            status,
            comments,
            nudges,
            createdAt,
            updatedAt
        });
        await newTask.save();
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            "Failed to create a task, please try again later.", 500
        );
        return next(error);
    }

    res.status(201).json({ taskId: newTask.id, task: newTask});
}

// GET task by task ID
const retrieveTask = async (req, res, next) => {
    const { tid, gid } = req.params;
    let existingTask;

    try {
        await checkGroupExists(gid);
    } catch (err) {
        return next(err);
    }

    try {
        existingTask = await Task.findOne({ _id: tid, group_id: gid }).populate("assignee").populate("reviewer");
        if (!existingTask) {
            return next(new HttpError('Task does not exist', 400));
        }
    } catch (err) {
        const error = new HttpError('Retrieving task failed, please try again later.', 500);
        return next(error);
    }

    res.json({
        ...existingTask._doc
    })
}

// get all tasks of a group
const getTasks = async (req, res, next) => {
    const { gid } = req.params;
    let tasks;
    let totalTasks;
    let results;

    try {
        tasks = await Task.find({ group_id: gid }).populate("assignee").populate("reviewer");
        totalTasks = await Task.countDocuments({ group_id: gid });

        results = {
            tasks: tasks.map(task => {
                const _task = task.toObject({ getters: true });
                return {
                    ..._task
                }
            }),
            total_tasks: totalTasks
        }
    } catch (err) {
        console.error(err);
        const error = new HttpError('Fetching tasks failed, please try again later.', 500);
        return next(error);
    }
    res.json(results);
}

// get all tasks related to a user in a group
const getTaskByUser = async (req, res, next) => {
    const { gid, uid } = req.params;
    try {
        await checkGroupExists(gid);
        // Find tasks assigned to the user
        const toDoTasks = await Task.find({ group_id: gid, assignee: uid })
            .populate("assignee")
            .populate("reviewer");
        // Find tasks to review by the user
        const toReviewTasks = await Task.find({ group_id: gid, reviewer: uid, status: 'In Review' })
            .populate("assignee")
            .populate("reviewer");

        // Helper to format task
        const formatTask = (task) => ({
            id: task._id,
            title: task.title,
            deadline: task.deadline,
            assignee: Array.isArray(task.assignee) ? task.assignee[0] : task.assignee,
            status: task.status,
            reviewer: task.reviewer || 'Not Assigned',
            nudges: Array.isArray(task.nudges) ? task.nudges.length : 0,
        });

        const result = [
            {
                category: 'To Do',
                tasks: toDoTasks.filter(t => t.status === 'To-Do' || t.status === 'Revise').map(formatTask)
            },
            {
                category: 'To Review',
                tasks: toReviewTasks.map(formatTask)
            },
            {
                category: 'Pending for Review',
                tasks: toDoTasks.filter(t => t.status === 'In Review').map(formatTask)
            }
        ];
        res.json({ result });
    } catch (err) {
        console.error(err);
        return next(new HttpError('Fetching user tasks failed, please try again later.', 500));
    }
};

const deleteTask = async (req, res, next) => {
    const { tid, gid } = req.params;
    let existingTask;

    try {
        await checkGroupExists(gid);
    } catch (err) {
        return next(err);
    }

    try {
        existingTask = await Task.findOne({ _id: tid, group_id: gid });
        if (!existingTask) {
            return next(new HttpError('Task does not exist', 400));
        }

        await existingTask.remove();
    } catch (err) {
        const error = new HttpError('Fetching task failed, please try again later.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Task deleted', taskId: existingTask.id});
}

const updateTask = async (req, res, next) => {
    const { tid, gid } = req.params;
    const { title, deadline, assignee, reviewer, status, comments, nudges } = req.body;
    let existingTask;
    try {
        await checkGroupExists(gid);
        existingTask = await Task.findOne({ _id: tid, group_id: gid });
        if (!existingTask) {
            return next(new HttpError('Task does not exist', 400));
        }
        if (title !== undefined) existingTask.title = title;
        if (deadline !== undefined) existingTask.deadline = deadline;
        if (assignee !== undefined) existingTask.assignee = assignee;
        if (reviewer !== undefined) existingTask.reviewer = reviewer;
        if (status !== undefined) existingTask.status = status;
        if (comments !== undefined) existingTask.comments = comments;
        if (nudges !== undefined) existingTask.nudges = nudges;
        await existingTask.save();
        res.status(200).json({ message: 'Task updated', task: existingTask });
    } catch (err) {
        console.error(err);
        return next(new HttpError('Updating task failed, please try again later.', 500));
    }
};

module.exports = {
    createTask,
    retrieveTask,
    getTasks,
    getTaskByUser,
    updateTask,
    deleteTask
}
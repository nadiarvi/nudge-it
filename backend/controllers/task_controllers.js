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

    const { group_id, title, deadline, assignee, status, comments, nudges, createdAt, updatedAt } = req.body;

    let newTask;
    try {
        newTask = new Task({
            group_id,
            title,
            deadline,
            assignee,
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
        console.log("lets check");
        await checkGroupExists(gid);
        console.log("-- oh the group exists!");
    } catch (err) {
        return next(err);
    }

    try {
        console.log("oh the group exists!");
        existingTask = await Task.findOne({ _id: tid, group_id: gid });
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

const getTasks = async (req, res, next) => {
    const { gid } = req.params;
    let tasks;
    let totalTasks;
    let results;

    try {
        tasks = await Task.find({ group_id: gid });
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

module.exports = {
    createTask,
    retrieveTask,
    getTasks,
    deleteTask
}
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const taskController = require("../controllers/task_controllers");
const { createTask, retrieveTask, getTasks, getTaskByUser, updateTask, deleteTask } = taskController;

router.post("/create",
    [
        check("group_id").notEmpty()
    ],
    createTask
);

router.get("/:gid/:tid", retrieveTask);

router.get("/:gid", getTasks);

router.get("/:gid/user/:uid", getTaskByUser);

router.delete("/:gid/:tid", deleteTask);

router.patch("/:gid/:tid", updateTask);

module.exports = router;
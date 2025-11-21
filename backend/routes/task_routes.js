const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const taskController = require("../controllers/task_controllers");
const { createTask, retrieveTask, getTasks, deleteTask } = taskController;

router.post("/create",
    [
        check("group_id").not().isEmpty()
    ],
    createTask
);

router.get("/:gid/:tid", retrieveTask);

router.get("/:gid", getTasks);

router.delete("/:gid/:tid", deleteTask);

module.exports = router;
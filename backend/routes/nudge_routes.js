const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const nudgeController = require("../controllers/nudge_controllers");
const { createNudge } = nudgeController;

router.post("/create",
    [
        check("type")
            .notEmpty().withMessage("Nudge type is required")
            .isIn(["reminder", "phone_call", "email_ta"]).withMessage("Invalid nudge type"),
        check("group_id")
            .notEmpty().withMessage("group_id is required")
            .isMongoId().withMessage("Invalid group_id"),
        check("task_id")
            .notEmpty().withMessage("task_id is required")
            .isMongoId().withMessage("Invalid task_id"),
        check("sender")
            .notEmpty().withMessage("sender is required")
            .isMongoId().withMessage("Invalid sender"),
        check("receiver")
            .notEmpty().withMessage("receiver is required")
            .isMongoId().withMessage("Invalid receiver")
    ],
    createNudge
);

module.exports = router;
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const groupController = require("../controllers/group_controllers");
const { createGroup, getGroup, deleteGroup, updateGroup, getMembers, addMembers, deleteMembers, joinGroup } = groupController;

router.post("/create/:uid",
    [
        check("name").notEmpty(),
        check("nudge_limit").optional().isInt({ min: 1 })
    ],
    createGroup
);

router.get("/:gid", getGroup);

router.delete("/:gid", deleteGroup);

router.patch("/:gid",
    [
        check("nudge_limit").optional().isInt({ min: 1 })
    ],
    updateGroup
);

router.get("/:gid/members", getMembers);

router.patch("/:gid/members", addMembers);

router.delete("/:gid/members", deleteMembers);

router.patch("/:uid/join", joinGroup);

module.exports = router;
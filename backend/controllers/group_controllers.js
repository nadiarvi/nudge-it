const Group = require("../models/group");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { checkGroupExists, checkUserExists } = require("../utils/validators");

const createGroup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError(JSON.stringify(errors), 422)
        );
    }

    const { name, members, ta_email, nudge_limit } = req.body;
    let newGroup;
    
    try {
        newGroup = new Group({
            name, members, ta_email, nudge_limit
        });
        await newGroup.save();
    } catch (err) {
        console.error(err);
        const error = new HttpError("Failed to create a group, please try again later.", 500);
        return next(error);
    }

    res.status(201).json({ groupId: newGroup.id, group: newGroup });
}

// GET group by ID
const getGroup = async (req, res, next) => {
    const { gid } = req.params;
    let existingGroup;

    try {
        existingGroup = (await checkGroupExists(gid)).populate("members");
    } catch (err) {
        return next(err);
    }

    res.json({
        ...existingGroup._doc
    })
}

const deleteGroup = async (req, res, next) => {
    const { gid } = req.params;
    let existingGroup;

    try {
        existingGroup = await checkGroupExists(gid);
        await existingGroup.remove();
    } catch (err) {
        const error = new HttpError("Fetching group failed, please try again later.", 500);
        return next(error);
    }

    res.status(200).json({ message: "Group deleted", groupId: existingGroup.id});
}

const updateGroup = async (req, res, next) => {
    const { gid } = req.params;
    const { name, ta_email, tasks, chats, nudge_limit } = req.body;
    let existingGroup;

    try {
        existingGroup = await checkGroupExists(gid);

        if (name !== undefined) existingGroup.name = name;
        if (ta_email !== undefined) existingGroup.ta_email = ta_email;
        if (tasks !== undefined) existingGroup.tasks = tasks;
        if (chats !== undefined) existingGroup.chats = chats;
        if (nudge_limit !== undefined) existingGroup.nudge_limit = nudge_limit;
        await existingGroup.save();
    } catch (err) {
        const error = new HttpError("Updating group failed, please try again later.", 500);
        return next(error);
    }
    res.status(200).json({ group: existingGroup });
}

// GET list of members
const getMembers = async (req, res, next) => {
    const { gid } = req.params;
    let existingGroup;

    try {
        existingGroup = await checkGroupExists(gid);
    } catch (err) {
        return next(err);
    }

    res.json({
        members: existingGroup.members
    })
}

const addMembers = async (req, res, next) => {
    const { gid } = req.params;
    const { userIds } = req.body;
    let existingGroup;

    try {
        existingGroup = await checkGroupExists(gid);

        for (const uid of userIds) {
            const user = await checkUserExists(uid);

            if (!existingGroup.members.includes(uid)) {
                existingGroup.members.push(uid);
                await existingGroup.save();
            }

            if (!user.groups.includes(gid)) {
                user.groups.push(gid);
                await user.save();
            }
        }
    } catch (err) {
        const error = new HttpError("Adding member failed, please try again later.", 500);
        return next(error);
    }
    res.status(200).json({
        message: "Member added to the group",
        existingGroup
    })
}

const deleteMembers = async (req, res, next) => {
    const { gid } = req.params;
    const { userIds } = req.body;
    let existingGroup;

    try {
        existingGroup = await checkGroupExists(gid);

        existingGroup.members = existingGroup.members.filter(
            member => !userIds.includes(member.toString())
        );
        await existingGroup.save();
    } catch (err) {
        const error = new HttpError("Deleting member failed, please try again later.", 500);
        return next(error);
    }
    res.status(200).json({ existingGroup });
}

module.exports = {
    createGroup,
    getGroup,
    deleteGroup,
    updateGroup,
    getMembers,
    addMembers,
    deleteMembers
}
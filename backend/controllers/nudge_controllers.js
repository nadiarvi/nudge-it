const Nudge = require("../models/nudge");
const User = require("../models/user");
const Group = require("../models/group");
const HttpError = require("../models/http-error");
const { checkGroupExists } = require("../utils/validators");
const { validationResult } = require("express-validator");
const Task = require("../models/task");
const { handleNudgeDelivery } = require("../services/nudge_services");

const createNudge = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError(JSON.stringify(errors), 422)
        );
    }

    const { type, group_id, tid, sender, receiver } = req.body;
    let existingGroup, newNudge;

    try {
        existingGroup = await checkGroupExists(group_id);
    } catch (err) {
        return next(err);
    }

    const ta_email = type === "email_ta" ? existingGroup.ta_email : undefined;

    try {
        newNudge = new Nudge({
            type,
            group_id,
            task_id: tid,
            sender,
            receiver,
            ta_email
        });

        await newNudge.save();

        // send actual action (push notification / call / email)
        await handleNudgeDelivery(type, receiver, group_id, tid, ta_email);

        // Add nudge to task
        if (tid) {
            await Task.findByIdAndUpdate(tid, { $push: { nudges: newNudge._id } });
        }
    } catch (err) {
        console.error(err);
        return next(new HttpError("Failed to create a nudge, please try again later", 500));
    }

    res.status(201).json({ message: "Nudge created", nudge: newNudge });
};

const getNudgesReceivedByUser = async (req, res, next) => {
    const { gid, uid } = req.params;
    try {
        const nudges = await Nudge.find({ group_id: gid, receiver: uid });
        res.status(200).json({ nudges, totalNudge: nudges.length });
    } catch (err) {
        return next(new HttpError("Failed to fetch received nudges", 500));
    }
};

const getNudgesSentByUser = async (req, res, next) => {
    const { gid, uid } = req.params;
    try {
        const nudges = await Nudge.find({ group_id: gid, sender: uid });
        res.status(200).json({ nudges, totalNudge: nudges.length });
    } catch (err) {
        return next(new HttpError("Failed to fetch sent nudges", 500));
    }
};

const getNudgesPerTask = async (req, res, next) => {
    const { gid, tid } = req.params;
    try {
        const nudges = await Nudge.find({ group_id: gid, task_id: tid });
        res.status(200).json({ nudges, totalNudge: nudges.length });
    } catch (err) {
        return next(new HttpError("Failed to fetch nudges for task", 500));
    }
};

module.exports = {
    createNudge,
    getNudgesReceivedByUser,
    getNudgesSentByUser,
    getNudgesPerTask
};
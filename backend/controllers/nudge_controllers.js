const Nudge = require("../models/nudge");
const User = require("../models/user");
const Group = require("../models/group");
const HttpError = require("../models/http-error");
const { checkGroupExists } = require("../utils/validators");

const createNudge = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError(JSON.stringify(errors), 422)
        );
    }

    const { type, gid, tid, sender, receiver } = req.body;
    let existingGroup, newNudge;

    try {
        existingGroup = await checkGroupExists(gid);
    } catch (err) {
        return next(err);
    }

    const ta_email = type === "email_ta" ? existingGroup.ta_email : undefined;

    try {
        newNudge = new Nudge({
            type,
            group_id: gid,
            task_id: tid,
            sender,
            receiver,
            ta_email
        });

        // send actual action (push notification / call / email)
        await handleNudgeDelivery(type, receiver, gid, tid, ta_email);
    } catch (err) {
        console.error(err);
        return next(new HttpError("Failed to create a nudge, please try again later", 500));
    }

    res.status(201).json({ message: "Nudge created", nudge: newNudge });
};

module.exports = {
    createNudge
}
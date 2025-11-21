const User = require("../models/user");
const Group = require("../models/group");
const HttpError = require("../models/http-error");

const checkUserExists = async (userId) => {
    let existingUser;
    try {
        existingUser = await User.findOne({ _id: userId }, '-password');
        if (!existingUser) {
            throw new HttpError('User does not exist', 404);
        }
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError('Fetching user failed, please try again later.', 500);
    }
    return existingUser;
};

const checkGroupExists = async (groupId) => {
    let existingGroup;
    try {
        existingGroup = await Group.findOne({ _id: groupId });
        if (!existingGroup) {
            throw new HttpError('Group does not exist', 404);
        }
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError('Fetching group failed, please try again later.', 500);
    }
}

module.exports = {
    checkUserExists,
    checkGroupExists
};
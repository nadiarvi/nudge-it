const User = require("../models/user");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(JSON.stringify(errors.array()), 422));
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new HttpError("User already exists.", 422));
        }
    } catch (err) {
        return next(new HttpError("Signup failed, please try again later.", 500));
    }

    const newUser = new User({ name, email, password });
    try {
        await newUser.save();
    } catch (err) {
        return next(new HttpError("Signup failed, please try again later.", 500));
    }

    res.status(201).json({ userId: newUser.id, user: newUser });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
        if (!existingUser || existingUser.password !== password) {
            return next(new HttpError("Invalid credentials.", 401));
        }
    } catch (err) {
        return next(new HttpError("Login failed, please try again later.", 500));
    }

    res.json({ message: "Login successful", userId: existingUser.id, user: existingUser });
};

const getUser = async (req, res, next) => {
    const { uid } = req.params;

    let user;
    try {
        user = await User.findById(uid);
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }
    } catch (err) {
        return next(new HttpError("Fetching user failed, please try again later.", 500));
    }

    res.json({ user });
};

const updateUser = async (req, res, next) => {
    const { uid } = req.params;
    const { name, email } = req.body;

    let user;
    try {
        user = await User.findById(uid);
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
    } catch (err) {
        return next(new HttpError("Updating user failed, please try again later.", 500));
    }

    res.json({ message: "User updated", user });
};

module.exports = {
    signup,
    login,
    getUser,
    updateUser
};
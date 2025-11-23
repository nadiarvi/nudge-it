const User = require("../models/user");
const HttpError = require("../models/http-error");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { checkUserExists } = require("../utils/validators");

dotenv.config();

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(JSON.stringify(errors.array()), 422));
    }

    const { first_name, last_name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new HttpError("User already exists.", 422));
        }
    } catch (err) {
        return next(new HttpError("Signup failed, please try again later.", 500));
    }

    const newUser = new User({ first_name, last_name, email, password });
    try {
        await newUser.save();

        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
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

        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
    } catch (err) {
        return next(new HttpError("Login failed, please try again later.", 500));
    }

    res.json({ message: "Login successful", userId: existingUser.id });
};

const getUser = async (req, res, next) => {
    const { uid } = req.params;

    let user;
    try {
        user = await User.findOne({ _id: uid }, '-password');
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }
    } catch (err) {
        return next(new HttpError("Fetching user failed, please try again later.", 500));
    }

    res.json({ user });
};

const updateUser = async (req, res, next) => {
    const { id } = req.userData;
    const { first_name, last_name, email, password } = req.body;

    let user;
    try {
        user = await User.findById(id);
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (password) user.password = password;
        await user.save();
    } catch (err) {
        return next(new HttpError("Updating user failed, please try again later.", 500));
    }

    res.json({ message: "User updated", user });
};

const addToken = async (req, res, next) => {
    const { id } = req.userData;
    const { pushToken } = req.body;
    let existingUser;

    if (!pushToken) {
        return next(new HttpError("Missing Expo Push Token", 400));
    }

    if (!pushToken.startsWith("ExponentPushToken")) {
        return next(new HttpError("Invalid expo push token", 400));
    }

    try {
        existingUser = await User.findById(id);
        if (!existingUser.expo_push_tokens.includes(pushToken)) {
            existingUser.expo_push_tokens.push(pushToken);
            await existingUser.save();
        }
    } catch (err) {
        return next(new HttpError("Failed to register Expo push token", 500));
    }

    res.status(200).json({ message: "Expo push token registered" });
}

module.exports = {
    signup,
    login,
    getUser,
    updateUser,
    addToken
};
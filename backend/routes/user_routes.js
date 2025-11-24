const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const userControllers = require("../controllers/user_controllers");
const { signup, login, getUser, updateUser, addToken } = userControllers;
const { checkAuthUser } = require("../middleware/check_auth");

router.post(
    "/signup",
    [
        check("first_name").notEmpty().withMessage("First name is required."),
        check("last_name").notEmpty().withMessage("Last name is required."),
        check("email")
        .notEmpty().withMessage("Email is required.").bail()
        .isEmail().withMessage("Please provide a valid email address."),
        check("password")
        .notEmpty().withMessage("Password is required.").bail()
        .isLength({ min: 8 }.withMessage("Password must be at least 8 characters long."))
    ],
    signup
);

router.post("/login", login);

router.get("/:uid", checkAuthUser, getUser);

router.patch("/:uid", checkAuthUser, updateUser);

router.patch("/:uid/token", checkAuthUser, addToken);

module.exports = router;
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const userControllers = require("../controllers/user_controllers");
const { signup, login, getUser, updateUser } = userControllers;

router.post(
    "/signup",
    [
        check("name").notEmpty(),
        check("email").isEmail(),
        check("password").isLength({ min: 8 })
    ],
    signup
);

router.post("/login", login);

router.get("/:uid", getUser);

router.patch("/:uid", updateUser);

module.exports = router;
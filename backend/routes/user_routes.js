const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const userControllers = require("../controllers/user_controllers");
const { signup, login, getUser, updateUser, addToken } = userControllers;
const { checkAuthUser } = require("../middleware/check_auth");

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

router.get("/:uid", checkAuthUser, getUser);

router.patch("/:uid", checkAuthUser, updateUser);

router.patch("/:uid/token", checkAuthUser, addToken);

module.exports = router;
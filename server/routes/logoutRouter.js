const express = require("express");
const router = express.Router();

const { logout } = require("../controllers/userController");
router.route("/").get(logout);

module.exports = router;

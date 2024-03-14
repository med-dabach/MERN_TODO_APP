const express = require("express");
const {
  passwordResetToken,
  passwordResetTokenVerify,
} = require("../controllers/userController");
const router = express.Router();

router.route("/").post(passwordResetToken).patch(passwordResetTokenVerify);

module.exports = router;

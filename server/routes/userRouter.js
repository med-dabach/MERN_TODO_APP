const express = require("express"),
  { addUser, getUser } = require("../controllers/userController");
router = express.Router();

router.route("/").get(getUser).post(addUser);

module.exports = router;

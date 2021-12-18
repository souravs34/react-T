const express = require("express");
const { check } = require("express-validator");
const { getUsers, signup, login } = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

// Retrieve list of all users
router.get("/", getUsers);
// Create new user + login user in
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);
// Log User in
router.post("/login", login);

module.exports = router;

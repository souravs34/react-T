const express = require("express");
const { check } = require("express-validator"); // For res.body validation
const fileUpload = require("../middleware/file-upload");

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

// Get a specific place by place id(pid)
router.get("/:pid", getPlaceById);
// Retrieve list of all places for a given user id(uid)
router.get("/user/:uid", getPlacesByUserId);
// Create a new Place

router.use(checkAuth);
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);
// Edit a Place
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);
// Delete a Place
router.delete("/:pid", deletePlace);

module.exports = router;

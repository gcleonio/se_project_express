const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser); // Get the current user
router.patch("/me", auth, updateProfile); // Update the user data

module.exports = router;

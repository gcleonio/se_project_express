const router = require("express").Router();
const auth = require("../middlewares/auth");

// const { getUsers, createUser, getUser } = require("../controllers/users");
const { getCurrentUser, updateProfile } = require("../controllers/users");

// router.get("/", getUsers); // With user authorization, we can't access other profiles
// router.get("/:userId", getUser);
// router.post("/", createUser); // Now we create a new user by signing up

router.get("/me", auth, getCurrentUser); // Get the current user
router.patch("/me", auth, updateProfile); // Update the user data

module.exports = router;

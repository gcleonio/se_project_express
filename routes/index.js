const router = require("express").Router();
const NotFoundError = require("../custom_errors/not-found-err");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateUserLogin,
} = require("../middlewares/validation");

// Public routes
router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserInfo, createUser);

// Protected routes
router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

// Handle 404 errors for any undefined routes
router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;

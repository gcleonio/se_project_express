const router = require("express").Router();
// const { NOT_FOUND } = require("../utils/errors");
const { NotFoundError } = require("../utils/custom-errors");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateUserLogin,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserInfo, createUser);

// Handle 404 errors for any undefined routes
router.use((req, res) => {
  throw new NotFoundError("Router not found");
});

module.exports = router;

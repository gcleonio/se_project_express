const router = require("express").Router();

const auth = require("../middlewares/auth"); // Import the auth middleware

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD : Create, Read, Update, Delete

// Create
router.post("/", auth, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", auth, deleteItem);

// Like an item by ID
router.put("/:itemId/likes", auth, likeItem);

// Unlike an item by ID
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;

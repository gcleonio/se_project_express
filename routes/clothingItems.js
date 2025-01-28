const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD : Create, Read, Update, Delete

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

// Like an item by ID
router.put("/:itemId/likes", likeItem);

// Unlike an item by ID
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;

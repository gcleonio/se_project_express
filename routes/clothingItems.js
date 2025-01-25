const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD : Create, Read, Update, Delete

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

// Like an item by ID
router.put("/:itemId/likes", likeItem);

// Unlike an item by ID
router.delete("/:itemId/likes", dislikeItem);

router.module.exports = router;

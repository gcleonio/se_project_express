const ClothingItems = require("../models/clothingItems"); // Import the ClothingItems model

// route handler to create a new item
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id; // Access the hardcoded user ID from app.js

  // Create a new item
  ClothingItems.create({
    name,
    weather,
    imageUrl,
    owner: userId,
  })
    .then((item) => {
      // if successful, send the item back
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      // if not successful, send an error message
      res.status(500).send({ message: "Error from createItem", e });
    });
};

// route handler to get all items
const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

// router handler for updating an item
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItems.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

// route handler to delete an item
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(204).send({});
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

// Like an item by ID
const likeItem = (req, res) => {
  const userId = req.user._id; // Access the hardcoded user ID from app.js

  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, // Add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(new Error("Item not found")) // If item is not found, throw an error
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from likeItem", e });
    });
};

// Dislike an item by ID
const dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Remove _id from the array
    { new: true }
  )
    .orFail(new Error("Item not found"))
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from dislikeItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};

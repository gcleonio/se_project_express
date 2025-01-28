const ClothingItems = require("../models/clothingItems"); // Import the ClothingItems model
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors"); // Import the error codes

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
      console.error(e); // log the error
      if (e.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" }); // Send the 400 error
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

// route handler to get all items
const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

// route handler to delete an item
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res
        .status(200)
        .send({ message: "Item deleted successfully", data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" }); // Send the 404 error
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID" }); // Send the 400 error
      }
      return res.status(DEFAULT).send({
        message: "An error has occured on the server",
      });
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
    .orFail()
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" }); // Send the 404 error
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID" }); // Send the 400 error
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

// Dislike an item by ID
const dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" }); // Send the 404 error
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID" }); // Send the 400 error
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};

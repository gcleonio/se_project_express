const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors"); // Import the error codes

// route handler to returns all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

// route handler to create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err); // all catch blocks should log the error
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID provided" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

// route handler to return a user by _id
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail() // must before .then()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config"); // Import the JWT secret

// route handler to create a new user
const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 12) // hash the password
    .then((hash) => User.create({ name, avatar, email, password: hash })) // create the user with the hashed password
    .then((user) => {
      const responseUser = user.toObject(); // convert the user to a plain object
      delete responseUser.password; // omit the password hash from the response sent after a new user is created
      res.status(201).send(responseUser); // send the user without the password
    })
    .catch((err) => {
      console.error(err); // all catch blocks should log the error
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID provided" });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // login function calls User.findUserByCredentials with the provided email and password. If the credentials are correct, it generates a JWT token and sends it in the response
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "UnauthorizedError") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

// route handler to find the current user
const getCurrentUser = (req, res) => {
  // const { userId } = req.params;
  const userId = req.user._id; // Instead of pulling the ID from req.params, access it from the req.user object that is set in the auth middleware
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
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

// route handler to update user data
const updateProfile = (req, res) => {
  const userId = req.user._id; // access the user ID from req.user
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // return the updated document and enforce validation
  )
    .then((user) => res.send({ data: user })) // handle success
    .catch((err) => {
      // handle rejected state
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID provided" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateProfile };

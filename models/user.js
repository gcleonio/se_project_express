const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
    email: {
      type: String,
      required: [true, "The email field is required."],
      unique: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
        message: "You must enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "The password field is required."],
      select: false, // User's password hash will not be returned by any search queries
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email }) // find a user by email and include the password field in the result
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      // if the user is found, compare the provided password with the stored hashed password using bcrypt.compare
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        // if the passwords match, resolve the promise with the user object
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config"); // Import the JWT secret

const { UNAUTHORIZED } = require("../utils/errors"); // Import the error codes

function auth(req, res, next) {
  const { authorization } = req.headers; // Get the authorization header from the request

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // Check if the authorization header is present and starts with "Bearer "
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" }); // If not, return an error
  }

  // Extract the token from the authorization header
  const token = authorization.replace("Bearer ", "");
  let payload; // Initialize the payload variable

  // Verify the token
  try {
    payload = jwt.verify(token, JWT_SECRET); // Use the JWT_SECRET to verify the token
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization failed" }); // If verification fails, return an error
  }

  req.user = payload; // Add the payload to the request object

  next(); // Pass control to the next middleware function
}

module.exports = auth;

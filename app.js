const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express(); // Initialize the Express application
const { PORT = 3001 } = process.env; // Set the port for the server

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json()); // Middleware to parse JSON bodies. place before calling routes
app.use(cors());
app.use(requestLogger); // enable the request logger before all route handlers
app.use("/", mainRouter); // Use the main router for all routes
app.use(errorLogger); // enalbe the error logger after the route handlers and before the error handlers
app.use(errors()); // Celebrate error handler
app.use(errorHandler); // Centralized error handler

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json()); // Needed to parse the body, and place before calling routes

// app.use() middleware should come before the app.use() of the routes

// // Remove the hard-coded user
// app.use((req, res, next) => {
//   req.user = {
//     _id: "6792cca476b1283ee40159bf",
//   };
//   next();
// });
app.use(cors());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

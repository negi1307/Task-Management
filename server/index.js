const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors')
require('dotenv').config();
const app = express();
app.use(cors())
app.use(express.json());
const bodyParser = require("body-parser");

const routes = require('./routes/index');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
app.use("/upload", express.static("upload"));

mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, database) => {
    if (!err) {
      console.log("Database connected successfully");
    } else {
      console.log(err);
    }
  }
);
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
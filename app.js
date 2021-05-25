const express = require("express");
const app = express();
const prodRoute = require("./API/Routes/product");
const orderRoute = require("./API/Routes/orders");
const userRoute = require("./API/Routes/user");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");

//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
//     return res.status(200).json({});
//   }
// });

app.use("/products", prodRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);
const connectionUrl = `mongodb+srv://vaishak:${process.env.MONGO_ATLAST_PW}@cluster0.opuae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

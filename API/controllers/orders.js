const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");

exports.get_all_orders = (req, res, next) => {
  Order.find()
    .populate("product", "name price")
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.post_my_orders = (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then((result) => {
      if (!result) {
        res.status(404).json({ message: "Product not found" });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      return order.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const mongoose = require("mongoose");
const Product = require("../models/products");


exports.fetch_all_product = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.create_product =
  (req, res, next) => {
    console.log(req.file);
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });
    product
      .save()
      .then((result) => {
        res.status(200).json({
          message: "data created successfully",
          createdProduct: result,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

exports.fetch_product_info = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Entry Found" });
      }
    })
    .catch((err) =>
      res.status(501).json({
        error: err,
      })
    );
};

exports.delete_product_info = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(501).json({
        error: err,
      });
    });
};

exports.update_product_info = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {
    name: req.body.name,
    price: req.body.price,
  };
  Product.updateOne(
    { _id: id },
    {
      $set: updateOps,
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

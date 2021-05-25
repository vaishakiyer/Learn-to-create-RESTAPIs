const express = require("express");
const checkAuth = require("../middleware/check-auth");
const ProductController = require("../controllers/products");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Please check the uplaoded file format"), false);
  }
};

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//Fetch All Product

router.get("/", ProductController.fetch_all_product);

//create a product

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.create_product
);

// Get a product by ID

router.get("/:productId", ProductController.fetch_product_info);

// Update a Product

router.patch("/:productId", ProductController.update_product_info);

//Delete a product

router.delete("/:productId", ProductController.delete_product_info);

module.exports = router;

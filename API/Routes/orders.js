const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const getAllOrders = require("../controllers/orders");
// Fetch All orders

router.get("/", checkAuth, getAllOrders.get_all_orders);

router.post("/", checkAuth, getAllOrders.post_my_orders);

module.exports = router;

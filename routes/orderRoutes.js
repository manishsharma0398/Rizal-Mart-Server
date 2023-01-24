const express = require("express");
const router = express.Router();

const {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} = require("../controllers/orderController");

router.post("/", createNewOrder);
router.delete("/:cartId", deleteOrder);
router.get("/", getAllOrders);
router.get("/:cartId", getOrder);
router.put("/:cartId", updateOrder);

module.exports = router;

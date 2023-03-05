const express = require("express");
const router = express.Router();

const {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} = require("../controllers/orderController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, createNewOrder);
router.delete("/:orderId", verifyToken, deleteOrder);
router.get("/", getAllOrders);
router.get("/:orderId", getOrder);
router.put("/:orderId", updateOrder);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  getAddressOfUser,
  addNewAddress,
} = require("../controllers/orderController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/address", verifyToken, getAddressOfUser);
router.post("/address", verifyToken, addNewAddress);

router.post("/", verifyToken, createNewOrder);
router.delete("/:orderId", verifyToken, deleteOrder);
router.get("/", getAllOrders);
router.get("/:orderId", getOrder);
router.put("/:orderId", updateOrder);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createFeedback,
  deleteFeedback,
  getFeedback,
  getAllFedback,
  updateFeedback,
} = require("../controllers/feedbackController");

router.post("/", createFeedback);
router.delete("couponId", deleteFeedback);
router.get("couponId", getFeedback);
router.get("/:productId", getAllFedback);
router.put("couponId", updateFeedback);

module.exports = router;

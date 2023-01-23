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
router.delete("/:feedbackId", deleteFeedback);
router.get("/:feedbackId", getFeedback);
router.get("/:productId", getAllFedback);
router.put("/:feedbackId", updateFeedback);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  login,
  handleRefreshToken,
  logout,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", handleRefreshToken);

module.exports = router;

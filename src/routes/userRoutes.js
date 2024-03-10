const router = require("express").Router();

const {
  register,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
} = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/all", getAllUsers);

router.post("/register", register);
router.get("/:userId", verifyToken, getUser);
router.delete("/:userId", verifyToken, deleteUser);
router.patch("/", verifyToken, updateUser);

// only admin routes
// router.get("/", verifyToken, isAdmin, getAllUsers);

router.patch("/block/:userId", verifyToken, isAdmin, blockUser);
router.patch("/unblock/:userId", verifyToken, isAdmin, unBlockUser);

module.exports = router;

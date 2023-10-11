const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/users");
const authenticate = require("../../middlewares/authentificate");
const { upload } = require("../../middlewares/upload");

// router.get("/", ctrl.getAllUsers);
router.post("/register", ctrl.registerUser);
router.post("/login", ctrl.loginUser);
router.post("/logout", authenticate, ctrl.logoutUser);
router.get("/current", authenticate, ctrl.currentUser);
router.patch("/", authenticate, ctrl.updateUserSubscription);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateUserAvatar
);

module.exports = router;

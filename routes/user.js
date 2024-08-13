const { Router } = require("express");
const jwtAuthMiddleware = require("../middlewares/auth");
const {
  handleSignup,
  handleSignin,
  handleGetProfile,
  handleUpdatePassword,
} = require("../controllers/user");

const router = Router();

router.post("/signup", handleSignup);
router.post("/signin", handleSignin);
router.get("/profile", jwtAuthMiddleware, handleGetProfile);
router.put("/profile/password", jwtAuthMiddleware, handleUpdatePassword);

module.exports = router;

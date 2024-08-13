const { Router } = require("express");
const jwtAuthMiddleware = require("../middlewares/auth");
const {
  handleCreateCandidate,
  handleUpdateCandidate,
  handleDeleteCandidate,
  handleVoteCandidate,
  handleVoteCount,
} = require("../controllers/candidates");

const router = Router();

router.post("/", jwtAuthMiddleware, handleCreateCandidate);
router.put("/:candidateId", jwtAuthMiddleware, handleUpdateCandidate);
router.delete("/:candidateId", jwtAuthMiddleware, handleDeleteCandidate);
router.post("/vote/:candidateId", jwtAuthMiddleware, handleVoteCandidate);
router.get("/vote/count", handleVoteCount);

module.exports = router;

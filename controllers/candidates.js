const Candidate = require("../models/candidates");
const User = require("../models/user");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "ADMIN";
  } catch (error) {
    return false;
  }
};

const handleCreateCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User is not ADMIN" });
    }

    const data = req.body;
    const newUser = new Candidate(data);
    const response = await newUser.save();

    console.log("Data Saved");

    res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleUpdateCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User is not ADMIN" });
    }
    const candidateID = req.params.candidateId;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response)
      return res.status(401).json({ error: "Candidate Not Found" });

    console.log("Candidate Data Updated");
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleDeleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User is not ADMIN" });
    }
    const candidateID = req.params.candidateId;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response)
      return res.status(401).json({ error: "Candidate Not Found" });

    console.log("Candidate Deleted");
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleVoteCandidate = async (req, res) => {
  try {
    const candidateID = req.params.candidateId;
    console.log(candidateID);
    const userId = req.user.id;
    // Find the Candidate document with the specified candidateID
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.role == "admin") {
      return res.status(403).json({ message: "admin is not allowed" });
    }
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Update the Candidate document to record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // update the user document
    user.isVoted = true;
    await user.save();

    return res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleVoteCount = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).sort({ voteCount: "desc" });
    const record = candidates.map((data) => {
      return {
        party: data.party,
        candidate: data.fullName,
        count: data.voteCount,
      };
    });

    return res.status(200).json({ record: record });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleCreateCandidate,
  handleUpdateCandidate,
  handleDeleteCandidate,
  handleVoteCandidate,
  handleVoteCount,
};

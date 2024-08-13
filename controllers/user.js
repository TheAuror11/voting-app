const generateToken = require("../services/auth");
const User = require("../models/user");

const handleSignup = async (req, res) => {
  try {
    const data = req.body;

    const adminUser = await User.findOne({ role: "ADMIN" });
    if (data.role == "ADMIN" && adminUser)
      return res.status(400).json({ error: "ADMIN already exists" });

    if (!/^\d{12}$/.test(data.aadharCardNumber)) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number must be exactly 12 digits" });
    }

    const existingUser = await User.findOne({
      aadharCardNumber: data.aadharCardNumber,
    });
    if (existingUser)
      return res
        .status(400)
        .json({ error: "User exists with this aadhar number" });

    const newUser = new User(data);
    const response = await newUser.save();

    console.log("Data Saved");

    const payload = {
      id: response.id,
    };

    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is: ", token);

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleSignin = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    if (!/^\d{12}$/.test(aadharCardNumber)) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number must be exactly 12 digits" });
    }

    if (!aadharCardNumber || !password) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number and password are required" });
    }

    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);
    return res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleGetProfile = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;

    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleUpdatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    user.password = newPassword;
    await user.save();

    console.log("Password Changed");
    return res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleSignup,
  handleSignin,
  handleGetProfile,
  handleUpdatePassword,
};

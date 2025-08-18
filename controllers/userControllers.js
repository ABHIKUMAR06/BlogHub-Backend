const User = require("../models/userModel.js")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const hashedPassword = (password) => {
  return crypto.pbkdf2Sync(password, "fixedcontent", 100, 64, "sha512").toString("hex")
}

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    let existUser = await User.findOne({ email: email })
    if (existUser) {
      res.status(500).json({ message: "User email already exist" })
    } else {
      const hashPassword = hashedPassword(password)
      const newUser = {
        name,
        email,
        password: hashPassword
      }
      const savedUser = await User.create(newUser)
      res.status(201).json({ savedUser })
    }
  } catch (err) {
    res.status(400).json({ error: "error while creating user", "message": err.message })
  }
}
const verifyPassword = (input, storedpass) => {
  const hashinput = hashedPassword(input)
  return hashinput === storedpass
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ error: "User Not Found" })
    }
    const isValid = verifyPassword(password, user.password)
    if (!isValid) {
      res.status(404).json({ message: "Password not Matched" })
    }
    const userToken = jwt.sign({ userId: user._id }, process.env.jwt_secret_key, {
      expiresIn: "24h"
    })
    user.token.push({ userToken })
    await user.save()
    res.status(200).json({ user: user, token: userToken })
  } catch (err) {
    res.status(400).json({ "message": err.message })
  }
}
const getMyProfile = async (req, res) => {

  try {
    const userId = req.userId
    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    console.error("getMyProfile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.token = user.token.filter(t => t.token !== req.token);
    await user.save();
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed", message: err.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.userId

    const { name, email, password } = req.body;
    const req_user = await User.find({ _id: userId })
    if (req_user.email !== email) {

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      const hash = hashedPassword(password);
      updateData.password = hash;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  createUser,
  loginUser,
  getMyProfile,
  updateUser,
  logoutUser

}
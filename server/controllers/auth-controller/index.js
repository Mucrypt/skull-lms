//server/controllers/auth-controller/index.js
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { userName, userEmail, password, role } = req.body;
  
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });
  
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
  
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      userEmail,
      password: hashedPassword,
      role,
    });
  
    await newUser.save();
  
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  };
  
  const loginUser = async (req, res) => {
    const { userEmail, password } = req.body;
  
    const checkUser = await User.findOne({ userEmail });
    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  
    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      "JWT_SECRET",
      { expiresIn: "1h" }
    );
  
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
  };
  
  module.exports = { registerUser, loginUser };
  
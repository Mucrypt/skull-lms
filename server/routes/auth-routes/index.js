const express = require("express");
const { registerUser, loginUser } = require("../../controllers/auth-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware"); // Correct import

const router = express.Router();

// Define the routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "User is authenticated",
    data: user,
  });
});

// Export the router to be used in other parts of the application
module.exports = router;

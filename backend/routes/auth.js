const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      title,
      address,
      address2,
      city,
      country,
      zipcode,
      phone,
      isCompany,
      company,
      vatNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      title,
      address,
      address2,
      city,
      country,
      zipcode,
      phone,
      isCompany: isCompany || false,
      company,
      vatNumber,
      role: "user",
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        address: user.address,
        address2: user.address2,
        city: user.city,
        country: user.country,
        zipcode: user.zipcode,
        phone: user.phone,
        isCompany: user.isCompany,
        company: user.company,
        vatNumber: user.vatNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Update last login and increment login count
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        address: user.address,
        address2: user.address2,
        city: user.city,
        country: user.country,
        zipcode: user.zipcode,
        phone: user.phone,
        isCompany: user.isCompany,
        company: user.company,
        vatNumber: user.vatNumber,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    res.json({
      message: "Profile retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      message: "Failed to retrieve profile",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Get current user (alias for /profile)
router.get("/me", auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      message: "Failed to retrieve current user",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      title,
      address,
      address2,
      city,
      country,
      zipcode,
      phone,
      isCompany,
      company,
      vatNumber,
    } = req.body;
    const userId = req.user._id;

    // Check if username is taken by another user
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username already taken",
        });
      }
    }

    const updateData = {
      firstName,
      lastName,
      username,
      title,
      address,
      address2,
      city,
      country,
      zipcode,
      phone,
      isCompany,
      company,
      vatNumber,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Profile update failed",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      message: "Password change failed",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Verify token
router.get("/verify", auth, (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = router;

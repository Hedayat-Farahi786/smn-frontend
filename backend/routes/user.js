const express = require("express");
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all users (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      message: "Users retrieved successfully",
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Failed to retrieve users",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Get user by ID (admin only)
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "Failed to retrieve user",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Update user status (admin only)
router.put("/:id/status", adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      message: "Failed to update user status",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Update user role (admin only)
router.put("/:id/role", adminAuth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Must be either "user" or "admin"',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      message: "Failed to update user role",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

// Delete user (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
});

module.exports = router;

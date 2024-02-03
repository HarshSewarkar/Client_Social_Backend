const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// UPDATE ROUTE
router.put("/:id", async (req, res) => {
  try {
    // Checking if the user making the request is the owner or an admin
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      // If a new password is provided, hash it before updating
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      // Update the user's information
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true } // Return the updated user
      );

      // Return a response
      res.status(200).json("Account Updated Successfully");
    } else {
      res
        .status(403)
        .json("You can update only your account or if you are an admin.");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE USER ROUTE
router.delete("/:id", async (req, res) => {
  try {
    // Checking if the user making the request is the owner or an admin
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      // Delete the user by ID
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      // Check if the user was found and deleted
      if (deletedUser) {
        res.status(200).json("Account deleted Successfully");
      } else {
        res.status(404).json("User not found With this ID");
      }
    } else {
      res
        .status(403)
        .json("You can delete only your account or if you are an admin.");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET USER ROUTE
router.get("/:id", async (req, res) => {
    try {
        // Attempt to find a user by ID in the database
        const user = await User.findById(req.params.id);

        // If the user is found
        if (user) {
            // Extract specific fields from the user object (excluding password and updatedAt)
            const { password, updatedAt, ...other } = user.toObject();

            // Respond with a 200 status code and the modified user object
            res.status(200).json(other);
        } else {
            // If the user is not found, respond with a 404 status code and a relevant message
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        // If an error occurs during the database operation, respond with a 500 status code and an error message
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// FOLLOW USER ROUTE
router.put("/:id/follow", async (req, res) => {
    try {
        // Check if the user is trying to follow themselves
        if (req.body.userId === req.params.id) {
            return res.status(403).json("You can't send a follow request to yourself");
        }

        // Find the user being followed and the current user in the database
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        // Check if the current user is already following the target user
        if (!userToFollow.followers.includes(req.body.userId)) {
            // If not, update the target user's followers and the current user's followings
            await userToFollow.updateOne({ $push: { followers: req.body.userId } });
            await currentUser.updateOne({ $push: { followings: req.params.id } });

            // Respond with a 200 status code and a success message
            res.status(200).json("User followed successfully");
        } else {
            // If the current user is already following the target user, respond with a 403 status code
            res.status(403).json("You already follow this user");
        }
    } catch (error) {
        // If an error occurs during the database operation, respond with a 500 status code and an error message
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// USFOLLOW USER ROUTE
router.put("/:id/unfollow", async (req, res) => {
    try {
        // Check if the user is trying to unfollow themselves
        if (req.body.userId === req.params.id) {
            return res.status(403).json("You can't send an Unfollow request to yourself");
        }

        // Find the user being unfollowed and the current user in the database
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        // Check if the current user is already following the target user
        if (userToUnfollow.followers.includes(req.body.userId)) {
            // If yes, update the target user's followers and the current user's followings
            await userToUnfollow.updateOne({ $pull: { followers: req.body.userId } });
            await currentUser.updateOne({ $pull: { followings: req.params.id } });

            // Respond with a 200 status code and a success message
            res.status(200).json("User unfollowed successfully");
        } else {
            // If the current user is not following the target user, respond with a 403 status code
            res.status(403).json("You are Already Unfollow this user");
        }
    } catch (error) {
        // If an error occurs during the database operation, respond with a 500 status code and an error message
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;

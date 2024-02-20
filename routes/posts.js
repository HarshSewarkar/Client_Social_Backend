const router = require("express").Router();
// const { json } = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
// const { Promise } = require("mongoose");

// CREATE POST
router.post("/", async (req, res) => {
  // Create a new post instance using the Post model
  const newPost = new Post(req.body);

  try {
    // Save the new post to the database
    const savedPost = await newPost.save();

    // Respond with the saved post data
    res.status(201).json(savedPost);
  } catch (error) {
    // Handle errors, such as validation errors or database issues
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    // Use await to get the actual post object by its ID
    const post = await Post.findById(req.params.id);

    // Check if the post exists and if the user is the owner
    if (post && post.userId === req.body.userId) {
      // Use await for the update operation as well
      await post.updateOne({ $set: req.body });

      // Respond with a 200 status code and a success message
      res.status(200).json("Post Updated Successfully");
    } else {
      // Respond with a 403 status code if the user is not the owner or the post does not exist
      res
        .status(403)
        .json("You Can Update Only Your Post or the post does not exist");
    }
  } catch (error) {
    // Handle errors by responding with a 500 status code and an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    // Use await to get the actual post object by its ID
    const post = await Post.findById(req.params.id);

    // Check if the post exists and if the user is the owner
    if (post && post.userId === req.body.userId) {
      // Use await for the delete operation as well
      await post.deleteOne();

      // Respond with a 200 status code and a success message
      res.status(200).json("Post deleted Successfully");
    } else {
      // Respond with a 403 status code if the user is not the owner
      res.status(403).json("You Can delete Only Your Post");
    }
  } catch (error) {
    // Handle errors by responding with a 500 status code and an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// LIKE/DISLIKED POST
router.put("/:id/likes", async (req, res) => {
  try {
    // Use await to get the actual post object by its ID
    const post = await Post.findById(req.params.id);

    // Check if the user has already liked the post
    if (!post.likes.includes(req.body.userId)) {
      // If not liked, add the user to the likes array
      await post.updateOne({ $push: { likes: req.body.userId } });

      // Respond with a 200 status code and a success message
      res.status(200).json("Post Liked Successfully");
    } else {
      // If already liked, remove the user from the likes array
      await post.updateOne({ $pull: { likes: req.body.userId } });

      // Respond with a 200 status code and a success message for dislike
      res.status(200).json("Post Disliked Successfully");
    }
  } catch (error) {
    // Handle errors by responding with a 500 status code and an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET/SEARCH POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// GET ALL/TIMELINE combine  POST
router.get("/timeline/:userId", async (req, res) => {
  try {
    // Use await to get the current user object by its ID
    const currentUser = await User.findById(req.params.userId);

    // Retrieve posts created by the current user
    const userPosts = await Post.find({ userId: currentUser._id });

    // Retrieve posts from followed users using Promise.all to handle multiple asynchronous calls
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    // Combine user's posts and friend's posts into a single array
    const timelinePosts = userPosts.concat(...friendPosts);

    // Respond with the combined timeline posts
    res.json(timelinePosts);
  } catch (error) {
    // Handle errors by responding with a 500 status code and an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ALL POST of user
// router.get("/profile/:username", ...)
router.get("/profile/:username", async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.params.username });

    const posts = await Post.find({ userId: currentUser._id });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

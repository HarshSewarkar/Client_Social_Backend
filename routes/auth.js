const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Generates a bcrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword, // Assign the hashed password
    });

    // Saving the created user and return a response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "The User Are Avaliable" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // Find the user Email from UserModel and when user not found giving a response
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User Not Found With This Username");

    // comparing a user password and becrypt password are same or not
    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validpassword && res.status(404).json("Incorrect Password");

    // If the user was found giving a response
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
});
module.exports = router;

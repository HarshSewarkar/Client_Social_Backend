const mongoose = require("mongoose");
//const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

//userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);

const mongoose = require("mongoose");
//const plm = require('passport-local-mongoose');

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

//postSchema.plugin(plm);

module.exports = mongoose.model("Post", postSchema);

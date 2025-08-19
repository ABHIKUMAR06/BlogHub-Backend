const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

LikeSchema.index({ user_id: 1, blog_id: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;

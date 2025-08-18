const mongoose = require("mongoose")
const CommentSchema = mongoose.Schema({
  comment: String,
  reply: {
    type: Boolean,
    default: false,
  },
  parent_comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }, blog_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog"
  }
},
  {
    timestamps: true,
  })
const Comment = mongoose.model("Comment", CommentSchema)
module.exports = Comment
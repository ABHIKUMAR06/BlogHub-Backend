const mongoose = require("mongoose")
const BlogSchema = mongoose.Schema({
  title: String,
  detail: String,
  img_url: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
},
  {
    timestamps: true,
  }
)
const Blog = mongoose.model("Blog", BlogSchema)
module.exports = Blog
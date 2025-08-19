const Like = require("../models/likeModel.js")


const createLike = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);
        
        const { id } = req.params;
 console.log(id);
 
        if (!userId || !id) {
            return res.status(400).json({ error: "User ID and Blog ID are required" });
        }

        const existingLike = await Like.findOne({ user_id: userId, blog_id: id });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return res.status(200).json({ message: "Like removed successfully" });
        }

        const newLike = await Like.create({ user_id: userId, blog_id: id });
        return res.status(201).json({ message: "Blog liked successfully", like: newLike });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error",message: error.message });
    }
};


const getLikeByBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const likes = await Like.find({ blog_id: id }).populate("user_id", "name");
    res.status(200).json({ count: likes.length, likes });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createLike, getLikeByBlogs };

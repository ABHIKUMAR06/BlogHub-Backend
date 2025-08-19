
const Comment = require("../models/commentModel.js")
const Blog = require("../models/blogModel.js");
const Like = require("../models/likeModel.js")
const { uploadToCloudinary, deleteFromCloudinary } = require('../utills/cloudinary');

const createBlog = async (req, res) => {
  try {
  const { title, detail } = req.body;

  if (!title || !detail) {
    return res.status(400).json({ message: 'Title and detail are required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Image is required' });
  }



    const userId = req.userId


    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }
    const imageUrl = await uploadToCloudinary(req.file.path);

    const newBlog = new Blog({
      title,
      detail,
      img_url: imageUrl,
      user_id: userId
    });

    const savedBlog = await newBlog.save();

    return res.status(201).json({
      message: 'Blog created successfully',
      blog: savedBlog,
    });

  } catch (err) {
    return res.status(500).json({ error:"Error",message: err.message });
  }
};


const getAllblog = async (req, res) => {

  try {
    const Blogs = await Blog.find().sort({createdAt: -1}).populate("user_id", "name")
    res.status(200).json(Blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })

  }
}

const updateBlog = async (req, res) => {
  try {
    const userId = req.userId


    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const { id } = req.params;
    const { title, detail, oldFile } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Forbidden: You can only update your own blogs" });
    }

    let imageUrl = blog.img_url;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path);
    } else if (oldFile) {
      imageUrl = oldFile;
    }

    const updateData = { title, detail };
    if (imageUrl) updateData.img_url = imageUrl;

    if (blog.img_url && req.file) {
      const url = blog.img_url;

      const afterUpload = url.split("/upload/")[1];

      const withoutVersion = afterUpload.split("/").slice(1).join("/");

      const publicId = withoutVersion.split(".")[0];

      await deleteFromCloudinary(publicId);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true }).populate("user_id", "_id name");

    res.status(200).json(updatedBlog);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const deleteblog = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own blogs" });
    }

    await Comment.deleteMany({ blog_id: id });
     await Like.deleteMany ({blog_id:id})
    if (blog.img_url) {
      const url = blog.img_url;
      const publicId = url.split("/upload/")[1].replace(/\.\w+$/, "");
      await deleteFromCloudinary(publicId);
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted successfully", blogId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


const blogByUser = async (req, res) => {
  try {

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    const blogs = await Blog.find({ user_id: userId }).sort({createdAt:-1}).populate("user_id", "name")
    if (!blogs) {
      return res.status(401).json({ error: "You have no blogs" })
    }
    return res.status(200).json(blogs)
  }
  catch (err) {
    return res.status(400).json({ error: "Error", message: err.message })
  }
}


module.exports = { createBlog, getAllblog, updateBlog, deleteblog, blogByUser }

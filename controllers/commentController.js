const Comment = require("../models/commentModel");

const createComment = async (req, res) => {
  try {
    const userId = req.userId


    const { comment, blog_id, parent_comment_id } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Login required." });
    }
    if (!blog_id) {
      return res.status(400).json({ message: "Blog Not Exist" });

    } if (!parent_comment_id) {
      const newComment = new Comment({
        comment,
        user_id: userId,
        blog_id,
      });

      const savedComment = await newComment.save();
      res.status(201).json(savedComment);

    } else if (parent_comment_id) {
      const newReply = new Comment({
        comment,
        reply: true,
        user_id: userId,
        blog_id,
        parent_comment_id,
      });

      const savedReply = await newReply.save();
      res.status(201).json(savedReply);

    }

  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCommentsByBlog = async (req, res) => {
  try {

    const { blogId } = req.params;

    const comments = await Comment.find({ blog_id: blogId })
      .populate("user_id", "name email")
      .sort({ createdAt: 1 })
      .lean();



    if (!comments || comments.length === 0) {
      return res.status(200).json([]);
    }

    const buildCommentTree = (comments) => {
      const commentMap = {};
      const rootComments = [];


      comments.forEach(comment => {
        const commentId = comment._id.toString();
        commentMap[commentId] = {
          ...comment,
          replies: []
        };
      });

      comments.forEach(comment => {
        const commentId = comment._id.toString();
        const parentId = comment.parent_comment_id?.toString();

        if (!parentId || parentId === 'null') {
          rootComments.push(commentMap[commentId]);
        } else {
          const parent = commentMap[parentId];
          if (parent) {
            parent.replies.push(commentMap[commentId]);
          } else {
            rootComments.push(commentMap[commentId]);
          }
        }
      });

      rootComments.forEach((comment, index) => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach((reply, replyIndex) => {
          });
        }
      });

      return rootComments;
    };

    const nestedComments = buildCommentTree(comments);


    res.status(200).json(nestedComments);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message
    });
  }
};



const updateComment = async (req, res) => {

  try {
    const userId = req.userId
    const { id } = req.params;
    const { comment: newCommentText } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }
    if (!newCommentText || newCommentText.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.user_id?._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Forbidden: You can only update your own comment" });
    }

    comment.comment = newCommentText;
    await comment.save();

    res.status(200).json({ comment, message: "Updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};


const deleteComment = async (req, res) => {

  try {
    const userId = req.userId

    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const deletecomment = await Comment.findById(id);

    if (!deletecomment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (deletecomment.user_id?._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own comment" });
    }
    await Comment.deleteMany({ parent_comment_id: id })

    await Comment.findByIdAndDelete(id);
    res.json({ message: "comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createComment, getCommentsByBlog, deleteComment, updateComment };

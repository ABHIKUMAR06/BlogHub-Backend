const express = require("express")
const { createComment, getCommentsByBlog, deleteComment, updateComment } = require("../controllers/commentController.js")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware.js")
router.get("/read/:blogId", authMiddleware, getCommentsByBlog)
router.post("/create", authMiddleware, createComment)
router.delete("/delete/:id", authMiddleware, deleteComment)
router.put("/update/:id", authMiddleware, updateComment)
module.exports = router
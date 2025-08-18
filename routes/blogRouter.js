const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware.js")
const { createBlog, getAllblog, updateBlog, deleteblog, blogByUser } = require("../controllers/blogController.js");
const authMiddleware = require("../middlewares/authMiddleware.js")

router.post("/create", upload.single("image"), authMiddleware, createBlog);
router.get("/read", authMiddleware, getAllblog)
router.put("/update/:id", upload.single("file"), authMiddleware, updateBlog)
router.delete("/delete/:id", authMiddleware, deleteblog)
router.get("/my/blogs", authMiddleware, blogByUser)
module.exports = router;

const express = require("express")
const router = express.Router()
const {createLike,getLikeByBlogs,disLike} =require("../controllers/likeController.js")
const authMiddleware = require("../middlewares/authMiddleware.js")

router.post("/create/:id",authMiddleware,createLike)

router.get("/:id",authMiddleware,getLikeByBlogs)
module.exports = router
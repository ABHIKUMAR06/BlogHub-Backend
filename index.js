const express = require("express")
const mongoose = require("mongoose")
const app = express()
const Port = 8000
const UserRouter = require("./routes/userRoutes.js")
const commentRouter = require("./routes/commentRoutes.js")
const blogRouter = require("./routes/blogRouter.js")
const cors = require("cors")
const path = require("path")
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/user", UserRouter)
app.use("/api/blog", blogRouter)
app.use("/api/comment", commentRouter)

mongoose.connect(process.env.DB_STRING)
    .then(
        console.log("db conected")
    ).catch((err) => {
        console.log(err)
    })
app.listen(Port, () => {
    console.log(`app listen at http://localhost:${Port}`);
})
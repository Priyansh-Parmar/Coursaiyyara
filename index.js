require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000)
    console.log("Listening on port")
}
main()

app.use(express.json())
const { userRouter } = require('./routes/user')
const { courseRouter } = require('./routes/course')
const { adminRouter } = require('./routes/admin')

app.use("/app/v1/user", userRouter)
app.use("/app/v1/course", courseRouter)
app.use("/app/v1/admin", adminRouter)

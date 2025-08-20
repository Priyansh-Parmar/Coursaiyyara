const mongoose = require('mongoose')
const ObjectId = mongoose.ObjectId
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const adminSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const courseSchema = new Schema ({
    title: String,
    description: String,
    creatorId: ObjectId,
    price: Number,
    imageUrl: String
})

const purchaseSchema = new Schema ({
    userId: ObjectId,                   //refers to user who bought the course
    courseId: ObjectId                  // refers to which course the user bought
})

const userModel =  mongoose.model("users", userSchema)
const adminModel =  mongoose.model("admins", adminSchema)
const purchaseModel =  mongoose.model("purchases", purchaseSchema)
const courseModel =  mongoose.model("courses", courseSchema)

module.exports = {
    userModel,
    adminModel,
    purchaseModel,
    courseModel
}
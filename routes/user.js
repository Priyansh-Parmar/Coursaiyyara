const { Router } = require('express')
const bcrypt = require('bcrypt')
const { userModel, purchaseModel, courseModel } = require("../db")
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const { userSecretKey } = require('../config')
const { userMiddleware } = require('../middlewares/user')
const userRouter = Router()
const saltRounds = 11

userRouter.post("/signup", async function(req,res){
    const { email, password, firstName, lastName } = req.body
    let errorOccured = false;
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        if(hashedPassword){
            await userModel.create({
                email,
                password: hashedPassword,
                firstName,
                lastName
            })
        }
    } catch(err) {
        errorOccured = true;
        res.json({
            message: "Something isn't correct ",
            error: err.message

        }) 
    }
    if(!errorOccured) {
        res.json({
            message: "Sign up successful!"
        })
    }  
})

userRouter.post("/signin", async function(req,res){
    const { email, password } = req.body

    const user = await userModel.findOne({
        email: email
    })

    const passwordMatched = await bcrypt.compare(password, user.password)
    if(!passwordMatched){
        res.json({
            message: "Incorrect credentials"
        })
    } else {
        const token = jwt.sign({
            id: user._id.toString()
        }, userSecretKey)
        res.json({
            message: "Sign in successful!",
            token: token
        })
    }
})

userRouter.get("/purchases", userMiddleware, async function(req,res){
    const userId = req.userId;
    const purchasedCourses = await purchaseModel.find({
        userId
    })
    const courseDetails = await courseModel.find({
        _id: { $in: purchasedCourses.map(x => x.courseId)}
    })
    res.json({
        purchasedCourses, courseDetails
    })
})

module.exports = {
    userRouter: userRouter
}
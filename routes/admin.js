const { Router } = require('express')
const jwt = require('jsonwebtoken')
const adminRouter = Router()
const { adminModel, userModel, courseModel } = require('../db')
const { z } = require('zod')
const bcrypt = require('bcrypt')
const { mongoose } = require('mongoose')
const { adminSecretKey } = require('../config')
const { adminMiddleware } = require("../middlewares/admin")
/*
    Why did we have different secret keys? Because suppose an admin signed up and his ID is XYZ in admins table, while also a student signed up, and his ID too is XYZ, though probability of it happening is very low and rare, but never zero, hence it is a vulnerability. So as we encode ID and secret key in tokens, in case both have same ID, they both will get the same token which can be exploited. Hence always keep different secret keys for each table.
*/
const saltRounds = 11

adminRouter.post("/signup", async function(req,res){
   const { email, password, firstName, lastName } = req.body
       let errorOccured = false;
       try{
           const hashedPassword = await bcrypt.hash(password, saltRounds)
           console.log(hashedPassword)
           if(hashedPassword){
               await adminModel.create({
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

       if(!errorOccured){
           res.json({
               message: "Sign up successful!"
           })
       }   
})

adminRouter.post("/signin", async function(req,res){
    const { email, password } = req.body
    
        const admin = await adminModel.findOne({
            email: email
        })
    
        const passwordMatched = await bcrypt.compare(password, admin.password)
        if(!passwordMatched){
            res.json({
                message: "Incorrect credentials"
            })
        } else {
            const token = jwt.sign({
                id: admin._id.toString()
            }, adminSecretKey)
            res.json({
                message: "Sign in successful!",
                token: token
            })
        }

})

adminRouter.post("/course", adminMiddleware, async function(req,res){
    const adminId = req.adminId
    const { title, description, price, imageUrl } = req.body
    const course = await courseModel.create({
        title,
        description,
        price,
        creatorId: adminId,
        imageUrl
    })
    res.json({
        message: "Course added succesfully!",
        courseId: course._id
    })
})

adminRouter.put("/course",adminMiddleware, async function(req,res){
    const adminId = req.adminId
    const { title, description, price, imageUrl, courseId } = req.body

    await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        $set : {title, description, price, imageUrl}
    })
    res.json({
        message: "Course Updated!"
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req,res){
    const adminId = req.adminId

    const courses = await courseModel.find({
        creatorId: adminId
    })
    res.json({
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User} = require("../models/user");

router.post("/",async(req,res)=>{
    if(req.body.email){
        req.body.email.toLowerCase().trim();
    } 
    const {error}= validate(req.body)

     if(error){
    //console.log(error)
      return res.status(400).send({message:error.details[0].message })
    }

    const user= await User.findOne({email:req.body.email});
    
    if(!user){
        return res.status(404).send({message:"User not found"});
    }

    if(req.body.oldPassword === req.body.newPassword){
        return res.status(400).send({message:"The new password should be different"})
    }

    const validPassword = await bcrypt.compare(
        `${req.body.oldPassword}`,
        user.password
    )

    if(!validPassword){
        return res.status(400).send({message:"Invalid old password"})
    }

      //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.newPassword,salt);
    // user.password=hashed;
    // await user.save();
    await User.findByIdAndUpdate(user._id,{password:hashed})

    //generate auth token
    const token = user.generateAuthToken();

    return res.send({ token: token });
})


function validate(user){
    const schema = Joi.object({
        email:Joi.string().email().required().min(8).max(50)
        .messages({
            "any.required": `Email is a required field`,
            "string.email":`Invalid email`,
            "string.min": `Email should have at least 8 letters length`,
            "string.max": `Email should have at most 50 letters length`,
            "string.empty": `Email should not be empty`
        }),
        oldPassword:Joi.string().required().min(8).max(50)
        .messages({
            "any.required": `Password is a required field`,
            "string.min": `Password should have at least 8 letters length`,
            "string.max": `Password should have at most 50 letters length`,
            "string.empty": `Password should not be empty` 
        }),
        newPassword:Joi.string().required().min(8).max(50)
        .messages({
            "any.required": `Password is a required field`,
            "string.min": `Password should have at least 8 letters length`,
            "string.max": `Password should have at most 50 letters length`,
            "string.empty": `Password should not be empty` 
        }),
    });
    return schema.validate(user);
}

module.exports =router;
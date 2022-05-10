const express = require("express");
const router = new express.Router;
const Joi = require("Joi");
const bcrypt = require("bcrypt");
const {User} = require("../models/user");

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

    if(req.body.password ===process.env.defaultPassword){
        return res.status(400).send({message:"You have to change your password"})
    }
    
     //compare req.body.password with user.password
        const validPassword = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        )

        if(!validPassword){
            return res.status(400).send({message:"Invalid password"})
        }


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
        password:Joi.string().required().min(8).max(50)
        .messages({
            "any.required": `Password is a required field`,
            "string.min": `Password should have at least 8 letters length`,
            "string.max": `Password should have at most 50 letters length`,
            "string.empty": `Password should not be empty` 
        })
    });
    return schema.validate(user);
}

module.exports = router;

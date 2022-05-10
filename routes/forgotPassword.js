const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const generateStringCode = require("../utilities/generateStringCode");
const {User} = require("../models/user");

router.post("/",async(req,res)=>{
 //check req.body.email
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase().trim();
  }

  //find user by his email
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send({ message: "Email does not exist" });
  }

  const verificationCode = generateStringCode(5, "1234567890");

  await User.findByIdAndUpdate(
    user._id,
    {
      verificationCode: verificationCode,
    },
    {
      new: true,
    }
  );
//   await sendMail(
//     user.email,
//     forgot_pass_subject(),
//     forgot_pass_body(user.email, verCode)
//   );

  return res.send({ message: "The 5 digit code is sent to your email" });

})

router.post("/restore",async(req,res)=>{
 //check req.body.email
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase().trim();
  }

    //find user by his email
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: "Email has not been found" });
    }

    const {error}= validate(req.body)

    if(error){
        //console.log(error)
        return res.status(400).send({message:error.details[0].message})
    }

    let verificationCode = await User.findOne({email:req.body.email,verificationCode:req.body.verificationCode});

    if(!verificationCode){
        return res.status(400).send({message:"Please check your verification code"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
  
    await User.findOneAndUpdate(
      { email: user.email },
      { password: hashed, verificationCode: null },
      {
        new: true,
      }
    )

    return res.send({message:"Password is restored"})
  
})

function validate(user){
    const schema = Joi.object({
        email:Joi.string().email().required().empty().min(8).max(50)
        .messages({
            "any.required": `Email is a required field`,
            "string.email":`Invalid email`,
            "string.min": `Email should have at least 8 letters length`,
            "string.max": `Email should have at most 50 letters length`,
            "string.empty": `Email should not be empty`
        }),
        password:Joi.string().required().empty().min(8).max(50)
        .messages({
            "any.required": `Password is a required field`,
            "string.min": `Password should have at least 8 letters length`,
            "string.max": `Password should have at most 50 letters length`,
            "string.empty": `Password should not be empty` 
        }),
        verificationCode:Joi.string().required().empty().length(5).messages({
          "any.required": `Verification Code is required`,
          "string.empty": `Verification Code should not be empty`,
          "string.length": `Verification Code should have 5 digits`
        }),
    })
    return schema.validate(user)
}

module.exports=router;
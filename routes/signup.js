const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const {User, validateUser} = require("../models/user");
const{Role}=require("../models/role")
const mongoose = require("mongoose");


router.post("/",[auth,accessControl],async(req,res)=>{

    if(req.body.email){
        req.body.email = req.body.email.toLowerCase().trim()
    }

    let user = await User.findOne({email:req.body.email})

    if(user){
        return res.status(400).send({message:"The email is already in use"})
    }

    let {errorUser} = validateUser(req.body.user)

    if(errorUser){
        console.log(errorUser)
        return res.status(400).send({ message: error.details[0].message });
    }


    let role=await Role.findOne({_id:req.body.role});

    if(!role){
        return res.status(404).send({message:"Invalid role"})
    }
 
  const input = {
        email:req.body.email,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        telephone:req.body.telephone,
        isEmailVerified:req.body.isEmailVerified?req.body.isEmailVerified:false,
        role:role._id
  }

  user = new User(input);

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(user.password,salt);
  user.password=hashed;
  await user.save();

  return res.send({
      message:"The user has been successfully signed up"
  })

})



module.exports = router;
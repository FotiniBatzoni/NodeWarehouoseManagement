const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const paginateDocuments = require("../utilities/paginateDocuments");
const {User, validateUser} = require("../models/user");


router.get("/",[auth],async(req,res)=>{
    const usersQuery = User.find().select('-__v');

    let usersCount = await User.countDocuments();
  
    const url = `${req.protocol}://${req.get('host')}/api/users`;
  
    let users = await paginateDocuments(req.query, usersQuery, usersCount, url);
  

    return res.send(users);
});

router.get("/:userId",[auth],async(req,res)=>{
    const {userId} = req.params;

    if(!mongoose.isValidObjectId(userId)){
        return res.status(404).send({message:"1User has not been found"});
    }

    let user = await User.findOne({_id:userId}).select("-password -__v");

    if(!user){
        return res.status(404).send({message:"2User has not been found"});
    }

    return res.send(user)
    
})

router.put("/:userId",[auth,accessControl],async(req,res)=>{
    const userId = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(404).send({ message: 'User has not been found' });
      }

      const {error}= validateUser(req.body)
    if(error){
        // console.log(error)
        return res.status(400).send({message:error.details[0].message})
    }

    let role = await Role.findOne({_id:roleId})

    if(!role){
        return res.status(404).send({ message: 'Role has not been found' });
    }

    await User.findByIdAndUpdate(
        role,req.body,
        { new: true }
      );

      return res.send({message:"User has been successfully updated"})
})

module.exports = router;
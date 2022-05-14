const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const paginateDocuments = require("../utilities/paginateDocuments");
const {User, validateUser} = require("../models/user");
const {Role,validateRole} = require("../models/role")


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
        return res.status(404).send({message:"User has not been found"});
    }

    let user = await User.findOne({_id:userId}).select("-password -__v");

    if(!user){
        return res.status(404).send({message:"User has not been found"});
    }

    return res.send(user)
    
})

router.put("/:userId",[auth,accessControl],async(req,res)=>{
    const {userId} = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(404).send({ message: 'User has not been found' });
      }

      const {error}= validateUser(req.body)
    if(error){
        // console.log(error)
        return res.status(400).send({message:error.details[0].message})
    }

    if (!mongoose.isValidObjectId(req.body.role)) {
        return res.status(404).send({ message: 'Role is invalid' });
      }

    let role = await Role.findOne({_id:req.body.role})

    if(!role){
        return res.status(404).send({ message: 'Role has not been found' });
    }

    const user = await User.findByIdAndUpdate(
        userId,{
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            telephone:req.body.telephone,
            role:req.body.role
        },
        { new: true }
    );

    if(!user){
        return res.status(404).send({message:"User has not been found"})
    }

    return res.send({message:"User has been successfully updated"})
})

router.delete("/:userId",[auth,accessControl],async(req,res)=>{
    const {userId}=req.params;

    if(!mongoose.isValidObjectId(userId)){
        return res.status(404).send({message:"User has not been found"});
    }

    const user = await User.findOne({_id:userId}).select("-__v");

    if(!user){
        return res.status(404).send({message:"User has not been found"});
    }

    await User.findByIdAndDelete(userId);

    return res.send({message:"User has been successfully deleted"})
})

module.exports = router;
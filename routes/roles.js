const express= require("express");
const router= express.Router();
const mongoose = require("mongoose")
const auth=require("../middleware/auth")
const paginateDocuments = require("../utilities/paginateDocuments");
const accessControl = require("../middleware/accessControl");
const{Role,validateRole}=require("../models/role");

router.post("/",[auth,accessControl],async(req,res)=>{
    const {error}= validateRole(req.body)
    if(error){
        // console.log(error)
        return res.status(400).send({message:error.details[0].message})
    }

    delete req.body.action;

    let role = new Role(req.body)
   await role.save();

   return res.send({message:"Role is successfully saved"});
})

router.put("/:roleId",[auth,accessControl],async(req,res)=>{
    const {roleId}= req.params;

    if (!mongoose.isValidObjectId(roleId)) {
        return res.status(404).send({ message: 'Role has not been found' });
      }

    const {error}= validateRole(req.body)
    if(error){
        // console.log(error)
        return res.status(400).send({message:error.details[0].message})
    }

    let role = await Role.findByIdAndUpdate(
        role,req.body,
        { new: true }
      );

      if(!role){
        return res.status(404).send({ message: 'Role has not been found' });
    }

      return res.send({message:"Role has been successfully updated"})
})

router.get("/",[auth],async(req,res)=>{
    const rolesQuery = Role.find({});

    let rolesCount = await Role.countDocuments();

    url=`${req.protocol}://${req.get('host')}/api/roles`;

    const roles = await paginateDocuments(req.query, rolesQuery, rolesCount, url)

    return res.send(roles)
})

router.get("/:roleId",[auth],async(req,res)=>{
    const {roleId}= req.params;

    if (!mongoose.isValidObjectId(roleId)) {
        return res.status(404).send({ message: 'Role has not been found' });
      }

      const role = await Role.find({_id:roleId})

      if(!role){
        return res.status(404).send({ message: 'Role has not been found' });
      }

      return res.send(role)
})

router.delete("/:roleId",[auth,accessControl],async(req,res)=>{
    const {roleId}= req.params;

    if (!mongoose.isValidObjectId(roleId)) {
        return res.status(404).send({ message: 'Role has not been found' });
      }

      const role = await Role.findByIdAndDelete({_id:roleId});

      if(!role){
        return res.status(404).send({ message: 'Role has not been found' });
      }

      return res.send({message:"Role has been successfully deleted"})
})

module.exports = router;
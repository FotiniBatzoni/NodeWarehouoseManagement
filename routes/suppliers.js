const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { default: mongoose } = require("mongoose");
const auth = require("../middleware/auth");
const paginateDocuments = require("../utilities/paginateDocuments");
const {Supplier,validateSupplier}=require("../models/supplier");

router.post("/",[auth],async(req,res)=>{
    const {error} = validateSupplier(req.body);

    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    const supplier = new Supplier(req.body)

    await supplier.save();

    return res.send({message:"Supplier has been successfully saved"})
})

router.put("/:supplierId",[auth],async(req,res)=>{
    const {supplierId} = req.params;

    if(!mongoose.isValidObjectId(supplierId)){
        return res.status(404).send({message:"Supplier has not been found"});
    }

    const {error}= validateSupplier(req.body)
    if(error){
        // console.log(error)
        return res.status(400).send({message:error.details[0].message})
    }

    await Supplier.findByIdAndUpdate(
        supplierId,req.body,
        { new: true }
      );

    return res.send({message:"Supplier has been successfully updated"})
})

router.get("/",[auth],async(req,res)=>{
    const supplierQuery = Supplier.find({}).select("-__v");
    let supplierCount = await Supplier.countDocuments();
    const url = `${req.protocol}/${req.get('host')}/api/suppliers`;

   const suppliers = await paginateDocuments(req.query,supplierQuery,supplierCount,url);

    return res.send(suppliers)
})

router.get("/:supplierId",[auth],async(req,res)=>{
    const {supplierId}=req.params;

    if(!mongoose.isValidObjectId(supplierId)){
        return res.status(404).send({message:"Supplier has not been found"});
    }

    const supplier = await Supplier.findOne({_id:supplierId}).select("-__v");

    if(!supplier){
        return res.status(404).send({message:"Supplier has not been found"});
    }

    return res.send(supplier)
})

router.delete("/:supplierId",[auth],async(req,res)=>{
    const {supplierId}=req.params;

    if(!mongoose.isValidObjectId(supplierId)){
        return res.status(404).send({message:"Supplier has not been found"});
    }

    const supplier = await Supplier.findOne({_id:supplierId}).select("-__v");

    if(!supplier){
        return res.status(404).send({message:"Supplier has not been found"});
    }

    await Supplier.findByIdAndDelete(supplierId);

    return res.send({message:"Supplier has been successfully deleted"})
})

module.exports = router;
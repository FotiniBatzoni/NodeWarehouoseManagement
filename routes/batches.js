const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const {Batch,validateBatch} = require("../models/batch");
const { Product } = require("../models/product");
const { Supplier } = require("../models/supplier");

router.post("/",[auth,accessControl],async(req,res)=>{
    const {error} = validateBatch(req.body);
    if(error){
        return res.status(400).send({message: error.details[0].message})
    }
    
    if(!mongoose.isValidObjectId(req.body.product)){
        return res.status(404).send({message:"Invalid Product"});
    }

    const product = await Product.findOne({_id:req.body.product})
    if(!product){
        return res.status(404).send({message:"Product has not been found"});
    }

    if(!mongoose.isValidObjectId(req.body.supplier)){
        return res.status(400).send({message:"Invalid Supplier"});
    }

    const supplier = await Supplier.findOne({_id:req.body.supplier});
    if(!supplier){
        return res.status(400).send({message:"Supplier has not been found"});
    }
 
    const batch = new Batch(req.body);

    await batch.save();

    //add Batch to product
    product.batches.push(batch._id);
    await product.save();

    return res.send({message:"Batch is successfully saved"})

})

router.put("/:batchId",[auth],async(req,res)=>{
    const {batchId}= req.params;

    if(!mongoose.isValidObjectId(batchId)){
        return res.status(404).send({message:"Invalid Batch"});
    }
    
    const product = await Product.findOne({_id:req.body.product})
    if(!product){
        return res.status(404).send({message:"Product has not been found"});
    }

    if(!mongoose.isValidObjectId(req.body.supplier)){
        return res.status(400).send({message:"Invalid Supplier"});
    }

    const supplier = await Supplier.findOne({_id:req.body.supplier});
    if(!supplier){
        return res.status(400).send({message:"Supplier has not been found"});
    }

    const batch = await Batch.findOne({_id:batchId})

    if(batch.product.toString() != req.body.product){
     await Product.findOneAndUpdate(
           {_id:batch.product},
           { $pull:{batches:batchId}},
           {new:true}
        )
    }

    //has to be in save while updating
    batch.set(req.body);
    batch.save();

    if(!product.batches.includes(batch._id)){
        product.batches.push(batch._id);
        product.save();
    }


    return res.send({message:"Batch is successfully updated"})    
})

module.exports = router;
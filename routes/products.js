const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const paginateDocuments = require("../utilities/paginateDocuments");
const {Category} =  require("../models/category");
const {Product,validateProduct} = require("../models/product");
const req = require("express/lib/request");

router.post("/",[auth,accessControl],async(req,res)=>{
    const {error} = validateProduct(req.body);
    if(error){
        return res.status(400).send({message: error.details[0].message})
    }

    const category = await Category.findOne({categoryName:req.body.category});
    if(!category){
        return res.status(404).send({message:"Invalid Category"});
    }

    const product = new Product(req.body);

    await product.save();

    return res.send({message:"Product is successfully saved"})
})

router.put("/:productId",[auth,accessControl],async(req,res)=>{
    const {productId} = req.params;

    if(!mongoose.isValidObjectId(productId)){
        return res.status(404).send({message:"Invalid Product"});
    }

    const {error} = validateProduct(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }

    const product = await Product.findByIdAndUpdate(productId,req.body,{new:true});

    if(!product){
        return res.status(404).send({message:"Product has not been found"})
    }

    return res.send({message:"Product has been successfully updated"})
})

router.get("/",[auth],async(req,res)=>{
    const productsQuery = Product.find().populate({
        path:'batches',
        select:'-__v -product', 
        populate:{
            path:'supplier',
            select:'supplierName'
        }
    });

    const countProducts = await Product.countDocuments();
    
    const url = `${req.protocol}://${req.get('host')}/api/products`;


    const products = await paginateDocuments(req.query,productsQuery,countProducts,url);

    return res.send(products)
})

router.get("/:productId",[auth],async(req,res)=>{
    const {productId}=req.params;

    if(!mongoose.isValidObjectId(productId)){
        return res.status(404).send({message:"Invalid Product"});
    }

    const product = await Product.findOne({_id:productId}).populate({
        path:'batches',
        select:'-__v -product', 
        populate:{
            path:'supplier',
            select:'-__v'
        }
    })

    return res.send(product)
})

module.exports = router;
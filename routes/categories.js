const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const {Category,validateCategory } = require("../models/category");

router.post("/",[auth],async(req,res)=>{
    const {error} = validateCategory(req.body);
    // console.log(error)
    if(error){
        return res.status(400).send({ message: error.details[0].message });
    }

       let categoryName = await Category.findOne({categoryName:req.body.categoryName})

       if(categoryName){
        return res.send({message:`${req.body.categoryName} already exists`})
       }

    let category = new Category({
        categoryName : req.body.categoryName.toLowerCase()
    })

    await category.save();

    return res.send({message:"Category is successfully saved"})
})

router.put("/:categoryName",[auth],async(req,res)=>{
    const {categoryName} = req.params;
    categoryName = categoryName.toLowerCase()

    const {error} = validateCategory(req.body);
    // console.log(error)
    if(error){
        return res.status(400).send({ message: error.details[0].message });
    }

    
    let category = await Category.findOne({
        categoryName:categoryName
    })

    if(!category){
        return res.status(404).send({message:"Cannot find category"})
    }

    category = await Category.findByIdAndUpdate(
       category._id,{
            categoryName:req.body.categoryName.toLowerCase()
        },
        {new:true}
    )

    return res.send({message:"Category is successfully updated"})
})

router.get("/",[auth],async (req,res)=>{
    let categories = await Category.find({});

   for (let category of categories){
   let newCatName = category.categoryName.replace(category.categoryName.charAt(0),category.categoryName.charAt(0).toUpperCase());
    category.categoryName = newCatName;
   }

    return res.send(categories)
})

router.get("/:categoryName",[auth],async(req,res)=>{
    let {categoryName} = req.params;
    categoryName = categoryName.toLowerCase()
    
    let category = await Category.findOne({
        categoryName:categoryName
    })

    let newCatName = category.categoryName.replace(category.categoryName.charAt(0),category.categoryName.charAt(0).toUpperCase());
    category.categoryName = newCatName;

    return res.send(category)
})

router.delete("/:categoryName",[auth],async(req,res)=>{
    let {categoryName} = req.params;
    categoryName = categoryName.toLowerCase()
    
    let category = await Category.findOne({
        categoryName:categoryName
    })

    if(!category){
        return res.status(404).send({message:`The category ${categoryName} has not been found`})
    }

    await Category.findByIdAndDelete(
        category._id
    )
    return res.send({message:`Category ${categoryName} has successfully deleted`})
})

module.exports = router;
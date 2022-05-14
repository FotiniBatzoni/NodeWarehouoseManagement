const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const paginateDocuments = require("../utilities/paginateDocuments");
const {Store,validateStore} = require("../models/store");
const { default: mongoose } = require("mongoose");

router.post("/",[auth,accessControl],async(req,res)=>{
    const {error} = validateStore(req.body);
    //console.log(error)
    if(error){
        return res.status(404).send({message:error.details[0].message});
    }

    const store = new Store(req.body);

    await store.save();

    return res.send({message:"Store is successfully saved"})
})

router.put("/:storeId",[auth,accessControl],async(req,res)=>{
    const {storeId}= req.params;

    if(!mongoose.isValidObjectId(storeId)){
        return res.status(404).send({message:"Invalid Store"});
    }

    const {error} = validateStore(req.body)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    let store = await Store.findByIdAndUpdate(storeId,req.body,{new:true});

    if(!store){
        return res.status(404).send({message:"Store has not been found"});
    }

    return res.send({message:"Store has been successfully updated"});
});

router.get("/",[auth],async(req,res)=>{
    const storesQuery = Store.find({}).select("-__v");

    const storesCount = await Store.countDocuments();

    const url =`${req.protocol}://${req.get('host')}/api/stores`;

    const stores = await paginateDocuments(req.query,storesQuery,storesCount,url);

    return res.send(stores)
});

router.get("/:storeId",[auth],async(req,res)=>{
    const {storeId}=req.params;

    if(!mongoose.isValidObjectId(storeId)){
        return res.status(404).send({message:"Invalid Store"});
    }

    const store = await Store.findOne({_id:storeId});

    if(!store){
        return res.status(404).send({message:"Store has not been found"});
    }

    return res.send(store);
})

router.delete("/:storeId",[auth,accessControl],async(req,res)=>{
    const {storeId} = req.params

    if(!mongoose.isValidObjectId(storeId)){
        return res.status(404).send({message:"Invalid Store"})
    }

    const store = await Store.findOneAndDelete({_id:storeId});

    if(!store){
        return res.status(404).send({message:"Store has not been found"});
    }

    return res.send({message:"Store has been successfully deleted"})
})

module.exports = router;
const express = require("express");
const router = express.Router();
const Joi = require("joi")
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const {Store,validateStore} = require("../models/store");

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

module.exports = router;
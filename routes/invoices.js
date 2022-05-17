const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const {Invoice,validateInvoice} = require("../models/invoice");

router.post("/",[auth,accessControl],async(req,res)=>{
    const {error} = validateInvoice(req.body);
    console.log(error)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }
    return res.send("OK")
})

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const { Product } = require("../models/product");
const { Supplier } = require("../models/supplier");
const {Invoice,validateInvoice} = require("../models/invoice");
const { Batch } = require("../models/batch");


router.post("/",[auth,accessControl],async(req,res)=>{
    const {error} = validateInvoice(req.body);
    //console.log(error)
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    //check if delivery is on time
    const today = new Date().toISOString().split('T')[0];
    const duedate =req.body.dueDate.split(' ')[0];
    let dueDateComprarison = "";
    if(today>duedate){
        dueDateComprarison='Delivery is late'
    }else if(today<duedate){
        dueDateComprarison='Early Delivery'
    }else{
        dueDateComprarison='Delivery on time'
    }

    const invoice = new Invoice(req.body);
    invoice.save();

    //create batch from every product
    for(let product of req.body.products){
        const dbProduct = await Product.findOne({_id:product.productId})
        if(!dbProduct){
             return res.status(404).send({message:"Product has not been found"});
        }

        const supplier = await Supplier.findOne({_id:req.body.supplier})
        if(!supplier){
             return res.status(404).send({message:"Supplier has not been found"});
        }

        const input={
            product:product.productId,
            supplier:req.body.supplier,
            invoice:invoice._id,
            purchasePrice:product.purchasePrice,
            tax:product.tax,
            dateOfExpire:product.dateOfExpire
        }

        const batch = new Batch(input);
        batch.save();

        //add Batch to product
        dbProduct.batches.push(batch._id);
        dbProduct.quantity=(dbProduct.quantity)*1+ (product.quantity)*1;
        await dbProduct.save();

    }

    return res.send({message:dueDateComprarison,invoice:invoice})
})

module.exports = router;

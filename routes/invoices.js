const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const accessControl = require("../middleware/accessControl");
const dateComparison = require("../utilities/dateComparison");
const paginateDocuments = require("../utilities/paginateDocuments");
const { Product } = require("../models/product");
const { Supplier } = require("../models/supplier");
const {Invoice,validateInvoice} = require("../models/invoice");
const { Batch } = require("../models/batch");
const { default: mongoose } = require("mongoose");


router.post("/",[auth,accessControl],async(req,res)=>{
    const {error} = validateInvoice(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    //check if delivery is on time
    const dueDateComprarison= dateComparison(req.body.dueDate);

    const invoice = new Invoice(req.body);
    invoice.save();

    const supplier = await Supplier.findOne({_id:req.body.supplier})
    if(!supplier){
         return res.status(404).send({message:"Supplier has not been found"});
    }

    //create batch from every product
    for(let product of req.body.products){
        const dbProduct = await Product.findOne({_id:product.productId})
        if(!dbProduct){
             return res.status(404).send({message:"Product has not been found"});
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

router.put("/:invoiceId",[auth,accessControl],async(req,res)=>{
    const {invoiceId} = req.params;

    if(!mongoose.isValidObjectId(invoiceId)){
        return res.status(404).send({message:"Invalid Invoice"})
    }

    const {error} = validateInvoice(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    //check if delivery is on time
    const dueDateComprarison= dateComparison(req.body.dueDate);

    let invoice = await Invoice.findOne({_id:invoiceId});
    if(!invoice){
        return res.status(404).send({message:"Invoice has not been found"})
    }

    const supplier = await Supplier.findOne({_id:req.body.supplier})
    if(!supplier){
         return res.status(404).send({message:"Supplier has not been found"});
    }

    const batches = await Batch.find({invoice:invoiceId})

    //Products coming from the invoiceId
    let dbBatchProducts=[];
    for(let batch of batches){
        dbBatchProducts.push(batch.product.toString());
    }

    //product coming from req.body
    let reqProducts=[];
    for(let product of req.body.products){
        reqProducts.push(product.productId)
    }
   
    let productsToUpdate = dbBatchProducts.filter(el => reqProducts.includes(el))
 

    //Batches to Update
    for(let product of productsToUpdate){
        const dbProduct = await Product.findOne({_id:product})
        if(!dbProduct){
             return res.status(404).send({message:"Product has not been found"});
        }

        const filter ={invoice:invoiceId,product:product}
        const update ={
            product:product,
            supplier:req.body.supplier,
            invoice:invoiceId,
            purchasePrice:req.body.purchasePrice,
            tax:req.body.tax,
            dateOfExpire:req.body.dateOfExpire
            }
    

       const batchToUpdate = await Batch.findOneAndUpdate(filter,update,{new:true})

        //delete from array
        let dbBatchProductsIndex = dbBatchProducts.indexOf(product);
        dbBatchProducts.splice(dbBatchProductsIndex,1);

        let reqProductsIndex = reqProducts.indexOf(product);
        reqProducts.splice(reqProductsIndex,1);
    }


     //Batches to Delete
     for(let product of dbBatchProducts){

        const filter ={invoice:invoiceId,product:product}
        const batchToDelete = await Batch.findOneAndDelete(filter)

        //Delete batch from product
        await Product.findOneAndUpdate(
               {_id:product},
               { $pull:{batches:batchToDelete._id}},
               {new:true}
            )
     }


     //Batches To Create
     for(let product of reqProducts){
        const input ={
            product:product,
            supplier:req.body.supplier,
            invoice:invoiceId,
            purchasePrice:req.body.purchasePrice,
            tax:req.body.tax,
            dateOfExpire:req.body.dateOfExpire
            }
        const newBatch = new Batch(input);

        await newBatch.save();

        const dbProduct = await Product.findOne({_id:product})

        //add Batch to product
        dbProduct.batches.push(newBatch._id);
        await dbProduct.save();

        if(!dbProduct.batches.includes(newBatch._id)){
            dbProduct.batches.push(newBatch._id);
            dbProduct.save();
        }
    
    }

     invoice = await Invoice.findByIdAndUpdate(
        invoiceId,req.body,
        { new: true }
      );


    return res.send({dueDateComprarison:dueDateComprarison,
        message:"Invoice has been successfully updated"})
})

router.get("/",[auth],async(req,res)=>{
    const invoiceQuery = Invoice.find({})
        .populate({path:'products.productId'})
        .populate({path:'supplier'})

    const invoiceCount= await Invoice.countDocuments({});

    const url = `${req.protocol}://${req.get('host')}/api/invoices`

    const invoices = await paginateDocuments(req.query,invoiceQuery,invoiceCount,url)

    return res.send(invoices)
})

router.get("/:invoiceId",[auth],async(req,res)=>{
    const {invoiceId}= req.params;

    if(!mongoose.isValidObjectId(invoiceId)){
        return res.status(404).send({message:"Invalid Invoice"});
    }

    const invoice = await Invoice.findOne({_id:invoiceId})
        .populate({path:'products.productId'})
        .populate({path:'supplier'});

    if(!invoice){
        return res.status(404).send({message:"Invoice has not been found"});
    }

    return res.send(invoice)
})


module.exports = router;

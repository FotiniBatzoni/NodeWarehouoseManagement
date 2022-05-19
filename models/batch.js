const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const { Product } = require("./product");

const batchSchema = new mongoose.Schema({
    batchName :{
        type:String
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    supplier:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Supplier'
    },
    invoice:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Invoice'
    },
    purchasePrice:{
        type : Number
    },
    tax:{
        type: Number
    },
    dateOfExpire:{
        type: Date
    }
},{timestamps:true});

batchSchema.pre('save',async function(next){
    let counter = 1;
    const product = await Product.findOne({_id:this.product})
    const existingName=await Product.findOne({productName:product.productName});
    if(!existingName){
        counter=1
    }
    let baseName = `${product.productName}_batch/${counter}`
    let batchName = await Batch.findOne({batchName:baseName})
    while(batchName){
            ++counter;
            baseName = `${product.productName}_batch/${counter}`
            batchName = await Batch.findOne({batchName:baseName})
    }
    this.batchName = baseName

    next();
});

const Batch = mongoose.model("Batch",batchSchema);

function validateBatch(batch){
    const schema = Joi.object({
        product: Joi.ObjectId().required().empty().messages({
            "any.required": `Product is a required field`,
            "any.empty":`Product should not be empty`,
            "string.pattern.name":`Invalid Product`
          }),
        supplier: Joi.ObjectId().required().empty().messages({
            "any.required": `Supplier is a required field`,
            "any.empty":`Supplier should not be empty`,
            "string.pattern.name":`Invalid Supplier`
          }),
        invoice: Joi.ObjectId().required().empty().messages({
            "any.required": `Invoice is a required field`,
            "any.empty":`Invoice should not be empty`,
            "string.pattern.name":`Invalid Invoice`
          }),
        purchasePrice: Joi.number().required().precision(2).allow('', null).min(0).messages({
            "number.base": `Purchase Price should be number`,
            "number.min": `Purchase Price cannot be negative`,
        }),
        dateOfExpire:Joi.date().raw().required().greater('now').empty().messages({
            "any.required": `Date Of Expire is a required field`,
            "any.empty":`Date Of Expire should not be empty`,
            "date.base":`Date Of Expire should be date`,
        }),
        tax:Joi.number().required().integer().min(0).messages({
            "any.required":`Tax is a required field`,
            "number.base":`Tax should be numeric`,
            "number.integer":`Tax should be integer`,
            "number.min":`Tax cannot negative`         
        }),
    },{unknown:true})

    return schema.validate(batch)
}

module.exports={
    Batch,
    validateBatch
}

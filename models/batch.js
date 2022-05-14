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
    purchasePrice:{
        type : Number
    },
    dateOfExpire:{
        type: Date
    },
    deliveryDay:{
        type :Date
    }
},{timestamps:true});

batchSchema.pre('save',async function(next){
    let counter = 1;
    const product = await Product.findOne({_id:this.product})
    const nonexistingName=await Batch.findOne({productName:product.productName});
    if(nonexistingName){
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
          }),
        supplier: Joi.ObjectId().required().empty().messages({
            "any.required": `Supplier is a required field`,
            "any.empty":`Supplier should not be empty`,
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
        deliveryDay:Joi.date().raw().required().empty().messages({
            "any.required": `Delivery Day is a required field`,
            "any.empty":`Delivery Day should not be empty`,
            "date.base":`Delivery Day should be date`,
        }),
    },{unknown:true})

    return schema.validate(batch)
}

module.exports={
    Batch,
    validateBatch
}

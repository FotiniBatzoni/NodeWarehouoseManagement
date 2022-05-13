const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
    },
    decscription:{
        type:String
    },
    unitOfMeasurement:{
       type:String,
       enum:['Piece','Kilo']
    },
    quantity:{
        type:Number,
        default:0
    },
    minQuantity:{
        type:Number
    },
    maxQuantity:{
        type:Number
    },
    purchasePrice:{
        type:Number
    },
    methodStockMangement:{
       type:String,
       enum:['FIFO','LIFO']
    },
    dateOfExpire:{
        type:Date
    },
    image:{
        type:String
    },
    supplierId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    category:{
        type:mongoose.Schema.Types.String,
        ref:'Category'
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamp:true})

productSchema.pre('save',async function(next){
    this.purchasePrice = this.purchasePrice.toFixed()

    if(this.productName && this.isNew){
        let counter = 0;
        let baseName=this.productName;
        let docName = await productSchema.findOne({productName:baseName})
        while(docName){
            ++counter;
            baseName =`${baseName}_${counter}`;
            docName = await productSchema.findOne({productName:baseName})
        }
        this.productName = baseName
    }

    if(this.productName && !this.isNew){
        let counter = 0;
        let baseName=this.productName;
        let docName = await productSchema.findOne({productName:baseName,_id:{$ne:this._id}})
        while(docName){
            ++counter;
            baseName =`${baseName}_${counter}`;
            docName = await productSchema.findOne({productName:baseName,_id:{$ne:this._id}})
        }
        this.productName = baseName
    }

    next();

})

const Product = mongoose.model("Product",productSchema);

const validateProduct = Joi.object({

})

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;

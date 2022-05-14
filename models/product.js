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
        type:Number,
        default:5
    },
    maxQuantity:{
        type:Number,
        default:50
    },
    batches:[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Batch'
    }
    ],
    stockMangementMethod:{
       type:String,
       enum:['FIFO','LIFO']
    },
    image:{
        type:String
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
    if(this.productName && this.isNew){
        let counter = 0;
        let baseName=this.productName;
        let docName = await Product.findOne({productName:baseName})
        while(docName){
            ++counter;
            baseName =`${baseName}_${counter}`;
            docName = await Product.findOne({productName:baseName})
        }
        this.productName = baseName
    }

    if(this.productName && !this.isNew){
        let counter = 0;
        let baseName=this.productName;
        let docName = await Product.findOne({productName:baseName,_id:{$ne:this._id}})
        while(docName){
            ++counter;
            baseName =`${baseName}_${counter}`;
            docName = await Product.findOne({productName:baseName,_id:{$ne:this._id}})
        }
        this.productName = baseName
    }

    next();

})

const Product = mongoose.model("Product",productSchema);

function validateProduct(product){
    const schema = Joi.object({
        productName: Joi.string().required().empty().trim().min(2).max(50).messages({
            "any.required":`Product Name is a required fileld`,
            "string.empty":`Product Name cannot be an empty field`,
            "string.min":`Product Name should have at least 2 characters`,
            "string.max":`Product Name should have at most 50 characters`,
        }),
        description: Joi.string().required().allow("",null).trim().min(2).max(1000).messages({
            "any.required":`Product Name is a required fileld`,
            "string.min":`Product Name should have at least 2 characters`,
            "string.max":`Product Name should have at most 1000 characters`,
        }),
        unitOfMeasurement: Joi.string().required().empty().valid('Kilo', 'Piece').messages({
            "any.required": `Unit of Measurement is a required field`,
            "any.only": `Please choose unit od measurement`,
            "string.empty": `Unit of Measurement should not be empty`,
            "string.base": `Unit of Measurement should ne string`,
        }),
        quantity: Joi.number().required().allow('', null).min(0).messages({
            "number.base": `Quantity should be number`,
            "number.min": `Quantity cannot be negative`,
        }),
        minQuantity: Joi.number().required().allow('', null).min(0).messages({
            "number.base": `Mininum Quantity should be number`,
            "number.min": `Minimum Quantity cannot be negative`,
        }),
        maxQuantity: Joi.number().required().allow('', null).min(0).messages({
            "number.base": `Maxinum Quantity should be number`,
            "number.min": `Maximum Quantity cannot be negative`,
        }),
       
        stockMangementMethod: Joi.string().required().empty().valid('FIFO', 'LIF0').messages({
            "any.required": `Stock Management Method is a required field`,
            "any.only": `Please choose stock Management Method`,
            "string.empty": `Stock Management Method should not be empty`,
            "string.base": `Stock Management Method should ne string`,
        }),
        category:Joi.string().required().messages({
            "any.required":"Category is a requied field"
        }),
        isActive: Joi.boolean().messages({
            "boolean.base": `isActive should ne a boolean`,
          }),
    },{unkonow:true})

    return schema.validate(product);
}  

function transformSingleProductsImages(req, product) {
    let transformedProduct = product;
  
    if (product instanceof Product) {
      transformedProduct = product.toObject();
    }
  
    let gallery = transformedProduct.gallery;
  
    let transformedImages = [];
    for (let image of gallery) {
      let transformedImage = image;
      if (image) {
        transformedImage = `${req.protocol}://${req.get('host')}/assets/images/products/${image}`;
        transformedImages.push(transformedImage);
      }
    }
  
    return { ...transformedProduct, gallery: transformedImages };
  }
  
  function transformArrayProductsImages(req, productArray) {
    let transformedProducts = [];
    for (let product of productArray) {
      let transformed = transformSingleProductsImages(req, product);
      transformedProducts.push(transformed);
      ``;
    }
    return transformedProducts;
  }

module.exports={
    Product,
    validateProduct,
    transformSingleProductsImages,
    transformArrayProductsImages,
}

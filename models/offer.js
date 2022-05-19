const mongoose = require("mongoose");
const Joi = requier("joi");

const offerSchema = new mongoose.Schema({
    suppliers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Supplier'
    }],
    offerDate:{
        type: Date
    },
    products:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity:{
            type: Number
        },
        unitOfMeasurement:{
            type:String,
            enum:['Piece','Kilo']
         },
         productNotes:{
             type:String
         }
    }],
    generalNotes:{
        type:String
    },
    paymentMethods:{
        type:String,
        enum:['In Advance','50% Retainer','In Delivery','After Delivery']
    }
},{timestamps:true})

const Offer = mongoose.model('Offer',offerSchema)

function validateOffer(offer){
    const schema=Joi.Object({
        suppliers:Joi.array().items(
            Joi.ObjectId().required().empty().messages({
                "any.required": `Supplier is a required field`,
                "any.empty":`Supplier should not be empty`,
                "string.pattern.name":`Invalid Supplier`
              }),
        ).required().messages({
        "any.required":`Suppliers is a required field`,
        "array.base":`Suppliers should be an array`
         }),
        offerDate:Joi.date().required().less('now').messages({
            "any.required":`Offer Date is a required field`,
            "date.base":`Offer Date should be date`,
            "date.less":`Offer Date should not be greater than today`        
        }),
        products:Joi.array().items(
            Joi.object({
                productId: Joi.ObjectId().required().empty().messages({
                    "any.required": `Product is a required field`,
                    "any.empty":`Product should not be empty`,
                    "string.pattern.name":`Invalid Product`
                  }),
                quantity:Joi.number().required().min(0).messages({
                    "any.required":`Quantity is a required field`,
                    "number.base":`Quantity should be numeric`,
                    "number.min":`Quantity cannot negative`         
                }),
                unitOfMeasurement: Joi.string().required().empty().valid('Kilo', 'Piece').messages({
                    "any.required": `Unit of Measurement is a required field`,
                    "any.only": `Please choose unit od measurement`,
                    "string.empty": `Unit of Measurement should not be empty`,
                    "string.base": `Unit of Measurement should be string`,
                }),
                productNotes: Joi.string().required().allow("",null).max(10000).messages({
                    "any.required": `Product notes is a required field`,
                    "string.base": `Product notes should be string`,
                    "string.max":`Product notes should have at most 10000 characters`
                })
            })
        ).required().messages({
            "any.required":`Products is a required field`,
            "array.base":`Products should be an array`
        }),
        generalNotes: Joi.string().required().allow("",null).max(10000).messages({
            "any.required": `General notes is a required field`,
            "string.base": `General notes should be string`,
            "string.max":`General notes should have at most 10000 characters`
        }),
        paymentMethods: Joi.string().required().empty().valid('In Advance','50% Retainer','In Delivery','After Delivery').messages({
            "any.required": `Payment Method is a required field`,
            "any.only": `Please choose payment method`,
            "string.empty": `Payment Method should not be empty`,
            "string.base": `Payment Method should ne string`,
        }),
    })

    return schema.validate(offer)
}

module.exports.Offer = Offer;
module.exports.validateOffer = validateOffer;
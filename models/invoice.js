const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);

const invoiceSchema = new mongoose.Schema({
    supplier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    invoiceNumber:{
        type:Number
    },
    invoiceDate:{
        type: Date
    },
    dueDate:{
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
            purchasePrice:{
                type: Number
            },
            dateOfExpire:{
                type: Date
            },
            tax:{
                type: Number
            },
            subtotal:{
                type: Number
            }
         }
    ],
   
    total:{
        type: Number
    },
    paid:{
        type: Boolean
    },
    //προκαταβολη
    retainer:{
        type:Number
    },
    paymentWithin:{
        type:Number
    },
   
})

const Invoice = mongoose.model("Invoice", invoiceSchema);

function validateInvoice(invoice){
    const schema = Joi.object({
        invoiceNumber:Joi.number().required().integer().min(0).messages({
            "any.required":`Invoice Number is a required field`,
            "number.base":`Invoice Number should be numeric`,
            "number.integer":`Invoice Number should be integer`,
            "number.min":`Invoice Number cannot negative`         
        }),
        invoiceDate:Joi.date().required().less('now').messages({
            "any.required":`Invoice Date is a required field`,
            "date.base":`Invoice Date should be date`,
            "date.less":`Invoice Date should not be greater than today`        
        }),
        dueDate:Joi.date().required().messages({
            "any.required":`Due Date is a required field`,
            "date.base":`Due Date should be date`,        
        }),
        products:Joi.array().items(
            Joi.object({
                productId: joi.ObjectId().required().empty().messages({
                    "any.required": `Product is a required field`,
                    "any.empty":`Product should not be empty`,
                  }),
                quantity:Joi.number().required().min(0).messages({
                    "any.required":`Quantity is a required field`,
                    "number.base":`Quantity should be numeric`,
                    "number.min":`Quantity cannot negative`         
                }),
                purchasePrice:Joi.number().required().min(0).messages({
                    "any.required":`Purchase Price is a required field`,
                    "number.base":`Purchase Price should be numeric`,
                    "number.min":`Purchase Price cannot negative`         
                }),
                dateOfExpire:Joi.date().required().allow("",null).less('now').messages({
                    "any.required":`Invoice Date is a required field`,
                    "date.base":`Invoice Date should be date`,
                    "date.less":`Invoice Date should not be greater than today`        
                }),
                tax:Joi.number().required().integer().min(0).messages({
                    "any.required":`Tax is a required field`,
                    "number.base":`Tax should be numeric`,
                    "number.integer":`Tax should be integer`,
                    "number.min":`Tax cannot negative`         
                }),
                subtotal:Joi.number().required().min(0).messages({
                    "any.required":`Subtotal is a required field`,
                    "number.base":`Subtotal should be numeric`,
                    "number.min":`Subtotal cannot negative`         
                }),
            }).required().messages({
                "any.required":`Products is a required field`,
                "array.base":`Products should be an array`
            })
        ),
        total:Joi.number().required().min(0).messages({
            "any.required":`Total is a required field`,
            "number.base":`Total should be numeric`,
            "number.min":`Total cannot negative`         
        }),
        paid:Joi.boolean().required().messages({
            "any.required":`Paid is a required field`,
            "boolean.base":`Paid should be boolean`,
        }),
        retainer:Joi.number().required().min(0).messages({
            "any.required":`Retainer is a required field`,
            "number.base":`Retainer should be numeric`,
            "number.min":`Retainer cannot negative`         
        }),
        paymentWithin:Joi.number().required().integer().min(0).messages({
            "any.required":`Payment within is a required field`,
            "number.base":`Payment within should be numeric`,
            "number.integer":`Payment within should be integer`,
            "number.min":`Payment within should not be negative`         
        }),
    }).unknown(true)

    return schema.validate(invoice)
}

module.exports.Invoice = Invoice;
module.exports.validateInvoice = validateInvoice;

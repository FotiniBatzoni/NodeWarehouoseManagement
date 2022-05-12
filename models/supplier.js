const Joi = require("Joi");
const mongoose = require("mongoose");

const suppliersSchema = new mongoose.Schema({
    supplierName:{
        type:String
    },
    TIN:{
        type:String
    },
    headOffice:{
        type:String
    },
    telephone:{
        type:String
    },
    address:{
        type:String
    },
    IBAN:{
        type:String
    }
})

const Supplier = mongoose.model("Supplier",suppliersSchema)

function validateSupplier(supplier){
    const schema = Joi.object({
        supplierName:Joi.string().required().trim().empty().min(2).max(100).messages({
            "any.required":`Supplier's name is required field`,
            "string.empty":`Supplier's name should not be an empty field`,
            "string.min": `Supplier's name should have at least 2 characters`,
            "string.max": `Supplier's name should have length at most 100 characters`,
            "string.empty":`Suppler's name cannot be an empty field`
        }),
        TIN:Joi.string().required().empty().trim().length(9).messages({
            "any.required":`TIN is required field`,
            "string.empty":`TIN should not be an empty field`,
            "string.length": `TIN should have 9 characters`,
            "string.empty":`TIN cannot be empty field`
        }),
        headOffice:Joi.string().required().empty().trim().min(2).max(50).messages({
            "any.required":`Head Office is required field`,
            "string.empty":`Head Office should not be an empty field`,
            "string.min": `Head Office should have at least 2 characters`,
            "string.max": `Head Office should have length at most 100 characters`,
            "string.empty":`Head Office cannot be empty field`
        }),
        telephone:Joi.string().length(10).pattern(/^[0-9]+$/).required()
        .messages({
            "any.required": `Telephone is a required field`,
            "string.length": `Telephone should have  10 digits`,
            "string.empty": `Telephone should not be empty`,
            "string.pattern.base":`Telephone should be numeric` 
        }),
        address:Joi.string().required().trim().empty().min(2).max(100).messages({
            "any.required":`Address is required field`,
            "string.empty":`Address should not be an empty field`,
            "string.min": `Address should have at least 2 characters`,
            "string.max": `Address should have length at most 100 characters`,
            "string.empty":`Address cannot be an empty field`
        }),
        IBAN:Joi.string().required().trim().empty().min(16).max(28).messages({
            "any.required":`IBAN is required field`,
            "string.empty":`IBAN should not be an empty field`,
            "string.min": `IBAN should have at least 2 characters`,
            "string.max": `IBAN should have length at most 100 characters`,
            "string.empty":`IBAN cannot be an empty field`
        }),
    }).unknown(true)

    return schema.validate(supplier);
}

module.exports.Supplier = Supplier;
module.exports.validateSupplier = validateSupplier;
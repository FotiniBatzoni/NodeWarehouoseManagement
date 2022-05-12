const mongoose = require("mongoose");
const Joi = require("joi");

const storeSchema = new mongoose.Schema({
    storeName:{
        type:String
    },
    region:{
        type:String
    },
    contactPerson:{
        name:{
            type:String
        },
        telephone:{
            type:String
        },
        email:{
            type:String
        }
    }
})

const Store = mongoose.model('Store',storeSchema);

function validateStore(store){
   const schema = Joi.object({
       storeName: Joi.string().required().empty().trim().min(2).max(50).messages({
            "any.required":`Store Name is a required fileld`,
            "string.empty":`Store Name cannot be an empty field`,
            "string.min":`Store Name should have at least 2 characters`,
            "string.max":`Store Name should have at most 50 characters`,
        }),
        region: Joi.string().required().empty().trim().min(2).max(50).messages({
            "any.required":`Region is a required fileld`,
            "string.empty":`Region cannot be an empty field`,
            "string.min":`Region should have at least 2 characters`,
            "string.max":`Region should have at most 50 characters`,
        }),
        contactPerson: Joi.object({
            name:Joi.string().required().empty().trim().min(2).max(50).messages({
                "any.required":`Name is a required fileld`,
                "string.empty":`Name cannot be an empty field`,
                "string.min":`Name should have at least 2 characters`,
                "string.max":`Name should have at most 50 characters`
            }),
            telephone:Joi.string().empty().required().length(10).pattern(/^[0-9]+$/).messages({
                "any.required": `Telephone is a required field`,
                "string.length": `Telephone should have  10 digits`,
                "string.empty": `Telephone should not be empty`,
                "string.pattern.base":`Telephone should be numeric`    
            }),
            email:Joi.string().empty().email().required().min(8).max(50)
            .messages({
                "any.required": `Email is a required field`,
                "string.email":`Invalid email`,
                "string.min": `Email should have at least 8 letters length`,
                "string.max": `Email should have at most 50 letters length`,
                "string.empty": `Email should not be empty`
            }),
        }).required().empty().messages({
            "any.required":`Contact Person is a required fileld`,
            "string.empty":`Contact Person cannot be an empty field`,
})
    }).unknown(true)

return schema.validate(store);
}

module.exports.Store = Store;
module.exports.validateStore = validateStore;
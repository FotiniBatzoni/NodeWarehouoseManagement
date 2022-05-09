const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required:true,
        unique:true
    }
})

const Category = mongoose.model("category",categorySchema);

function validateCategory(category){
    const schema = Joi.object({
        categoryName:Joi.string().required().min(2).max(50)
        .messages({
            "any.required": `The Name of Category is a required field`,
            "string.min": `The Name of Category should have at least 2 letters length`,
            "string.max": `The Name of Category should have at most 50 letters length`,
            "string.empty": `The Name of Category should not be empty`
        })
    });
    return schema.validate(category);
}

module.exports.Category = Category;
module.exports.validateCategory = validateCategory;
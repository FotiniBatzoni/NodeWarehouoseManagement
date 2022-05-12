const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        default:process.env.defaultPassword
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    telephone:{
        type:String
    },
    role:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Role"
    },
    verificationCode:{
        type:String,
        length:5
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
      {
        _id: this.id,
        _lastName: this.lastName,
        _email: this.email,
      },
      process.env.JWT_KEY
    );
    return token;
  };

const User = mongoose.model('User',userSchema);


function validateUser(user){
    const schema = Joi.object({
        email:Joi.string().email().required().min(8).max(50)
        .messages({
            "any.required": `Email is a required field`,
            "string.email":`Invalid email`,
            "string.min": `Email should have at least 8 letters length`,
            "string.max": `Email should have at most 50 letters length`,
            "string.empty": `Email should not be empty`
        }),
        password:Joi.string().min(8).max(50)
        .messages({
            "string.min": `Password should have at least 8 letters length`,
            "string.max": `Password should have at most 50 letters length`
        }),
        firstName:Joi.string().required().min(2).max(50)
        .messages({
            "any.required": `First Name is a required field`,
            "string.min": `First Name should have at least 2 letters length`,
            "string.max": `First Name should have at most 50 letters length`,
            "string.empty": `First Name should not be empty`
        }),
        lastName:Joi.string().required().min(2).max(50)
        .messages({
            "any.required": `Last Name is a required field`,
            "string.min": `Last Name should have at least 2 letters length`,
            "string.max": `Last Name should have at most 50 letters length`,
            "string.empty": `Last Name should not be empty`
        }),
        telephone:Joi.string().length(10).pattern(/^[0-9]+$/).required()
        .messages({
            "any.required": `Telephone is a required field`,
            "string.length": `Telephone should have  10 digits`,
            "string.empty": `Telephone should not be empty`,
            "string.pattern.base":`Telephone should be numeric` 
        })
     
    }).unknown(true);
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
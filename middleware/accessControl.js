const Joi = require("joi");
const {Role} = require("../models/role");
const actions = require("../utilities/actions.json");
const divideCamelCaseString = require("../utilities/divideCamelCaseString");

module.exports = async(req,res,next)=>{
    let action = req.body.action;

    if(!action){
        return res.send({message:"There is no action in your request"});
    }

    const actionToUpperCase = action.replace(action.charAt(0),action.charAt(0).toUpperCase());

    let model = divideCamelCaseString(action);
     model = model.toLowerCase();

    let hasMatch=false;

    let possibleActions = actions;

    if(possibleActions.hasOwnProperty(action)){
        hasMatch=true;
    }

    if(!hasMatch){
        return res.status(400).send({message:"Invalid Action"})
    }

    const role = await Role.findOne({_id:req.user.role});

    if(!role.rights[model]['can'+actionToUpperCase]){
        return res.status(403).send({message:"You have not access"})
    }

    delete req.body.action;
    
    next();
}


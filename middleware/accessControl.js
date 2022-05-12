const Joi = require("joi");
const {Role} = require("../models/role");
const actions = require("../utilities/actions.json")

module.exports = async(req,res,next)=>{
    let action = req.body.action;

    if(!action){
        return res.send({message:"There is no action in your request"});
    }

    let hasMatch=false;

    let possibleActions = actions;
    //console.log(possibleActions);

    console.log(action)
    if(possibleActions.hasOwnProperty(action)){
        hasMatch=true;
    }

    console.log(hasMatch)
    if(!hasMatch){
        return res.status(400).send({message:"Invalid Action"})
    }

    const role = await Role.findOne({_id:req.user.role});
    // console.log(role.rights)

    console.log(req.body)
    console.log("action"+action)
    if(action==="createRole" && !role.rights.role.canCreateRole){
        return res.status(403).send({message:"1You have not access"})
    }

    if(action==="updateRole" && !role.rights.role.canUpdateRole){
        return res.status(403).send({message:"2You have not access"})
    }

    if(action==="deleteRole" && !role.rights.role.canDeleteRole){
        return res.status(403).send({message:"3You have not access"})
    }

    if(action==="createUser" && !role.rights.user.canCreateUser){
        return res.status(403).send({message:"4You have not access"})
    }

    if(action==="updateUser" && !role.rights.user.canUpdateUser){
        return res.status(403).send({message:"5You have not access"})
    }

    if(action==="deleteUser" && !role.rights.user.canDeleteUser){
        return res.status(403).send({message:"6You have not access"})
    }

    if(action==="createStore" && !role.rights.store.canCreateStore){
        return res.status(403).send({message:"7You have not access"})
    }

    if(action==="updateStore" && !role.rights.store.canUpdateStore){
        return res.status(403).send({message:"8You have not access"})
    }

    if(action==="deleteStore" && !role.rights.store.canDeleteStore){
        return res.status(403).send({message:"9You have not access"})
    }

    if(action==="createCategory" && !role.rights.category.canCreateCategory){
        return res.status(403).send({message:"10You have not access"})
    }

    if(action==="updateCategory" && !role.rights.category.canUpdateCategory){
        return res.status(403).send({message:"11You have not access"})
    }

    if(action==="deleteCategory" && !role.rights.category.canDeleteCategory){
        return res.status(403).send({message:"12You have not access"})
    }

    if(action==="createInvoice" && !role.rights.invoice.canCreateInvoice){
        return res.status(403).send({message:"13You have not access"})
    }

    if(action==="updateInvoice" && !role.rights.invoice.canUpdateInvoice){
        return res.status(403).send({message:"14You have not access"})
    }

    if(action==="deleteInvoice" && !role.rights.invoice.canDeleteInvoice){
        return res.status(403).send({message:"15You have not access"})
    }

     if(action==="createDelivryNote" && !role.rights.deliveryNote.canCreateDeliveryNote){
        return res.status(403).send({message:"16You have not access"})
    }

    if(action==="updateDelivryNote" && !role.rights.deliveryNote.canUpdateDeliveryNote){
        return res.status(403).send({message:"17You have not access"})
    }

    if(action==="deleteDelivryNote" && !role.rights.deliveryNote.canDeleteDeliveryNote){
        return res.status(403).send({message:"18You have not access"})
    }
   
    next();
}


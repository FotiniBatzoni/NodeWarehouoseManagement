const {Role} = require("../models/role")

module.exports = async(req,res,next)=>{
    console.log(req.user.role);
    const role = await Role.findOne({_id:req.user.role});
    console.log(role)

    const action = req.body.action
    if(action==="createRole" && !role.rights.role.canCreateRole){
        return res.status(403).send({message:"You have not access"})
    }

    if(action==="updateRole" && !role.rights.role.canUpdateRole){
        return res.status(403).send({message:"You have not access"})
    }

    if(action==="deleteRole" && !role.rights.role.canDeleteRole){
        return res.status(403).send({message:"You have not access"})
    }

    console.log(role.rights.user.canCreateUser)
    if(!role.rights.user.canCreateUser){
        return res.status(403).send({message:"You have not access"})
    }
    
    next();
}
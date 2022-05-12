const jwt = require("jsonwebtoken");
const { User }= require("../models/user")

async function auth(req,res,next){
    const token = req.header("x-auth-token");
    //console.log(token)
    if(!token){
        return res.status(401).send({message:"Unauthenticated"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.user = decoded;

        let user = await User.findOne({_id:req.user._id});
        //console.log(user)
        if(!user){
            return res.status(401).send({message:"Unauthenticated"});
        }
        req.user= user;


        next();
    }catch(ex){
        return res.status(400).send({message:ex.message})
    }
}


module.exports= auth;
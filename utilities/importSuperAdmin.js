require("dotenv").config();
require("../startup/db")();
const bcrypt= require("bcrypt");
const {User}=require("../models/user");

async function importAdmin(){
let password = "progressnet";

 //hash password
 const salt =await bcrypt.genSalt(10);
 const hashed =await bcrypt.hash(password,salt);
 password=hashed;


const admin={
        email:"superAdmin@test.com",
        password:password,
        firstName:"Mara",
        lastName:"Simon",
        telephone:"6955662233",
        isEmailVerified:true,
        role:"6278d805add2201864cdc36c"
}

    const user = new User(admin)
    await user.save();
    console.log(user)
    console.log("Admin has successfully saved")
    process.exit()

}
    
importAdmin();

const express = require("express")
const authRouter  = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user");
const {validateSignupData}=require("../utils/validation")

authRouter.post("/signup", async (req,  res)=>{  
    try{
        //Validation of data
        validateSignupData(req);
        //Encryp the password
        const {firstName, lastName, emailId} = req.body;        
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        //creating new user
        const user = new User(
            {
                firstName, 
                lastName,
                emailId,
                password: passwordHash
            }
        );
            await user.save();
            res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }
})


authRouter.post("/login",  async (req, res)=>{
    try{ 
        const {password, emailId} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentails");
        }
        const isPasswordValid = await user.validPassword(password)
        //sending cookie to browser
        
        if(isPasswordValid){
            //create a jwt token
            const token = await user.getJWT();
            
            //sending cookie to browser
            res.cookie("token", token);
            res.send("Login successful...")
        }else{
            throw new Error("Invalid credentails");
        }
    }catch(err){
        res.status(400).send("Error: "+err.message);
    } 
})


authRouter.post("/logout",async  (req, res)=>{
    res.clearCookie("token")
    res.send("Logout successfully....");
})



module.exports = authRouter

const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignupData}=require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const userAuth = require("./middleware/userAuth");
require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,  res)=>{  
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

app.get("/profile",userAuth, async (req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send("Please LOGIN again");
    }
})

app.post("/login",  async (req, res)=>{
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

app.post("/sendConnecitionRequest",userAuth, (req, res)=>{
    const user = req.user;

    console.log("Sending a connection request");

    res.send(user.firstName + " sent a connection request");
})


connectDB().then(() => {
    console.log("Connection established successfully");
        app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err)=>{
    console.error("DB not connected");
})




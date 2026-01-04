const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignupData}=require("./utils/validation")
const bcrypt = require("bcrypt")

app.use(express.json());

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

app.post("/login",  async (req, res)=>{
    try{ 
        const {password, emailId} = req.body;
        const user = await User.findOne({emailId: emailId});if(!user){
            throw new Error("Invalid credentails");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            res.send("Login successful...")
        }else{
            throw new Error("Invalid credentails");
        }
    }catch(err){
        res.status(400).send("Error: "+err.message);
    } 
})



// finds a particular document Sfrom their emailId
app.get("/user", async (req, res)=>{
    const userMail = req.body.emailId;
    const users = await User.find({emailId: userMail});
    console.log(users);
    try{
        if(users.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(404).send("Something went wrong");
    }
})

//reterives all the user data from data bas eand sends as responds to the request
app.get("/feed",async (req, res)=>{
    try{
        const users =  await User.find({});
        res.send(users);
    }catch(err){
        res.status(404).send("Something went wrong");
    }
})

app.delete("/user", async (req,  res)=>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete({_id: userId});
        //User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(404).send("Something went wrong");
    }
})

app.patch("/user/:userId",async (req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = [
            "age",
            "skills",
            "about",
            "gender",
            "photourl",
            "password"
        ]

        isUpdateAllowed = Object.keys(data).every((k)=>(
            ALLOWED_UPDATES.includes(k)
        ))
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills != undefined){
            if(data?.skills.length>=10){
               throw new Error("Skills length cannot be greater then 10")
            }
        }
        await User.findByIdAndUpdate({_id:userId}, data,{
            runValidators:true,
        });
        res.send("Data updated successfully");
    }catch(err){
        res.status(404).send("UPDATE FAILED: "+err.message);
    }

})

connectDB().then(() => {
    console.log("Connection established successfully");
        app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err)=>{
    console.error("DB not connected");
})




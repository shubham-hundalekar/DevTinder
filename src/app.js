const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req,  res)=>{
    
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error saving the data "+err.message)
    }
})

//finds a particular document from their emailId
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

app.patch("/user",async (req, res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = [
            "userId",
            "age",
            "skills",
            "about",
            "gender"
        ]

        isUpdateAllowed = Object.keys(data).every((k)=>{
            ALLOWED_UPDATES.includes(k)
        })

        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
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




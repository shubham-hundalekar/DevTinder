const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req,  res)=>{
    const userObj = {
        firstName: "Shubham",
        lastName: "Hundalekar",
        emailId:"shubhamdh32@gmail.com",
        password: "shubham@123"

    }
    const user = new User(userObj);
    await user.save();
    res.send("User added successfully");
})



connectDB().then(() => {
    console.log("Connection established successfully");
        app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err)=>{
    console.error("DB not connected");
})




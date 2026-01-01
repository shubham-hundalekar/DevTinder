const express = require("express");
const app = express();
const adminAuth = require("./middleware/adminAuth");
const userAuth = require("./middleware/userAuth");

app.use("/admin",adminAuth)
app.get("/admin/getAllData",(req, res)=>{
    res.send("All data fetched");
})

app.get("/admin/deleteUser",(req, res)=>{
    res.send("User deleted");
})

app.get("/user/getData", userAuth, (req, res)=>{
    res.send("User data fetched");
})

app.get("/user/deleteAccount", userAuth, (req, res)=>{
    res.send("User account deleted successfully");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});




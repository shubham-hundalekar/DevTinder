const express = require("express");
const app = express();

app.use("/admin", (req, res, next)=>{
    const token   = "xyzsad";
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(403).send("Access Denied");
    }else{
        next();
    }
})
app.get("/admin/getAllData",(req, res)=>{
    res.send("All data fetched");
})
app.get("/admin/deleteUser",(req, res)=>{
    res.send("User deleted");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});




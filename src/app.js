const express = require("express");
const app = express();

//Response Handler
app.get("/user",(req, res)=>{
    console.log(req.query.userId)
    console.log(req.query.name)
    res.send({FirstNaame: "Shubham", LastName: "Hundalekar"});
})
app.get("/user/:userId/:password/:name",(req, res)=>{
    console.log(req.params)
    res.send("data received through params");    
})
app.post("/user",(req, res)=>{
    res.send("Data Saved Successfully in Database");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


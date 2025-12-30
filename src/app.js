const express = require("express");
const app = express();

//Response Handler
app.use("/test",(req, res)=>{
    res.send("Hello, DevTinder!");
})

app.use("/home",(req, res)=>{
    res.send("Welcome to the Home Page!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


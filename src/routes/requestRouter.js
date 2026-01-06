
const express = require("express")
const userAuth = require("../middleware/userAuth");
const requestRouter = express.Router();

requestRouter.post("/sendConnecitionRequest",userAuth, (req, res)=>{
    const user = req.user;
    res.send(user.firstName + " sent a connection request");
})


module.exports = requestRouter;
const express = require("express")
const userRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequest");

//get all the pending connection request
userRouter.get("/user/requests/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", ["firstName", "lastName"]);
        
        res.json({
            message:"Data fetched sucessfully",
            data: connectionRequests
        })


    }catch(error){
        res.status(400).send("Error: "+error.message);
    }
})

module.exports = userRouter;
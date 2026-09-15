const express = require("express")
const userRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName age gender photourl"

//get all the pending connection request
userRouter.get("/user/requests/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        
        res.json({
            message:"Data fetched sucessfully",
            data: connectionRequests
        })


    }catch(error){
        res.status(400).send("Error: "+error.message);
    }
})


userRouter.get("/user/connections", userAuth,  async (req,res)=>{
    try{
        const loggedInUser = req.user;
        
        const connectionRequest = await ConnectionRequest.find({
            $or:[{
                    toUserId : loggedInUser._id,
                    status: "accepted"
                },
                {
                    fromUserId : loggedInUser._id,
                    status : "accepted"
                },
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row)=>{
            if(loggedInUser._id.toString() === row.fromUserId._id.toString())
                return row.toUserId;
            return row.fromUserId;
        })


        res.json({
            data
        })


    }catch(error){  
        res.status(400).send({message: error.message});
    }
})

module.exports = userRouter;
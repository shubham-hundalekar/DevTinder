
const express = require("express")
const userAuth = require("../middleware/userAuth");
const requestRouter = express.Router();
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:requestId",userAuth,async (req, res)=>{
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.requestId;
        const status = req.params.status;
        const allowedStatus = ["interested", "ignored"];

        //checks if the status is interested or ignored
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid status types: "+status);
        }

        //checks if the  toUSerId is present in Database 
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message : "User not found"})
        }

        //checks if the conn req already exists 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).json({message : "Connection request already exists"})
        }

        const connectionRequest = await new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();
        res.send(data);
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res)=>{

    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        const toUserId = loggedInUser._id;
        //conditions: 
        //loggedInUser == toUser
        //status == interested (from user status should be interested)
        //status == [accept, reject] allowed status;
        //check if connect already exists

        console.log(status)
        const allowedStatus= ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid status type: "+status,
            })
        }
        //.find() will return array and .findOne() will return single value

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId : requestId,
            toUserId : toUserId,
            status: "interested",
        });
        console.log(connectionRequest);
        console.log(requestId);
        console.log(toUserId)
        if(!connectionRequest){
            return res.status(400).json({
                message:"Connection Request not found."
            })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save()
        
        res.json({
            message: "Connection request: "+status,
            data
        })

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }

})

module.exports = requestRouter;
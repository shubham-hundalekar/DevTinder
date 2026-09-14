
const mongoose = require("mongoose");
const {Schema} = mongoose;
const connectionRequestSchema = new Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref :"User" //reference the user collection
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },

    status : {
        type: String,
        enum : {
            values:["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps:true
})
connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports=ConnectionRequest;
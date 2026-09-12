const bcrypt = require("bcrypt");
const express=  require("express")
const profileRouter = express.Router()
const validator = require("validator")
const userAuth = require("../middleware/userAuth");
const {validateProfileEdit} = require("../utils/validation")
const User = require("../models/user")
profileRouter.get("/profile/view",userAuth, async (req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send("Please LOGIN again");
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try{
        if(!validateProfileEdit(req)){
            throw new Error("Invalid fields edit Request");
        }
        const editUser = req.user;
        console.log(editUser);
        Object.keys(req.body).forEach((key)=>(editUser[key] = req.body[key]))
        console.log(editUser);
        await editUser.save();
        res.json({
            msg: `${editUser.firstName} your profile is updated successfully...`,
            data : editUser,
        });
    }catch(err){
        res.status(404).send("Error:  "+err.message );
    }
})

profileRouter.post("/profile/password", userAuth,async (req, res)=>{
    try{

        if(!validator.isStrongPassword(req.body.password)){
            throw new Error("Not a strong password")
        }
        const newPassword = await bcrypt.hash(req.body.password, 10);
        const user = req.user;
        user.password = newPassword;
        user.save()
        res.send(`${user.firstName} your password changed successfully!!!`);
    }
    catch(err){
        res.status(404).send("Error: "+err.message);
    }
})

profileRouter.get("/profile/feed",userAuth, async (req, res)=>{
    try{
        const user = await User.find();
        res.send(user);
    }catch(err){
        res.status(400).json({
            msg: err.message
        })
    }
})

module.exports = profileRouter;


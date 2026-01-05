const mongoose  = require("mongoose")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt")
const JWT_SECRET = process.env.JWT_SECRET;
const  {Schema} = mongoose
const validator = require("validator");
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength:5,
        maxLength:50
    },
    lastName :  {
        type: String
    },
    emailId:  {
        type: String,
        required: true,
        lowercase: true,        
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email "+ value)
            }
        },
    },
    password:  {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: "+value);
            }
        }

    },
    age:{
        type:Number,
        min:18,
    },
    gender:  {
        type: String,
        lowercase:true,

        // validate function works when we insert a new "Document"
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photourl : {
        type:String,
        default:"https://www.bing.com/ck/a?!&&p=e6e39f34ee0b484021c1b029bd09b5603df21a782cfcb686278a27421b5f0701JmltdHM9MTc2NzMxMjAwMA&ptn=3&ver=2&hsh=4&fclid=04873276-97ad-6608-39e0-24ce960f67f3&u=a1L2ltYWdlcy9zZWFyY2g_cT1kdW1teStwaG90byt1c2VyK2ltYWdlJmlkPUQ1NDkxQjc0NDNCOUQwRDRFMzg4MkU4NkFCNEUyQzBFNkY4OTMzRkQmRk9STT1JQUNGSVI&ntb=1",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL: "+value);
            }

        }
    },
    about: { 
        type : String,
        default: "This is about me"
    },
    skills:{
        type :[String]
        
    }
},{
    timestamps:true
});
//methods helps us to generate the token for a particular instance of User collection 
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, JWT_SECRET);

    return token;
} 

userSchema.methods.validPassword=async function(passwordByUser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
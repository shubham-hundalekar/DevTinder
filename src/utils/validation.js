const validator = require("validator")

const validateSignupData = (req)=>{
    const {firstName, password, emailId, lastName } = req.body

    if(!firstName || !lastName){
        throw new Error("Name not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Not a valid Email");
    }
 
}

function validateProfileEdit(req){
    const allowedEditFields = ["firstName", "lastName", "emailId", "photourl", "about", "age", "skills", "gender"];
    const isEditAllowed = Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
    )
    console.log(allowedEditFields);
    return isEditAllowed;

}


module.exports={
    validateSignupData,
    validateProfileEdit
}
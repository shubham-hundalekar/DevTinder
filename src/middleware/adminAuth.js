const adminAuth =  (req, res, next)=>{
    const token   = "xyz";
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(403).send("Access Denied");
    }else{
        next();
    }
}

module.exports = adminAuth;
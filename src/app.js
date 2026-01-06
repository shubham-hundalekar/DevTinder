const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRouter")
const profileRouter = require("./routes/profileRouter")
const requestRouter = require("./routes/requestRouter");
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDB().then(() => {
    console.log("Connection established successfully");
        app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err)=>{
    console.error("DB not connected");
})




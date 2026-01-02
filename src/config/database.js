const mongoose = require('mongoose');

require('dotenv').config();
const url = process.env.url;

const connectDB = async () => {
    await mongoose.connect(url+"DevTinder");
}

module.exports = connectDB;



const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGOOSE_URI;

async function connectDB() {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
}

module.exports = connectDB;
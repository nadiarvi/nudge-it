const mongoose = require("mongoose");

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("🗂️ Connected to Database");
    } catch (err) {
        console.error("Failed to connect to database:", err);
        throw err;
    }
}

module.exports = { connectDB };
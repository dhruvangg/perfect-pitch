const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    feedback: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Data", dataSchema);

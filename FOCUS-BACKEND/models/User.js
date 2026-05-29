const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        firstName: {
            type: String,
            default: "",
        },

        lastName: {
            type: String,
            default: "",
        },

        imageUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "User",
    userSchema
);
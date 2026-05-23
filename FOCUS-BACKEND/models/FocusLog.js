const mongoose = require("mongoose");

const focusLogSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudySession",
            required: true,
        },

        focusScore: {
            type: Number,
            required: true,
        },

        eyeDetected: {
            type: Boolean,
            default: false,
        },

        faceDetected: {
            type: Boolean,
            default: false,
        },

        lookingAway: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "FocusLog",
    focusLogSchema
);
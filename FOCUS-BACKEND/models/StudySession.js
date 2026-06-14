const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        startTime: {
            type: Date,
            default: Date.now,
        },

        endTime: {
            type: Date,
        },

        averageFocusScore: {
            type: Number,
            default: 0,
        },

        totalDistractions: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "StudySession",
    studySessionSchema
);
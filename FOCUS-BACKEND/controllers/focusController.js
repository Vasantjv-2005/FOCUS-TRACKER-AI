const FocusLog = require("../models/FocusLog");

const calculateFocusScore = require(
    "../utils/calculateFocusScore"
);

const saveFocusData = async (req, res) => {
    try {
        const {
            sessionId,
            eyeDetected,
            faceDetected,
            lookingAway,
        } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        const focusScore = calculateFocusScore({
            eyeDetected,
            faceDetected,
            lookingAway,
        });

        const focusLog = await FocusLog.create({
            sessionId,
            focusScore,
            eyeDetected,
            faceDetected,
            lookingAway,
        });

        res.status(201).json({
            success: true,
            message: "Focus data saved successfully",
            focusLog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    saveFocusData,
};
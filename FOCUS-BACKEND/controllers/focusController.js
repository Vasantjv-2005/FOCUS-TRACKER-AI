const FocusLog = require("../models/FocusLog");

const {
    analyzeFocus,
} = require("../services/aiService");

const saveFocusData = async (req, res) => {
    try {

        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        const aiResult = await analyzeFocus({});

        if (!aiResult) {
            return res.status(500).json({
                success: false,
                message: "AI Service Not Available",
            });
        }

        const focusLog = await FocusLog.create({
            sessionId,
            focusScore: aiResult.focusScore,
            eyeDetected: aiResult.eyeDetected,
            faceDetected: aiResult.faceDetected,
            lookingAway: aiResult.lookingAway,
        });

        res.status(201).json({
            success: true,
            message: "Focus data saved successfully",
            focusLog,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    saveFocusData,
};
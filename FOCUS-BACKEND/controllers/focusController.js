const FocusLog = require("../models/FocusLog");

const {
    analyzeFocus,
} = require("../services/aiService");

const saveFocusData = async (req, res) => {
    try {

        const {
            sessionId,
            focusScore,
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

        const aiResult = await analyzeFocus({
            focusScore,
            eyeDetected,
            faceDetected,
            lookingAway,
        });

        const resolvedFocusScore = aiResult?.focusScore ?? focusScore ?? 0;
        const resolvedEyeDetected = aiResult?.eyeDetected ?? eyeDetected ?? false;
        const resolvedFaceDetected = aiResult?.faceDetected ?? faceDetected ?? false;
        const resolvedLookingAway = aiResult?.lookingAway ?? lookingAway ?? false;

        const focusLog = await FocusLog.create({
            sessionId,
            focusScore: resolvedFocusScore,
            eyeDetected: resolvedEyeDetected,
            faceDetected: resolvedFaceDetected,
            lookingAway: resolvedLookingAway,
        });

        await focusLog.populate("sessionId");

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
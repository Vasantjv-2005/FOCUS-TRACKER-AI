const FocusLog = require("../models/FocusLog");

const getSessionReport = async (req, res) => {
    try {

        const { sessionId } = req.params;

        const logs = await FocusLog.find({
            sessionId,
        });

        const totalFocusScore = logs.reduce(
            (sum, log) => sum + log.focusScore,
            0
        );

        const averageFocusScore = logs.length > 0
            ? totalFocusScore / logs.length
            : 0;

        // Calculate distinct distraction episodes (stepped away + looked away)
        const sortedLogs = [...logs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        let distractionCount = 0;
        let wasDistracted = false;

        for (let i = 0; i < sortedLogs.length; i++) {
            const isDistractedOrMissing = sortedLogs[i].lookingAway === true || sortedLogs[i].faceDetected === false;
            if (isDistractedOrMissing) {
                if (!wasDistracted) {
                    distractionCount++;
                    wasDistracted = true;
                }
            } else {
                wasDistracted = false;
            }
        }

        res.status(200).json({
            success: true,
            averageFocusScore,
            totalRecords: logs.length,
            distractionCount,
            focusLogs: logs,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getSessionReport,
};
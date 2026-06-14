const FocusLog = require("../models/FocusLog");

const getSessionReport = async (req, res) => {
    try {

        const { sessionId } = req.params;

        const logs = await FocusLog.find({
            sessionId,
        });

        if (!logs.length) {
            return res.status(404).json({
                success: false,
                message: "No focus data found",
            });
        }

        const totalFocusScore = logs.reduce(
            (sum, log) => sum + log.focusScore,
            0
        );

        const averageFocusScore =
            totalFocusScore / logs.length;

        const distractionCount = logs.filter(
            (log) => log.lookingAway === true
        ).length;

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
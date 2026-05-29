const StudySession = require(
    "../models/StudySession"
);

const startSession = async (req, res) => {
    try {

        const userId = req.auth.userId;

        const session =
            await StudySession.create({
                userId,
            });

        res.status(201).json({
            success: true,
            message: "Study session started",
            session,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const endSession = async (req, res) => {
    try {

        const { sessionId } = req.body;

        const session =
            await StudySession.findByIdAndUpdate(
                sessionId,
                {
                    endTime: new Date(),
                },
                {
                    new: true,
                }
            );

        res.status(200).json({
            success: true,
            message: "Study session ended",
            session,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    startSession,
    endSession,
};
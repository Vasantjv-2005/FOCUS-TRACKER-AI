const StudySession = require(
    "../models/StudySession"
);
const FocusLog = require(
    "../models/FocusLog"
);

const startSession = async (req, res) => {
    try {

        const userId = req.auth?.userId || "anonymous";

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

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        // Calculate average focus and distractions
        const logs = await FocusLog.find({ sessionId });
        let averageFocusScore = 0;
        let totalDistractions = 0;

        if (logs.length > 0) {
            const sumScore = logs.reduce((sum, log) => sum + log.focusScore, 0);
            averageFocusScore = Math.round(sumScore / logs.length);
            totalDistractions = logs.filter(log => log.lookingAway === true).length;
        }

        const session =
            await StudySession.findByIdAndUpdate(
                sessionId,
                {
                    endTime: new Date(),
                    averageFocusScore,
                    totalDistractions,
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

const getAllSessions = async (req, res) => {
    try {
        const userId = req.auth?.userId || "anonymous";
        const sessions = await StudySession.find({ userId }).sort({ startTime: -1 });

        res.status(200).json({
            success: true,
            sessions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getSessionStats = async (req, res) => {
    try {
        const userId = req.auth?.userId || "anonymous";
        const sessions = await StudySession.find({ userId });

        // Calculate total sessions
        const totalSessions = sessions.length;

        // Calculate today's study duration (completed sessions only)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todaySessions = sessions.filter(s => new Date(s.startTime) >= todayStart && s.endTime);
        let todayMs = 0;
        todaySessions.forEach(s => {
            todayMs += (new Date(s.endTime).getTime() - new Date(s.startTime).getTime());
        });

        const todayMinutes = Math.floor(todayMs / (1000 * 60));
        const hours = Math.floor(todayMinutes / 60);
        const minutes = todayMinutes % 60;
        const todayStudyStr = `${hours}h ${minutes}m`;

        // Calculate all-time study duration (completed sessions only)
        let totalMs = 0;
        sessions.filter(s => s.endTime).forEach(s => {
            totalMs += (new Date(s.endTime).getTime() - new Date(s.startTime).getTime());
        });
        const totalMinutes = Math.floor(totalMs / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const totalMinsLeft = totalMinutes % 60;
        const totalStudyStr = `${totalHours}h ${totalMinsLeft}m`;

        // Calculate weekly average focus score
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklySessions = sessions.filter(s => new Date(s.startTime) >= weekAgo);
        const weeklyScores = weeklySessions.filter(s => s.averageFocusScore > 0).map(s => s.averageFocusScore);
        const weeklyAvgScore = weeklyScores.length > 0 
            ? Math.round(weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length) 
            : 0;

        // Last session's focus score or current live focus
        const lastSession = sessions[sessions.length - 1];
        let currentFocus = 0;
        if (lastSession) {
            currentFocus = lastSession.averageFocusScore || 0;
        }

        // Get distraction stats from last session or overall
        let lookingAwayCount = 0;
        let attentionDrops = 0;
        if (lastSession) {
            const logs = await FocusLog.find({ sessionId: lastSession._id });
            lookingAwayCount = logs.filter(l => l.lookingAway).length;
            attentionDrops = logs.filter(l => l.focusScore < 60).length;
        }

        res.status(200).json({
            success: true,
            stats: {
                currentFocus,
                todayStudy: todayStudyStr,
                totalStudy: totalStudyStr,
                todayStudyMinutes: todayMinutes,
                totalStudyMinutes: totalMinutes,
                weeklyAvg: weeklyAvgScore,
                totalSessions,
                distractions: {
                    lookingAway: lookingAwayCount,
                    attentionDrops,
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAnalyticsData = async (req, res) => {
    try {
        const userId = req.auth?.userId || "anonymous";
        const sessions = await StudySession.find({ userId });

        // 1. Daily trend (last 14 days)
        const daily = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(d);
            nextDay.setDate(nextDay.getDate() + 1);

            const daySessions = sessions.filter(s => {
                const date = new Date(s.startTime);
                return date >= d && date < nextDay;
            });

            const scores = daySessions.filter(s => s.averageFocusScore > 0).map(s => s.averageFocusScore);
            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
            
            daily.push({
                day: `D${14 - i}`,
                score: avgScore,
            });
        }

        // 2. Weekly performance (last 5 weeks)
        const weekly = [];
        for (let i = 4; i >= 0; i--) {
            const start = new Date();
            start.setDate(start.getDate() - (i * 7 + 7));
            const end = new Date();
            end.setDate(end.getDate() - (i * 7));

            const weekSessions = sessions.filter(s => {
                const date = new Date(s.startTime);
                return date >= start && date < end;
            });

            const scores = weekSessions.filter(s => s.averageFocusScore > 0).map(s => s.averageFocusScore);
            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

            weekly.push({
                w: `W${5 - i}`,
                score: avgScore,
            });
        }

        // 3. Monthly improvement (last 6 months)
        const monthly = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthIndex = d.getMonth();
            const year = d.getFullYear();

            const monthSessions = sessions.filter(s => {
                const date = new Date(s.startTime);
                return date.getMonth() === monthIndex && date.getFullYear() === year;
            });

            const scores = monthSessions.filter(s => s.averageFocusScore > 0).map(s => s.averageFocusScore);
            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

            monthly.push({
                m: monthNames[monthIndex],
                score: avgScore,
            });
        }

        // 4. Study time distribution based on session focus
        let deepWorkCount = 0;
        let practiceCount = 0;
        let reviewCount = 0;
        let breaksCount = 0;

        sessions.forEach(s => {
            if (s.averageFocusScore >= 85) deepWorkCount++;
            else if (s.averageFocusScore >= 70) practiceCount++;
            else if (s.averageFocusScore >= 50) reviewCount++;
            else breaksCount++;
        });

        const totalDistrib = deepWorkCount + practiceCount + reviewCount + breaksCount;
        const distribution = [
            { name: "Deep work", value: totalDistrib > 0 ? Math.round((deepWorkCount / totalDistrib) * 100) : 0, color: "#00A86B" },
            { name: "Review", value: totalDistrib > 0 ? Math.round((reviewCount / totalDistrib) * 100) : 0, color: "#D4AF37" },
            { name: "Practice", value: totalDistrib > 0 ? Math.round((practiceCount / totalDistrib) * 100) : 0, color: "#00695C" },
            { name: "Breaks", value: totalDistrib > 0 ? Math.round((breaksCount / totalDistrib) * 100) : 0, color: "#B87333" },
        ];

        res.status(200).json({
            success: true,
            daily,
            weekly,
            monthly,
            distribution,
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
    getAllSessions,
    getSessionStats,
    getAnalyticsData,
};
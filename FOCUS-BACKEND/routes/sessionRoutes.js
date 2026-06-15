const express = require("express");

const router = express.Router();

const {
    startSession,
    endSession,
    getAllSessions,
    getSessionStats,
    getAnalyticsData,
} = require("../controllers/sessionController");

router.post("/start", startSession);

router.post("/end", endSession);

router.get("/all", getAllSessions);

router.get("/stats", getSessionStats);

router.get("/analytics", getAnalyticsData);

module.exports = router;
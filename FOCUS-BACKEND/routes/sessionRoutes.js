const express = require("express");

const router = express.Router();

const {
    requireAuth,
} = require("@clerk/express");

const {
    startSession,
    endSession,
} = require("../controllers/sessionController");

router.post(
    "/start",
    requireAuth(),
    startSession
);

router.post(
    "/end",
    requireAuth(),
    endSession
);

module.exports = router;
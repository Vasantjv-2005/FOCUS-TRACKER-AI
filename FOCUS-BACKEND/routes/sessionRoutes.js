const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    startSession,
    endSession,
} = require("../controllers/sessionController");

router.post(
    "/start",
    authMiddleware,
    startSession
);

router.post(
    "/end",
    authMiddleware,
    endSession
);

module.exports = router;
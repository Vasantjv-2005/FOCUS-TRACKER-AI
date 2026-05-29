const express = require("express");

const router = express.Router();

const {
    getSessionReport,
} = require("../controllers/reportController");

router.get(
    "/:sessionId",
    getSessionReport
);

module.exports = router;
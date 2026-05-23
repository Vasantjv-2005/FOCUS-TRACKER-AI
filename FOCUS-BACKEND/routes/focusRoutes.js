const express = require("express");

const router = express.Router();

const {
    requireAuth,
} = require("@clerk/express");

const {
    saveFocusData,
} = require("../controllers/focusController");

router.post(
    "/save",
    requireAuth(),
    saveFocusData
);

module.exports = router;
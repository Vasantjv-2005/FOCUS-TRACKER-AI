const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    saveFocusData,
} = require("../controllers/focusController");

router.post(
    "/save",
    authMiddleware,
    saveFocusData
);

module.exports = router;
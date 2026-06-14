const express = require("express");

const router = express.Router();

const {
    saveFocusData,
} = require("../controllers/focusController");

router.post("/save", saveFocusData);

module.exports = router;
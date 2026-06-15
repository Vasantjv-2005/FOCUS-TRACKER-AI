require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    clerkMiddleware,
} = require("@clerk/express");

const connectDB = require("./config/db");

// ===============================
// ROUTES IMPORTS
// ===============================

const sessionRoutes = require(
    "./routes/sessionRoutes"
);

const focusRoutes = require(
    "./routes/focusRoutes"
);

const webhookRoutes = require(
    "./routes/webhookRoutes"
);

const reportRoutes = require(
    "./routes/reportRoutes"
);

// ===============================
// APP INITIALIZATION
// ===============================

const app = express();

// ===============================
// DATABASE CONNECTION
// ===============================

connectDB();

// ===============================
// MIDDLEWARES
// ===============================

app.use(cors());

// IMPORTANT:
// Clerk webhook needs raw body
app.use(
    "/api/webhooks",
    express.raw({
        type: "application/json",
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// ===============================
// CLERK MIDDLEWARE
// ===============================

app.use(clerkMiddleware());

app.use((req, res, next) => {
    console.log(`\n🔑 [DEBUG] Path: ${req.path} | Method: ${req.method}`);
    console.log(`🔑 [DEBUG] Auth Header: ${req.headers.authorization ? "Present" : "Missing"}`);
    console.log(`🔑 [DEBUG] Clerk Auth Claims userId: ${req.auth?.userId || "undefined"}`);
    next();
});

// ===============================
// HEALTH CHECK ROUTE
// ===============================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message:
            "FocusTrack AI Backend Running Successfully",
    });

});

// ===============================
// API ROUTES
// ===============================

app.use(
    "/api/session",
    sessionRoutes
);

app.use(
    "/api/focus",
    focusRoutes
);

app.use(
    "/api/report",
    reportRoutes
);

app.use(
    "/api/webhooks",
    webhookRoutes
);

// ===============================
// 404 ROUTE HANDLER
// ===============================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });

});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        success: false,
        message:
            "Internal Server Error",
    });

});

// ===============================
// SERVER LISTEN
// ===============================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server running on port ${PORT}`
    );

});
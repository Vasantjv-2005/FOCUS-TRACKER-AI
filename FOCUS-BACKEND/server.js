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

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));


// ===============================
// CLERK MIDDLEWARE
// ===============================

app.use(clerkMiddleware());


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

    console.log(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });

});


// ===============================
// SERVER LISTEN
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server running on port ${PORT}`
    );

});
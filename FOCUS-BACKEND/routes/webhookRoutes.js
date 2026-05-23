const express = require("express");

const router = express.Router();

const {
    sendWelcomeEmail,
} = require("../services/emailService");


router.post("/clerk", async (req, res) => {

    try {

        const event = req.body;

        if (
            event.type === "user.created"
        ) {

            const email =
                event.data.email_addresses[0]
                    .email_address;

            const firstName =
                event.data.first_name || "User";

            await sendWelcomeEmail(
                email,
                firstName
            );

        }

        res.status(200).json({
            success: true,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message:
                "Webhook processing failed",
        });

    }

});


module.exports = router;
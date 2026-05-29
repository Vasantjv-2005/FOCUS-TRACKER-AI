const express = require("express");
const { Webhook } = require("svix");

const User = require("../models/User");

const {
    sendWelcomeEmail,
} = require("../services/emailService");

const router = express.Router();

router.post(
    "/clerk",
    async (req, res) => {
        try {

            const WEBHOOK_SECRET =
                process.env.CLERK_WEBHOOK_SECRET;

            if (!WEBHOOK_SECRET) {
                throw new Error(
                    "Missing CLERK_WEBHOOK_SECRET"
                );
            }

            const headers = {
                "svix-id":
                    req.headers["svix-id"],

                "svix-timestamp":
                    req.headers["svix-timestamp"],

                "svix-signature":
                    req.headers["svix-signature"],
            };

            const wh = new Webhook(
                WEBHOOK_SECRET
            );

            const payload =
                req.body.toString();

            const event =
                wh.verify(
                    payload,
                    headers
                );

            console.log(
                "Webhook Event:",
                event.type
            );

            // =====================
            // USER CREATED
            // =====================

            if (
                event.type ===
                "user.created"
            ) {

                const userData =
                    event.data;

                console.log(
                    "User Created Payload:",
                    JSON.stringify(
                        userData,
                        null,
                        2
                    )
                );

                const email =
                    userData
                        .email_addresses?.[0]
                        ?.email_address || "";

                if (!email) {

                    console.log(
                        "No email found in webhook payload. Skipping user creation."
                    );

                    return res
                        .status(200)
                        .json({
                            success: true,
                            message:
                                "No email found in webhook payload",
                        });
                }

                const existingUser =
                    await User.findOne({
                        clerkId:
                            userData.id,
                    });

                if (!existingUser) {

                    await User.create({
                        clerkId:
                            userData.id,

                        email,

                        firstName:
                            userData.first_name ||
                            "",

                        lastName:
                            userData.last_name ||
                            "",

                        imageUrl:
                            userData.image_url ||
                            "",
                    });

                    await sendWelcomeEmail(
                        email,
                        userData.first_name ||
                            "User"
                    );

                    console.log(
                        "User saved successfully"
                    );
                }
            }

            // =====================
            // USER UPDATED
            // =====================

            if (
                event.type ===
                "user.updated"
            ) {

                const userData =
                    event.data;

                const email =
                    userData
                        .email_addresses?.[0]
                        ?.email_address || "";

                await User.findOneAndUpdate(
                    {
                        clerkId:
                            userData.id,
                    },
                    {
                        email,

                        firstName:
                            userData.first_name ||
                            "",

                        lastName:
                            userData.last_name ||
                            "",

                        imageUrl:
                            userData.image_url ||
                            "",
                    },
                    {
                        new: true,
                    }
                );

                console.log(
                    "User updated successfully"
                );
            }

            // =====================
            // USER DELETED
            // =====================

            if (
                event.type ===
                "user.deleted"
            ) {

                await User.findOneAndDelete(
                    {
                        clerkId:
                            event.data.id,
                    }
                );

                console.log(
                    "User deleted successfully"
                );
            }

            return res.status(200).json({
                success: true,
            });

        } catch (error) {

            console.error(
                "Webhook Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message,
            });

        }
    }
);

module.exports = router;
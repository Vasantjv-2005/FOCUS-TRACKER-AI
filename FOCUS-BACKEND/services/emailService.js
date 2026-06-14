const { Resend } = require("resend");

const resend = new Resend(
    process.env.RESEND_API_KEY
);

const sendWelcomeEmail = async (
    email,
    name
) => {
    try {

        await resend.emails.send({
            from: "FocusTrack AI <onboarding@resend.dev>",
            to: email,
            subject: "Welcome to FocusTrack AI 🚀",

            html: `
        <h1>Welcome ${name}</h1>

        <p>
          Your FocusTrack AI account
          has been created successfully.
        </p>
      `,
        });

        console.log("Email Sent");

    } catch (error) {

        console.log(error);

    }
};

module.exports = {
    sendWelcomeEmail,
};
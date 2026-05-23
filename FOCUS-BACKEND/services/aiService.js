const axios = require("axios");

const analyzeFocus = async (data) => {
    try {
        const response = await axios.post(
            `${process.env.PYTHON_AI_URL}/analyze`,
            data
        );

        return response.data;
    } catch (error) {
        console.log("AI Service Error");

        console.log(error.message);

        return {
            success: false,
            message: "AI Service Failed",
        };
    }
};

module.exports = {
    analyzeFocus,
};
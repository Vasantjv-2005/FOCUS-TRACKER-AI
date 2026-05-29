const axios = require("axios");

const analyzeFocus = async (data) => {
    try {

        const response = await axios.post(
            `${process.env.PYTHON_AI_URL}/analyze`,
            data
        );

        return response.data;

    } catch (error) {

        console.error(
            "AI Service Error:",
            error.message
        );

        return null;
    }
};

module.exports = {
    analyzeFocus,
};
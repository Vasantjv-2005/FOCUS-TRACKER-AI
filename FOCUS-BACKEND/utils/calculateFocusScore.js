const calculateFocusScore = ({
    faceDetected,
    eyeDetected,
    lookingAway,
}) => {
    let score = 100;

    if (!faceDetected) {
        score -= 40;
    }

    if (!eyeDetected) {
        score -= 30;
    }

    if (lookingAway) {
        score -= 20;
    }

    if (score < 0) {
        score = 0;
    }

    return score;
};

module.exports = calculateFocusScore;
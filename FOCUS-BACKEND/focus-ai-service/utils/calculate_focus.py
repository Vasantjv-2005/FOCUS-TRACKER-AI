def calculate_focus_score(
    eye_detected,
    face_detected,
    looking_away
):
    score = 100

    if not face_detected:
        score -= 50

    if not eye_detected:
        score -= 30

    if looking_away:
        score -= 20

    return max(score, 0)
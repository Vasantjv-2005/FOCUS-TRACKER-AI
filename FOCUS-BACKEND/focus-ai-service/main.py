from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class FocusData(BaseModel):
    focusScore: float
    eyeDetected: bool
    faceDetected: bool
    lookingAway: bool

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Focus AI Service Running"
    }

@app.post("/analyze")
def analyze(data: FocusData):
    # Process the real focus score and detection status sent from the client
    score = data.focusScore
    
    # Apply heuristics if eyes/face are not detected or looking away
    if not data.eyeDetected or not data.faceDetected:
        score = max(0.0, min(score, 30.0))
    elif data.lookingAway:
        score = max(0.0, min(score, 50.0))

    return {
        "focusScore": round(score),
        "eyeDetected": data.eyeDetected,
        "faceDetected": data.faceDetected,
        "lookingAway": data.lookingAway
    }
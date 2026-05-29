from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Focus AI Service Running"
    }

@app.post("/analyze")
def analyze():
    return {
        "focusScore": 100,
        "eyeDetected": True,
        "faceDetected": True,
        "lookingAway": False
    }
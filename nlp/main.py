from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict

app = FastAPI(title="Ava NLP service")

class PredictIn(BaseModel):
    text: str

class PredictOut(BaseModel):
    intent: str
    entities: Dict[str,str]
    reply: str

@app.post("/predict", response_model=PredictOut)
def predict(payload: PredictIn):
    text = payload.text.lower()
    # simple rule-based intent detection (placeholder)
    if "remind" in text or "reminder" in text:
        intent = "create_reminder"
        reply = "When should I remind you?"
    elif "note" in text or "remember" in text:
        intent = "create_note"
        reply = "What would you like to note?"
    elif "hello" in text or "hi" in text:
        intent = "greeting"
        reply = "Hi — how can I help?"
    else:
        intent = "chit_chat"
        reply = "Tell me more — what would you like to do?"
    return PredictOut(intent=intent, entities={}, reply=reply)

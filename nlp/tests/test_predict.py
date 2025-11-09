from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_predict_reminder():
    r = client.post("/predict", json={"text":"Remind me tomorrow to call mom"})
    assert r.status_code == 200
    j = r.json()
    assert "remind" in j["intent"] or j["intent"] == "create_reminder"

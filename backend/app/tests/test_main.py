from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "VivaMate" in data["app"]

def test_start_session():
    payload = {
        "subject": "Machine Learning",
        "difficulty": "Medium"
    }
    response = client.post("/api/session/start", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "session_id" in data
    assert data["subject"] == "Machine Learning"
    assert data["initial_question"]["question_number"] == 1

def test_full_session_flow():
    # 1. Start session
    start_res = client.post("/api/session/start", json={
        "subject": "DBMS",
        "difficulty": "Easy"
    })
    assert start_res.status_code == 201
    session_id = start_res.json()["session_id"]
    q_id = start_res.json()["initial_question"]["id"]

    # 2. Submit answer
    ans_res = client.post("/api/session/answer", json={
        "session_id": session_id,
        "question_id": q_id,
        "answer_text": "ACID stands for Atomicity, Consistency, Isolation, and Durability."
    })
    assert ans_res.status_code == 200
    ans_data = ans_res.json()
    assert ans_data["evaluation"]["score"] >= 6
    assert ans_data["next_question"] is not None

    # 3. Get Session Detail
    detail_res = client.get(f"/api/session/{session_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["questions_answered"] == 1

    # 4. End Session
    end_res = client.post("/api/session/end", json={"session_id": session_id})
    assert end_res.status_code == 200
    res_data = end_res.json()
    assert res_data["overall_score"] > 0
    assert len(res_data["evaluations"]) == 1

    # 5. Get Session Result
    result_res = client.get(f"/api/session/{session_id}/result")
    assert result_res.status_code == 200
    assert result_res.json()["subject"] == "DBMS"

def test_invalid_session_id():
    response = client.get("/api/session/invalid_id_999")
    assert response.status_code == 404

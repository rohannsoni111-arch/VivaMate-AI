from app.services.ai_examiner_service import AIExaminerService

def test_ai_examiner_evaluation():
    subject = "Machine Learning"
    difficulty = "Medium"
    question = "What is overfitting?"
    answer = "Overfitting happens when a model performs very well on training data but poorly on unseen test data because of high variance."
    history = []

    result = AIExaminerService.evaluate_student_answer(
        subject=subject,
        difficulty=difficulty,
        question_text=question,
        student_answer=answer,
        session_history=history
    )

    assert "score" in result
    assert result["score"] >= 1 and result["score"] <= 10
    assert "feedback" in result
    assert "missing_concepts" in result
    assert "follow_up_question" in result
    assert result["difficulty_adjustment"] in ["easier", "same", "harder"]

def test_ai_examiner_final_report():
    subject = "DBMS"
    difficulty = "Hard"
    evaluations = [
        {"score": 8, "feedback": "Great definition", "missing_concepts": []},
        {"score": 9, "feedback": "Excellent trade-off analysis", "missing_concepts": []}
    ]

    report = AIExaminerService.generate_final_report(subject, difficulty, evaluations)

    assert report["overall_score"] == 8.5
    assert report["overall_performance"] == "Outstanding"
    assert len(report["strengths"]) > 0
    assert len(report["topics_to_revise"]) > 0

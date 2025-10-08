import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Interview.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const Interview = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [result, setResult] = useState(null);

  // Fetch interview data
  useEffect(() => {
    fetchInterview();
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (!interview || !interview.deadline) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(interview.deadline).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeRemaining('EXPIRED');
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [interview]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/interview/${token}`);
      const data = await response.json();

      if (!response.ok) {
        if (data.expired) {
          toast.error('Interview deadline has passed');
          setResult({
            expired: true,
            message: data.message
          });
        } else if (data.data && data.data.status === 'completed') {
          setResult({
            completed: true,
            overallScore: data.data.overallScore,
            passed: data.data.passed,
            message: data.message
          });
        } else {
          throw new Error(data.message || 'Failed to load interview');
        }
        setLoading(false);
        return;
      }

      setInterview(data.data);
      console.log('Interview loaded:', data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview:', error);
      toast.error(error.message || 'Failed to load interview');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionNumber, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all 5 questions answered
    const answersArray = Object.entries(answers).map(([questionNumber, answer]) => ({
      questionNumber: parseInt(questionNumber),
      answer: answer.trim()
    })).filter(a => a.answer.length > 0);

    if (answersArray.length < 5) {
      toast.error('Please answer all 5 questions to submit');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/interview/${token}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: answersArray })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit interview');
      }

      toast.success(data.message);
      setResult({
        completed: true,
        overallScore: data.data.overallScore,
        totalAnswered: data.data.totalAnswered,
        passed: data.data.passed,
        aiSummary: data.data.aiSummary,
        detailedScores: data.data.detailedScores
      });

    } catch (error) {
      console.error('Error submitting interview:', error);
      toast.error(error.message || 'Failed to submit interview');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="interview-container">
        <div className="interview-loading">
          <div className="spinner"></div>
          <p>Loading interview...</p>
        </div>
      </div>
    );
  }

  // Result screen (completed or expired)
  if (result) {
    return (
      <div className="interview-container">
        <div className="interview-result-card">
          {result.expired ? (
            <>
              <div className="result-icon expired">⏰</div>
              <h2>Interview Expired</h2>
              <p>{result.message}</p>
            </>
          ) : result.completed ? (
            <>
              <div className={`result-icon ${result.passed ? 'passed' : 'failed'}`}>
                {result.passed ? '✅' : '❌'}
              </div>
              <h2>{result.passed ? 'Interview Completed!' : 'Interview Completed'}</h2>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-value">{result.overallScore}%</span>
                  <span className="score-label">Overall Score</span>
                </div>
              </div>
              {result.aiSummary && (
                <div className="ai-summary">
                  <p>{result.aiSummary}</p>
                </div>
              )}
              {result.passed ? (
                <p className="result-message success">
                  🎉 Congratulations! You've passed the pre-screening interview. 
                  Our recruitment team will review your application and contact you soon.
                </p>
              ) : (
                <p className="result-message">
                  Thank you for completing the interview. Unfortunately, you did not meet 
                  the minimum requirements at this time.
                </p>
              )}
              {result.detailedScores && result.detailedScores.length > 0 && (
                <div className="detailed-scores">
                  <h3>Question Scores:</h3>
                  {result.detailedScores.map(score => (
                    <div key={score.questionNumber} className="question-score">
                      <span className="q-number">Q{score.questionNumber}</span>
                      <span className="q-score">{score.score}/10</span>
                      <span className="q-feedback">{score.feedback}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    );
  }

  // Interview not loaded
  if (!interview) {
    return (
      <div className="interview-container">
        <div className="interview-error">
          <h2>Interview Not Found</h2>
          <p>The interview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.values(answers).filter(a => a && a.trim().length > 0).length;

  // Main interview screen
  return (
    <div className="interview-container">
      <div className="interview-header">
        <div className="interview-header-content">
          <h1>🎯 Pre-Screening Interview</h1>
          <div className="interview-info">
            <p><strong>Candidate:</strong> {interview.candidateName}</p>
            <p><strong>Position:</strong> {interview.job.title}</p>
            <p><strong>Company:</strong> {interview.job.company}</p>
          </div>
        </div>
        
        {timeRemaining && timeRemaining !== 'EXPIRED' && (
          <div className="countdown-timer">
            <div className="timer-label">Time Remaining:</div>
            <div className="timer-display">
              {timeRemaining.days > 0 && (
                <div className="timer-unit">
                  <span className="timer-value">{timeRemaining.days}</span>
                  <span className="timer-text">Days</span>
                </div>
              )}
              <div className="timer-unit">
                <span className="timer-value">{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className="timer-text">Hours</span>
              </div>
              <div className="timer-unit">
                <span className="timer-value">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className="timer-text">Mins</span>
              </div>
              <div className="timer-unit">
                <span className="timer-value">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                <span className="timer-text">Secs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="interview-instructions">
        <h3>📝 Instructions:</h3>
        <ul>
          <li>Answer <strong>all 5 questions</strong> (multiple choice)</li>
          <li>You need <strong>at least 3 correct answers</strong> to pass</li>
          <li>Select the best option for each question</li>
          <li><strong>One-time submission only</strong> - review before submitting</li>
        </ul>
        <div className="progress-indicator">
          <strong>Progress:</strong> {answeredCount} / {interview.interview.questions.length} questions answered
          {answeredCount === 5 ? ' ✅ Ready to submit!' : ' (Need ' + (5 - answeredCount) + ' more)'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="interview-form">
        {interview.interview.questions.map((question, index) => (
          <div key={question.questionNumber} className="question-card">
            <div className="question-header">
              <span className="question-number">Question {question.questionNumber}</span>
              <span className={`question-difficulty ${question.difficulty}`}>
                {question.difficulty.toUpperCase()}
              </span>
              <span className="question-type">{question.questionType}</span>
            </div>
            
            <div className="question-text">
              {question.questionText}
            </div>

            {question.questionType === 'multiple-choice' ? (
              <div className="multiple-choice-options">
                {question.options.map((option, i) => (
                  <label key={i} className="radio-option">
                    <input
                      type="radio"
                      name={`question-${question.questionNumber}`}
                      value={option}
                      checked={answers[question.questionNumber] === option}
                      onChange={(e) => handleAnswerChange(question.questionNumber, e.target.value)}
                    />
                    <span className="radio-label">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="answer-textarea"
                placeholder="Type your answer here... (Max 200 words)"
                value={answers[question.questionNumber] || ''}
                onChange={(e) => handleAnswerChange(question.questionNumber, e.target.value)}
                rows={6}
              />
            )}
          </div>
        ))}

        <div className="interview-actions">
          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={submitting || answeredCount < 5}
          >
            {submitting ? '📤 Submitting...' : '📤 Submit Interview'}
          </button>
          <p className="submit-note">
            {answeredCount < 5 && (
              <span className="warning">⚠️ Answer all 5 questions to submit</span>
            )}
            {answeredCount === 5 && (
              <span className="success">✅ Ready to submit!</span>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default Interview;


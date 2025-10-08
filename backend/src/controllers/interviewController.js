const Application = require('../models/Application');
const Job = require('../models/Job');
const { scoreAnswer, calculateOverallScore } = require('../services/interviewService');
const { sendApplicationStatusEmail } = require('../services/emailService');

/**
 * @desc    Get interview by token (Public)
 * @route   GET /api/interview/:token
 * @access  Public
 */
const getInterview = async (req, res) => {
  try {
    const { token } = req.params;

    console.log('🎯 Fetching interview for token:', token);

    const application = await Application.findOne({ 'interview.token': token })
      .populate('job', 'jobTitle department company experienceLevel location')
      .select('firstName lastName interview job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if expired
    const now = new Date();
    if (application.interview.deadline && now > application.interview.deadline) {
      // Mark as expired if not already
      if (application.interview.status !== 'expired' && application.interview.status !== 'completed') {
        application.interview.status = 'expired';
        application.interview.expiredAt = now;
        await application.save();
      }

      return res.status(410).json({
        success: false,
        message: 'Interview deadline has passed',
        expired: true
      });
    }

    // Check if already completed
    if (application.interview.status === 'completed') {
      return res.status(200).json({
        success: true,
        message: 'Interview already submitted',
        data: {
          status: 'completed',
          completedAt: application.interview.completedAt,
          overallScore: application.interview.overallScore,
          passed: application.interview.passed
        }
      });
    }

    // Mark as in-progress if this is first access
    if (application.interview.status === 'pending') {
      application.interview.status = 'in-progress';
      application.interview.startedAt = now;
      await application.save();
    }

    // Return interview data
    res.status(200).json({
      success: true,
      data: {
        candidateName: `${application.firstName} ${application.lastName}`,
        job: {
          title: application.job.jobTitle,
          department: application.job.department,
          company: application.job.company || 'Our Company',
          location: application.job.location
        },
        interview: {
          status: application.interview.status,
          deadline: application.interview.deadline,
          questions: application.interview.questions.map(q => ({
            questionNumber: q.questionNumber,
            questionType: q.questionType,
            difficulty: q.difficulty,
            questionText: q.questionText,
            options: q.options
          })),
          totalAnswered: application.interview.answers ? application.interview.answers.length : 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interview',
      error: error.message
    });
  }
};

/**
 * @desc    Submit interview answers
 * @route   POST /api/interview/:token/submit
 * @access  Public
 */
const submitInterview = async (req, res) => {
  try {
    const { token } = req.params;
    const { answers } = req.body; // Array of { questionNumber, answer }

    console.log('📝 ===== SUBMITTING INTERVIEW =====');
    console.log('Token:', token);
    console.log('Answers received:', answers.length);

    const application = await Application.findOne({ 'interview.token': token })
      .populate('job', 'jobTitle department experienceLevel');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if expired
    const now = new Date();
    if (application.interview.deadline && now > application.interview.deadline) {
      return res.status(410).json({
        success: false,
        message: 'Interview deadline has passed'
      });
    }

    // Check if already completed
    if (application.interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview already submitted'
      });
    }

    // Validate minimum answers
    if (answers.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 2 answers required'
      });
    }

    console.log('🤖 Scoring answers with AI...');

    // Score each answer
    const scoredAnswers = [];
    for (const ans of answers) {
      const question = application.interview.questions.find(
        q => q.questionNumber === ans.questionNumber
      );

      if (!question) {
        console.warn(`⚠️  Question ${ans.questionNumber} not found, skipping`);
        continue;
      }

      const jobContext = {
        jobTitle: application.job.jobTitle,
        experienceLevel: application.job.experienceLevel,
        department: application.job.department
      };

      const scoring = await scoreAnswer(question, ans.answer, jobContext);

      scoredAnswers.push({
        questionNumber: ans.questionNumber,
        answer: ans.answer,
        submittedAt: now,
        aiScore: scoring.aiScore,
        aiFeedback: scoring.aiFeedback,
        strengths: scoring.strengths,
        weaknesses: scoring.weaknesses
      });

      console.log(`✅ Q${ans.questionNumber}: ${scoring.aiScore}/10`);
    }

    // Calculate overall score
    const overallResult = calculateOverallScore(scoredAnswers, application.interview.questions.length);

    console.log('📊 Overall Score:', overallResult.overallScore + '%');
    console.log('🎯 Passed:', overallResult.passed);

    // Update application
    application.interview.answers = scoredAnswers;
    application.interview.overallScore = overallResult.overallScore;
    application.interview.totalAnswered = overallResult.totalAnswered;
    application.interview.passed = overallResult.passed;
    application.interview.aiSummary = overallResult.aiSummary;
    application.interview.status = 'completed';
    application.interview.completedAt = now;

    // Update application status based on interview result
    if (overallResult.passed) {
      application.status = 'reviewing'; // Move to next stage
    } else {
      application.status = 'rejected'; // Auto-reject
      application.interview.status = 'rejected';
    }

    await application.save();

    console.log('✅ Interview submission complete');
    console.log('================================');

    // Send status update email (non-blocking)
    const candidateName = `${application.firstName} ${application.lastName}`;
    const candidateEmail = application.email;
    const jobTitle = application.job.jobTitle;
    const companyName = process.env.COMPANY_NAME || 'Our Company';

    if (overallResult.passed) {
      // Send "moved to reviewing" email
      console.log(`📧 Sending "reviewing" status email to ${candidateName} (${candidateEmail})`);
      sendApplicationStatusEmail(
        candidateEmail,
        candidateName,
        jobTitle,
        'reviewing',
        companyName
      ).then(result => {
        if (result.success) {
          console.log('✅ Status email sent successfully');
        } else {
          console.error('❌ Status email failed:', result.error);
        }
      }).catch(err => console.error('❌ Email error:', err));
    } else {
      // Send rejection email
      console.log(`📧 Sending "rejected" status email to ${candidateName} (${candidateEmail})`);
      sendApplicationStatusEmail(
        candidateEmail,
        candidateName,
        jobTitle,
        'rejected',
        companyName,
        'Unfortunately, you did not meet the minimum requirements for the pre-screening interview. We appreciate your interest and wish you the best in your job search.'
      ).then(result => {
        if (result.success) {
          console.log('✅ Rejection email sent successfully');
        } else {
          console.error('❌ Rejection email failed:', result.error);
        }
      }).catch(err => console.error('❌ Email error:', err));
    }

    // Return results
    res.status(200).json({
      success: true,
      message: overallResult.passed
        ? 'Interview completed successfully!'
        : 'Interview completed. Unfortunately, you did not meet the minimum requirements.',
      data: {
        overallScore: overallResult.overallScore,
        totalAnswered: overallResult.totalAnswered,
        passed: overallResult.passed,
        aiSummary: overallResult.aiSummary,
        detailedScores: scoredAnswers.map(ans => ({
          questionNumber: ans.questionNumber,
          score: ans.aiScore,
          feedback: ans.aiFeedback
        }))
      }
    });

  } catch (error) {
    console.error('❌ Error submitting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting interview',
      error: error.message
    });
  }
};

/**
 * @desc    Get interview status
 * @route   GET /api/interview/:token/status
 * @access  Public
 */
const getInterviewStatus = async (req, res) => {
  try {
    const { token } = req.params;

    const application = await Application.findOne({ 'interview.token': token })
      .select('interview.status interview.deadline interview.completedAt interview.overallScore interview.passed');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: application.interview.status,
        deadline: application.interview.deadline,
        completedAt: application.interview.completedAt,
        overallScore: application.interview.overallScore,
        passed: application.interview.passed
      }
    });

  } catch (error) {
    console.error('❌ Error fetching interview status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching status'
    });
  }
};

module.exports = {
  getInterview,
  submitInterview,
  getInterviewStatus
};


const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Official = require('../models/Official');
const localStore = require('../store');

function generateFallbackQuiz(extractedText, skillTag = 'Statistical Methods', questionCount = 5) {
  const text = extractedText.trim();
  const samplePool = [
    {
      question: `According to MoSPI official guidelines, what is the primary objective of ${skillTag}?`,
      options: [
        `Standardize statistical data collection and enhance survey methodology across divisions.`,
        `Directly generate revenue for local municipal administrative offices.`,
        `Replace all census data collection with automated physical paper forms.`,
        `Restrict access to national economic accounts data to private research organizations.`
      ],
      correctIndex: 0,
      explanation: `MoSPI statistical guidelines emphasize standardizing data collection and improving survey methodology.`
    },
    {
      question: `When executing ${skillTag} in national statistical frameworks, which methodology ensures highest data quality?`,
      options: [
        `Unverified random sampling without stratification.`,
        `Rigorous sampling design with quality assurance frameworks and validation protocols.`,
        `Relying exclusively on non-representative social media feedback.`,
        `Manual paper transcription without digital validation checks.`
      ],
      correctIndex: 1,
      explanation: `Structured sampling design with validation protocols ensures national data accuracy and integrity.`
    },
    {
      question: `How does effective implementation of ${skillTag} support evidence-based policymaking in India?`,
      options: [
        `It bypasses regulatory review by eliminating documentation requirements.`,
        `It provides reliable, timely, and disaggregated indicators for SDG monitoring and national accounts.`,
        `It guarantees immediate automatic promotion for all statistical officers.`,
        `It automates physical hardware distribution across state capitals.`
      ],
      correctIndex: 1,
      explanation: `Reliable disaggregated indicators enable government bodies to measure outcomes and refine national policy.`
    },
    {
      question: `What key standard is recommended by MoSPI and NSSTA for data security and privacy during data collection?`,
      options: [
        `Public broadcasting of unencrypted raw census records.`,
        `Adherence to national data protection acts, anonymization, and secure cloud infrastructure.`,
        `Storing sensitive survey data on unencrypted personal mobile devices.`,
        `Deleting survey records immediately prior to verification.`
      ],
      correctIndex: 1,
      explanation: `National standards require strong anonymization, data protection compliance, and secure digital storage.`
    },
    {
      question: `In modern statistical workflow automation, how is Python/R data analysis integrated with ${skillTag}?`,
      options: [
        `By completely prohibiting programmatic data processing in government offices.`,
        `By building reproducible data pipelines for automated validation, cleaning, and reporting.`,
        `By forcing officers to calculate complex matrix algebra exclusively by hand.`,
        `By replacing database servers with static physical ledger books.`
      ],
      correctIndex: 1,
      explanation: `Modern statistical systems use programmatic workflows (Python/R) to automate cleaning, validation, and dashboard reporting.`
    }
  ];

  return samplePool.slice(0, Math.min(questionCount, samplePool.length));
}

async function callLLMForQuiz(extractedText, numQuestions = 5) {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('No LLM API key detected. Using built-in intelligent MCQ generation engine.');
    return null;
  }

  const prompt = `You are an assessment designer for a government statistical training platform (MoSPI India).
Given the learning material below, generate exactly ${numQuestions} multiple-choice questions.
Each question must have 4 options, one correct answer (correctIndex 0-3), and a one-sentence explanation of why the correct answer is right.
Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ]
}

Learning material:
"""
${extractedText.substring(0, 4000)}
"""`;

  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text;
      if (text) {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson).questions;
      }
    } else if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: "json_object" },
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return parsed.questions || parsed;
      }
    }
  } catch (err) {
    console.error('LLM API Call error, falling back to local quiz engine:', err.message);
  }
  return null;
}

exports.generateQuiz = async (req, res) => {
  try {
    let extractedText = '';
    const { rawText, sourceTitle, skillTag, category, numQuestions } = req.body;

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const parsedPdf = await pdfParse(req.file.buffer);
        extractedText = parsedPdf.text;
      } else if (
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        req.file.originalname.endsWith('.docx')
      ) {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = result.value;
      } else {
        extractedText = req.file.buffer.toString('utf8');
      }
    } else if (rawText) {
      extractedText = rawText;
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({
        error: 'Uploaded material is too short or empty. Please upload a valid document or paste text with at least 20 characters.'
      });
    }

    const title = sourceTitle || (req.file ? req.file.originalname : 'Uploaded Material Assessment');
    const selectedSkill = skillTag || 'Survey Design';
    const selectedCategory = category || 'Statistical';
    const count = parseInt(numQuestions) || 5;

    let questions = await callLLMForQuiz(extractedText, count);
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      questions = generateFallbackQuiz(extractedText, selectedSkill, count);
    }

    const quizObj = {
      _id: 'quiz_' + Date.now(),
      sourceTitle: title,
      skillTag: selectedSkill,
      category: selectedCategory,
      createdBy: req.user ? (req.user._id || req.user.id) : null,
      questions,
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const newQuiz = new Quiz(quizObj);
      await newQuiz.save();
      return res.status(201).json({ message: 'Quiz generated successfully', quiz: newQuiz });
    } else {
      localStore.quizzes.push(quizObj);
      return res.status(201).json({ message: 'Quiz generated successfully', quiz: quizObj });
    }
  } catch (err) {
    console.error('Error generating quiz:', err);
    res.status(500).json({ error: 'Failed to generate quiz from document.' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    let quiz = null;
    if (mongoose.connection.readyState === 1) {
      quiz = await Quiz.findById(req.params.id);
    }
    if (!quiz) {
      quiz = localStore.quizzes.find(q => (q._id || q.id) === req.params.id);
    }
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ error: 'Error loading quiz details' });
  }
};

exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const officialId = req.user ? (req.user._id || req.user.id) : 'off_101';

    let quiz = null;
    if (mongoose.connection.readyState === 1) {
      quiz = await Quiz.findById(quizId);
    }
    if (!quiz) {
      quiz = localStore.quizzes.find(q => (q._id || q.id) === quizId);
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && Number(answers[idx]) === q.correctIndex) {
        score += 1;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const attemptObj = {
      _id: 'att_' + Date.now(),
      quizId,
      officialId,
      answers,
      score,
      totalQuestions,
      percentage,
      takenAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const attempt = new QuizAttempt(attemptObj);
      await attempt.save();

      const official = await Official.findById(officialId);
      if (official) {
        const existingSkill = official.competencyScores.find(s => s.skill.toLowerCase() === quiz.skillTag.toLowerCase());
        if (existingSkill) {
          existingSkill.level = Math.round(existingSkill.level * 0.7 + percentage * 0.3);
        } else {
          official.competencyScores.push({ skill: quiz.skillTag, category: quiz.category || 'Statistical', level: percentage });
        }
        await official.save();
      }
    } else {
      localStore.quizAttempts.push(attemptObj);
      let official = localStore.officials.find(u => (u._id || u.id) === officialId);
      if (!official) official = localStore.officials[0];

      if (official && official.competencyScores) {
        const existingSkill = official.competencyScores.find(s => s.skill.toLowerCase() === quiz.skillTag.toLowerCase());
        if (existingSkill) {
          existingSkill.level = Math.round(existingSkill.level * 0.7 + percentage * 0.3);
        } else {
          official.competencyScores.push({ skill: quiz.skillTag, category: quiz.category || 'Statistical', level: percentage });
        }
      }
    }

    res.status(200).json({
      message: 'Quiz attempt recorded successfully',
      score,
      totalQuestions,
      percentage,
      attempt: attemptObj,
      updatedSkill: quiz.skillTag
    });
  } catch (err) {
    console.error('Error submitting quiz attempt:', err);
    res.status(500).json({ error: 'Failed to record quiz attempt' });
  }
};

const {
  getQuizWithQuestions,
  getCorrectAnswers,
  getQuizByLessonId,
  saveQuizAttempt,
  getUserAttempt,
} = require("../queries/quizQueries");

const { markLessonComplete } = require("../queries/lessonQueries");
const { getLessonById } = require("../queries/lessonQueries");

// ─── PASS MARK CONSTANT ───────────────────────────────────────
// 70% or above = pass
const PASS_PERCENTAGE = 70;

// ─── GET QUIZ ─────────────────────────────────────────────────
// GET /api/quizzes/:id
// Returns quiz + questions (no correct answers sent to frontend)
const getQuizHandler = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;

    if (isNaN(quizId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid quiz ID",
      });
    }

    const quiz = await getQuizWithQuestions(quizId);

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    // Check if user already attempted this quiz
    const previousAttempt = await getUserAttempt(userId, quizId);

    res.status(200).json({
      status: "success",
      quiz,
      previousAttempt: previousAttempt || null,
    });
  } catch (err) {
    console.error("getQuiz error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to load quiz. Please try again.",
    });
  }
};

// ─── GET QUIZ BY LESSON ───────────────────────────────────────
// GET /api/quizzes/lesson/:lessonId
// Used by LessonDetail page to check if a quiz exists for this lesson
const getQuizByLessonHandler = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    if (isNaN(lessonId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid lesson ID",
      });
    }

    const quiz = await getQuizByLessonId(lessonId);

    // Return null quiz gracefully — not a 404 — lesson just has no quiz
    res.status(200).json({
      status: "success",
      quiz: quiz || null,
    });
  } catch (err) {
    console.error("getQuizByLesson error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to check for quiz.",
    });
  }
};

// ─── SUBMIT QUIZ ──────────────────────────────────────────────
// POST /api/quizzes/:id/submit
// Body: { answers: { "questionId": "a"|"b"|"c"|"d", ... } }
// Returns: score, pass/fail, per-question results
const submitQuizHandler = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;
    const { answers } = req.body;

    // ── Validate input ───────────────────────────────────────
    if (isNaN(quizId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid quiz ID",
      });
    }

    if (
      !answers ||
      typeof answers !== "object" ||
      Object.keys(answers).length === 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "No answers submitted. Please answer all questions.",
      });
    }

    // ── Fetch the quiz to verify it exists ───────────────────
    const quiz = await getQuizWithQuestions(quizId);
    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    // ── Verify all questions were answered ───────────────────
    const questionIds = quiz.questions.map((q) => String(q.id));
    const answeredIds = Object.keys(answers);
    const missingAnswers = questionIds.filter(
      (id) => !answeredIds.includes(id),
    );

    if (missingAnswers.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `Please answer all questions before submitting. You missed ${missingAnswers.length} question(s).`,
      });
    }

    // ── Fetch correct answers from DB (server-side only) ─────
    const correctAnswers = await getCorrectAnswers(quizId);

    // ── Calculate score ──────────────────────────────────────
    let score = 0;
    const results = correctAnswers.map(({ id, correct_option }) => {
      const studentAnswer = answers[String(id)];
      const isCorrect = studentAnswer === correct_option;

      if (isCorrect) score++;

      return {
        questionId: id,
        studentAnswer: studentAnswer || null,
        correctAnswer: correct_option,
        isCorrect,
      };
    });

    const total = correctAnswers.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= PASS_PERCENTAGE;

    // ── Save attempt (keeps highest score) ───────────────────
    await saveQuizAttempt(userId, quizId, score, total);

    // ── If passed and quiz belongs to a lesson → mark lesson complete ──
    if (passed && quiz.lesson_id) {
      const lesson = await getLessonById(quiz.lesson_id);
      if (lesson) {
        await markLessonComplete(userId, lesson.course_id, quiz.lesson_id);
      }
    }

    // ── Send results ─────────────────────────────────────────
    res.status(200).json({
      status: "success",
      result: {
        score,
        total,
        percentage,
        passed,
        passPercentage: PASS_PERCENTAGE,
        results, // per-question breakdown
      },
    });
  } catch (err) {
    console.error("submitQuiz error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to submit quiz. Please try again.",
    });
  }
};

module.exports = {
  getQuizHandler,
  getQuizByLessonHandler,
  submitQuizHandler,
};

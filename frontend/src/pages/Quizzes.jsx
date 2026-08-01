import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { DocData } from "../context/DocumentsContext";
import { QuizData } from "../context/QuizContext";
import LoadModal from "../components/LoadModal";

const Quizzes = () => {
  const navigate = useNavigate();
  const { docs } = useContext(DocData);
  const {
    quizzes,
    loadingQuizzes,
    generating,
    activeQuiz,
    setActiveQuiz,
    fetchQuizzes,
    handleGenerateQuiz,
  } = useContext(QuizData);

  const [activeDoc, setActiveDoc] = useState(null);

  // Active quiz playing state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (docs.length > 0 && !activeDoc) {
      setActiveDoc(docs[0]);
    }
  }, [docs]);

  useEffect(() => {
    if (!activeDoc) return;
    fetchQuizzes(activeDoc.id);
  }, [activeDoc]);

  function startQuiz(quiz) {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizFinished(false);
  }

  function handleSelectOption(index) {
    if (isSubmitted) return;
    setSelectedOption(index);
  }

  function handleSubmitAnswer() {
    if (selectedOption === null || !activeQuiz) return;
    setIsSubmitted(true);
    if (selectedOption === activeQuiz.questions[currentQuestion].correct_answer) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNextQuestion() {
    if (!activeQuiz) return;
    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  }

  function restartCurrentQuiz() {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizFinished(false);
  }

  function exitQuiz() {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizFinished(false);
  }

  // Active Quiz View (when taking a specific quiz)
  if (activeQuiz) {
    const questions = activeQuiz.questions || [];
    const activeQ = questions[currentQuestion];

    if (quizFinished) {
      const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
      return (
        <div className="min-h-screen flex bg-paper">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-md w-full paper-card p-8 rounded-3xl border border-paper-line shadow-paper">
              <div className="w-16 h-16 bg-highlighter/30 text-ink rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h1 className="font-display text-3xl mb-2 text-ink">
                Quiz Complete! 🎉
              </h1>
              <p className="text-pencil-soft mb-6">
                Here is how you performed on this quiz
              </p>
              <div className="bg-paper p-4 rounded-2xl border border-paper-line mb-6">
                <p className="text-4xl font-display text-ink mb-1">
                  {score} / {questions.length}
                </p>
                <p className="text-sm font-semibold text-pencil">
                  {percentage}% Score
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={restartCurrentQuiz}
                  className="w-full inline-flex items-center justify-center gap-2 border border-paper-line px-5 py-3 rounded-xl hover:bg-white transition-colors text-ink font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </button>
                <button
                  onClick={exitQuiz}
                  className="w-full inline-flex items-center justify-center gap-2 bg-highlighter hover:bg-highlighter-dark px-5 py-3 rounded-xl font-medium text-ink transition-colors"
                >
                  Back to Quizzes List
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex bg-paper">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-6 h-16 border-b border-paper-line bg-paper">
            <button
              onClick={exitQuiz}
              className="inline-flex items-center gap-2 text-sm font-medium text-pencil-soft hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Quizzes
            </button>
            <h1 className="font-display text-lg text-ink truncate max-w-xs sm:max-w-md">
              {activeQuiz.title}
            </h1>
          </header>

          <div className="p-6 max-w-3xl mx-auto w-full flex-1">
            {activeQ && (
              <div className="space-y-6">
                {/* Progress Header */}
                <div className="flex items-center justify-between text-sm text-pencil-soft font-medium">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="bg-white border border-paper-line px-3 py-1 rounded-full text-ink">
                    Score: {score}
                  </span>
                </div>

                {/* Question Card */}
                <div className="bg-white border border-paper-line rounded-3xl p-6 sm:p-8 shadow-paper">
                  <h2 className="font-display text-xl sm:text-2xl text-ink leading-relaxed mb-6">
                    {activeQ.question}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {activeQ.options.map((option, idx) => {
                      let optionStyle =
                        "bg-white border border-paper-line text-ink hover:border-ink/40";
                      if (isSubmitted) {
                        if (idx === activeQ.correct_answer) {
                          optionStyle =
                            "bg-green-50 border-2 border-green-500 text-green-900 font-semibold";
                        } else if (
                          idx === selectedOption &&
                          idx !== activeQ.correct_answer
                        ) {
                          optionStyle =
                            "bg-red-50 border-2 border-red-400 text-red-900 font-semibold";
                        } else {
                          optionStyle =
                            "bg-gray-50 border border-paper-line text-pencil-soft opacity-60";
                        }
                      } else if (idx === selectedOption) {
                        optionStyle =
                          "border-2 border-ink bg-highlighter/20 text-ink font-semibold";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between gap-4 ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full border border-paper-line bg-paper flex items-center justify-center text-xs font-bold shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-base">{option}</span>
                          </div>
                          {isSubmitted && idx === activeQ.correct_answer && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                          )}
                          {isSubmitted &&
                            idx === selectedOption &&
                            idx !== activeQ.correct_answer && (
                              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {isSubmitted && activeQ.explanation && (
                    <div className="mt-6 p-4 rounded-2xl bg-paper border border-paper-line text-sm text-pencil-soft">
                      <p className="font-bold text-ink mb-1">Explanation:</p>
                      <p>{activeQ.explanation}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6 flex justify-end">
                    {!isSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="bg-ink text-paper px-6 py-2.5 rounded-xl font-medium disabled:opacity-50 transition-opacity"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-highlighter text-ink hover:bg-highlighter-dark px-6 py-2.5 rounded-xl font-medium transition-colors"
                      >
                        {currentQuestion + 1 < questions.length
                          ? "Next Question →"
                          : "View Results 🎉"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz List View for active document
  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 h-16 border-b border-paper-line bg-paper">
          <h1 className="font-display text-xl text-ink">Quizzes</h1>
          <button
            onClick={() => navigate("/documents")}
            className="inline-flex items-center gap-2 bg-highlighter hover:bg-highlighter-dark px-3 py-2 rounded-lg text-sm font-semibold text-ink"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </header>

        <div className="p-6 max-w-4xl mx-auto w-full flex-1">
          {docs.length === 0 ? (
            <div className="text-center mt-20">
              <h2 className="text-xl text-black font-medium">
                No documents uploaded
              </h2>
              <p className="text-pencil mt-2">
                Upload a document to generate quiz questions.
              </p>
            </div>
          ) : (
            <>
              {/* Document Tabs */}
              <div className="flex gap-2 overflow-x-auto mb-8">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-colors ${
                      activeDoc?.id === doc.id
                        ? "bg-ink text-paper shadow-sm"
                        : "bg-white border border-paper-line text-pencil-soft hover:text-ink"
                    }`}
                  >
                    {doc.title}
                  </button>
                ))}
              </div>

              {loadingQuizzes ? (
                <div className="text-center py-20 text-pencil-soft">
                  Loading quizzes...
                </div>
              ) : quizzes.length === 0 ? (
                /* Empty Quiz State */
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 bg-highlighter/20 rounded-full flex items-center justify-center text-ink mb-6">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h2 className="font-display text-2xl text-ink mb-3">
                    No quiz yet for this document
                  </h2>
                  <p className="text-pencil-soft text-sm max-w-md mb-8">
                    Generate a short multiple-choice quiz with explanations, built from your notes.
                  </p>
                  <button
                    onClick={() => handleGenerateQuiz(activeDoc?.id)}
                    disabled={generating}
                    className="inline-flex items-center gap-2 bg-highlighter hover:bg-highlighter-dark text-ink font-semibold px-6 py-3 rounded-xl shadow-sm transition-all text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    {generating ? "Generating quiz..." : "Generate quiz"}
                  </button>
                </div>
              ) : (
                /* Saved Quizzes Stack */
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-white border border-paper-line rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-ink/20 transition-all"
                    >
                      <div>
                        <h3 className="font-display text-lg text-ink">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-pencil-soft mt-1">
                          {(quiz.questions || []).length} questions
                        </p>
                      </div>
                      <button
                        onClick={() => startQuiz(quiz)}
                        className="bg-highlighter hover:bg-highlighter-dark text-ink font-semibold px-5 py-2.5 rounded-xl inline-flex items-center gap-1 text-sm transition-colors"
                      >
                        Start <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      onClick={() => handleGenerateQuiz(activeDoc?.id)}
                      disabled={generating}
                      className="inline-flex items-center gap-2 text-pencil-soft hover:text-ink font-medium text-sm px-2 py-1.5 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      {generating ? "Generating another quiz..." : "Generate another quiz"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {generating && <LoadModal />}
    </div>
  );
};

export default Quizzes;
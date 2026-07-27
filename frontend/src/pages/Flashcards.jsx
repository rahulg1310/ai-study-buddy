import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Sparkles,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { DocData } from "../context/DocumentsContext";
import LoadModal from "../components/LoadModal";
import axios from "axios";

const Flashcards = () => {
  const navigate = useNavigate();
  const { docs } = useContext(DocData);
  const [activeDoc, setActiveDoc] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (docs.length > 0 && !activeDoc) {
      setActiveDoc(docs[0]);
    }
  }, [docs]);

  useEffect(() => {
    if (!activeDoc) return;
    setLoading(true);
    setLoading(false);
  }, [activeDoc]);

  async function handleGenerate() {
    setGenerating(true);
    setUploading(true);
    const existingQuestions = cards.map(card => card.question);
    try {
        const response = await axios.post(
            `http://127.0.0.1:8000/documents/${activeDoc.id}/flashcards`,
            {
              existing_questions: existingQuestions
            }
        );

        const newCards = response.data;
        if (newCards.length === 0) {
        alert("No more flashcards can be generated from this document.");
        return;
        }
        setCards(prev =>
            prev.length === 0
                ? newCards
                : [...prev, ...newCards]
        );

        if (cards.length === 0) {
            setCurrentCard(0);
            setKnown(0);
            setLearning(0);
        }

        setFlipped(false);

    } catch (err) {
        console.error(err);
    } finally {
        setGenerating(false);
        setUploading(false);
    }
  }

  function handleReview(isKnown) {
    if (isKnown) {
      setKnown((prev) => prev + 1);
    } else {
      setLearning((prev) => prev + 1);
    }
    setCurrentCard(prev => prev + 1);
    setFlipped(false);
  }

  function restart() {
    setCurrentCard(0);
    setKnown(0);
    setLearning(0);
    setFlipped(false);
  }

  if (cards.length > 0 && currentCard >= cards.length) {
    return (
        <div className="min-h-screen flex bg-paper">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-4xl mb-4">
                        Deck complete 🎉
                    </h1>
                    <p className="text-xl text-pencil-soft mb-8">
                        {known} known · {learning} still learning
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleGenerate}
                            className="bg-highlighter px-6 py-3 rounded-xl"
                        >
                            <Sparkles className="inline mr-2 w-5 h-5"/>
                            Generate More Cards
                        </button>
                    </div>
                </div>
            </div>
            {
              uploading && (<LoadModal />)
            }
        </div>
    );
}

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between px-6 h-16 border-b border-paper-line">
          <h1 className="font-display text-xl text-ink">
            Flashcards
          </h1>
          <button
            onClick={() => navigate("/documents")}
            className="inline-flex items-center gap-2 bg-highlighter hover:bg-highlighter-dark px-3 py-2 rounded-lg"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </header>
        <div className="p-6">
          {docs.length === 0 ? (
            <div className="text-center mt-20">
              <h2 className="text-xl text-black font-medium">
                No documents uploaded
              </h2>
              <p className="text-pencil mt-2">
                Upload a document to generate flashcards.
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto mb-6">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                      activeDoc?.id === doc.id
                        ? "bg-ink text-paper"
                        : "bg-white border"
                    }`}
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
              {loading ? (
                <div className="text-center mt-20">
                  Loading flashcards...
                </div>
              ) : cards.length === 0 ? (
                <div className="text-center mt-20">
                  <Sparkles className="mx-auto w-10 h-10 mb-3" />
                  <h2 className="text-xl font-medium">
                    No flashcards yet
                  </h2>
                  <p className="text-pencil mt-2 mb-5">
                    Generate flashcards from this document.
                  </p>
                  <button
                    onClick={handleGenerate}
                    className="bg-ink text-white px-5 py-2 rounded-lg"
                  >
                    {generating
                      ? "Generating..."
                      : "Generate Flashcards"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center gap-5 mb-5 text-sm">
                    <span>
                      Card {currentCard + 1} / {cards.length}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <ThumbsUp className="w-4 h-4" />
                      {known}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <ThumbsDown className="w-4 h-4" />
                      {learning}
                    </span>
                  </div>
                  <div
                      onClick={() => setFlipped(!flipped)}
                      className={`max-w-xl mx-auto h-[420px] rounded-3xl shadow-paper cursor-pointer transition-all duration-500 px-12 flex flex-col justify-center ${
                          flipped
                              ? "bg-ink text-paper"
                              : "bg-paper-card border border-paper-line text-ink"
                      }`}
                  >
                      <p className="text-xs font-bold uppercase opacity-60 mb-8">
                          {flipped ? "Answer" : "Question"}
                      </p>

                      <p className="font-display text-2xl leading-relaxed">
                          {flipped
                              ? cards[currentCard].answer
                              : cards[currentCard].question}
                      </p>
                  </div>
                  {flipped && (
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        onClick={() => handleReview(false)}
                        className="px-5 py-2 border rounded-lg"
                      >
                        Still Learning
                      </button>
                      <button
                        onClick={() => handleReview(true)}
                        className="px-5 py-2 bg-ink text-white rounded-lg"
                      >
                        I Knew It
                      </button>
                    </div>
                  )}
                  {currentCard === cards.length - 1 && (
                    <div className="text-center mt-8">
                      <button
                        onClick={restart}
                        className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Review Again
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {
        uploading && (<LoadModal />)
      }
    </div>
  );
};

export default Flashcards;
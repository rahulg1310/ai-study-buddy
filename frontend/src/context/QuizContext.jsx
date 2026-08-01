import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import LoadModal from "../components/LoadModal";

export const QuizData = createContext();

const QuizContext = ({ children }) => {

  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);


  useEffect(() => {

    const fetchDocuments = async () => {

      try {

        const token = JSON.parse(localStorage.getItem("token"));

        const res = await axios.get(
          "http://127.0.0.1:8000/documents",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        setDocuments(res.data.documents);

        if(res.data.documents.length > 0){
          setActiveDocId(res.data.documents[0].id);
        }

      }
      catch(error){
        console.log("Error fetching documents:", error);
      }

    }

    fetchDocuments();

  },[]);



  async function fetchQuizzes(docId) {

    if(!docId) return;

    try {

      setLoadingQuizzes(true);

      const res = await axios.get(
        `http://127.0.0.1:8000/documents/${docId}/quizzes`
      );

      setQuizzes(res.data);

    }
    catch(error){

      console.log("Error fetching quizzes:", error);

    }
    finally{

      setLoadingQuizzes(false);

    }

  }



  async function handleGenerateQuiz(docId){

    if(!docId) return;

    setGenerating(true);

    try{

      const res = await axios.post(
        `http://127.0.0.1:8000/documents/${docId}/quizzes`
      );

      const newQuiz = res.data;

      setQuizzes((prev)=>[
        ...prev,
        newQuiz
      ]);

      return newQuiz;

    }
    catch(error){

      console.log("Error generating quiz:",error);
      alert("Failed to generate quiz. Please try again.");

    }
    finally{

      setGenerating(false);

    }

  }



  return (

    <QuizData.Provider
      value={{

        documents,
        setDocuments,

        activeDocId,
        setActiveDocId,

        quizzes,
        setQuizzes,

        loadingQuizzes,

        generating,

        activeQuiz,
        setActiveQuiz,

        fetchQuizzes,
        handleGenerateQuiz

      }}
    >

      {children}

    </QuizData.Provider>

  );

}


export default QuizContext;
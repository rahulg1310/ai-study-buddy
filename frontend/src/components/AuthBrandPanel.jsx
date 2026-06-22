import React from 'react'
import { BookOpen } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'

const AuthBrandPanel = () => {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:flex lg:w-[44%] bg-ink text-paper flex-col justify-between px-12 py-10 relative overflow-hidden">
      <div className="flex items-center gap-2 relative z-10">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-highlighter text-ink">
          <BookOpen className="w-4.5 h-4.5" strokeWidth={2.25} />
        </div>
        <button 
        onClick={()=>{
            navigate('/');
        }}
        className="font-display text-lg hover:cursor-pointer">Grace</button>
      </div>
      <div className="relative z-10">
        <h2 className="font-display text-[2.4rem] leading-[1.1] mb-4 text-balance">
          Turn your notes into something you actually remember.
        </h2>
        <p className="text-paper/65 text-[15px] max-w-sm">
          Upload a PDF, a set of slides, or a messy doc — get summaries, flashcards, and quizzes
          built straight from what you're studying.
        </p>
      </div>
      <p className="font-hand text-2xl text-highlighter relative z-10 -rotate-2">
        "made the night before finals a lot less stressful"
      </p>
    </div>
  )
}

export default AuthBrandPanel

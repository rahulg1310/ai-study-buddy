import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BookOpen, Upload, MessageSquare, Layers, ListChecks, CalendarRange, ArrowRight } from 'lucide-react'


const features = [
  {
    icon: Upload,
    title: 'Upload anything',
    description: 'Drop in PDFs, Word docs, or plain text — lecture slides, scanned notes, textbook chapters.',
  },
  {
    icon: MessageSquare,
    title: 'Chat with your notes',
    description: 'Ask questions and get answers grounded in your own material, with the source passage cited.',
  },
  {
    icon: Layers,
    title: 'Flashcards, generated',
    description: 'Turn any document into a reviewable deck in seconds, then track what you actually remember.',
  },
  {
    icon: ListChecks,
    title: 'Quizzes with answers',
    description: 'Test yourself with auto-generated multiple choice questions and clear explanations.',
  },
  {
    icon: CalendarRange,
    title: 'A plan, not just a pile',
    description: 'Tell it your exam date and get a day-by-day study plan across everything you\'ve uploaded.',
  },
]

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className='bg-paper min-h-screen'>
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-highlighter text-ink">
            <BookOpen className="w-4.5 h-4.5" strokeWidth={2.25} />
          </div>
          <span className="font-display text-lg text-ink">Grace</span>
        </div>
        <div className="flex items-center gap-5">
          <button 
          onClick={()=>{
            navigate('/signin');
          }}
          className='text-sm font-medium text-ink hover:underline'>
            Sign in
          </button>
          <button 
          onClick={()=>{
            navigate('/signup');
          }}
          className='text-sm font-semibold text-ink bg-highlighter hover:bg-highlighter-dark transition-colors px-4 py-2 rounded-lg'>
            Get started
          </button>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-[1.08] mb-5 text-balance">
            Study smarter with notes that talk back.
          </h1>
          <p className="text-pencil-soft text-lg max-w-md mb-8">
            Upload your notes, then summarize, quiz, and chat your way to actually knowing the
            material — not just having read it once.
          </p>
          <div className="flex items-center gap-4">
            <button 
            onClick={()=>{
                navigate('/signup');
            }}
            className="flex items-center gap-2 text-sm font-semibold text-ink bg-highlighter hover:bg-highlighter-dark transition-colors px-5 py-3 rounded-lg">
              Start studying free
              <ArrowRight size={15} className='mt-1' />
            </button>
            <button 
            onClick={()=>
                navigate('/signin')
            }
            className="text-sm font-semibold text-ink hover:underline">
              I already have an account
            </button>
          </div>
        </div>
        <DeckPreview />
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="font-display text-2xl text-ink mb-8">Everything you need, in one place</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((elem) => (
            <div key={elem.title} className="paper-card p-5">
              <div className="w-9 h-9 rounded-lg bg-chalk-blue/15 flex items-center justify-center mb-3.5">
                <elem.icon className="w-4.5 h-4.5 text-chalk-blue-dark" strokeWidth={2} />
              </div>
              <h3 className="font-display text-base text-ink mb-1.5">{elem.title}</h3>
              <p className="text-sm text-pencil-soft">{elem.description}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-paper-line">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-pencil-soft flex items-center justify-between">
          <span>© 2026 Grace</span>
          <span className="font-hand text-base text-pencil">study less, remember more</span>
        </div>
      </footer>
    </div>
  )
}

function DeckPreview(){
    return(
        <div className="relative h-72 sm:h-80">
            <div className="absolute left-1/2 top-8 -translate-x-1/2 w-64 paper-card p-4 -rotate-6">
                <p className="text-xs font-semibold text-pencil-soft mb-1">Biology — Ch. 4</p>
                <p className="font-display text-base text-ink leading-snug">What does the Na⁺/K⁺ pump do per cycle?</p>
            </div>
            <div className="absolute left-1/2 top-24 -translate-x-1/2 w-64 paper-card p-4 rotate-2 bg-ink text-paper border-ink-light">
                <p className="text-xs font-semibold text-paper/60 mb-1">Answer</p>
                <p className="text-sm leading-relaxed">
                    Moves 3 Na⁺ out and 2 K⁺ in per ATP used — active transport, against the gradient.
                </p>
            </div>
            <div className="absolute left-1/2 top-44 -translate-x-1/2 w-64 paper-card p-4 -rotate-3">
                <div className="flex items-center justify-between text-xs text-pencil-soft mb-2">
                    <span>Quiz · Question 2 of 5</span>
                    <span className="font-mono text-chalk-blue-dark">0:42</span>
                </div>
                <p className="text-sm text-ink font-medium">A hypotonic solution causes a cell to:</p>
            </div>
        </div>
    )
}

export default Landing

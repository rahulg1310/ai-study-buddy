import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Flame } from 'lucide-react'
import { Upload } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import { Clock, Layers, Target, FileText, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import EmptyState from '../ui/EmptyState'

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  return (
    <div className='min-h-screen flex bg-paper'>
      <Sidebar />
      <div className='flex-1'>
        <header className="flex items-center justify-between gap-3 px-4 sm:px-6 h-16 border-b border-paper-line bg-paper/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display text-xl text-ink truncate">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-pencil-soft px-2.5 py-1.5 rounded-full bg-coral/10">
              <Flame className="w-3.5 h-3.5 text-coral" strokeWidth={2.5} />
              <span className="font-semibold text-ink">0</span> day streak
            </div>
            <button
              onClick={()=>{
                navigate('/documents');
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink bg-highlighter hover:bg-highlighter-dark transition-colors px-3 py-2 rounded-lg"
            >
              <Upload className="w-4 h-4" strokeWidth={2.25} />
              <span className="hidden sm:inline">Upload</span>
            </button>
            
          </div>
        </header>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-6'>
          <div className='space-y-7'>
            <div>
              <h2 className="font-display text-2xl text-ink mb-1">Hey Rahul!</h2>
              <p className="text-pencil-soft text-sm">Here's where things stand today.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard icon={Flame} label="Day streak" value={6} label='Day streak' tone="coral" />
              <StatsCard icon={Clock} label="Minutes studied" value={1840} label='Minutes studies' tone="blue" />
              <StatsCard icon={Layers} label="Cards reviewed" value={312} label='Cards reviewed' tone="highlight" />
              <StatsCard icon={Target} label="Avg. quiz score" value={`${81}%`} label='Avg quiz score' tone="sage" />
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-ink">Recent documents</h3>
                  <button onClick={()=>(navigate('/documents'))} className="text-sm font-medium text-chalk-blue-dark hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {docs.length === 0 ? (
                  <div className='paper-card p-5'>
                    <EmptyState
                      icon={FileText}
                      title="No documents yet"
                      description="Upload your first set of notes to get a summary, flashcards, and a quiz generated automatically."
                      action={
                        <button 
                        onClick={()=>{
                          navigate('/documents');
                        }}
                        className='inline-flex items-center gap-1.5 text-sm font-semibold text-ink bg-highlighter hover:bg-highlighter-dark transition-colors px-3 py-2 rounded-lg'>
                          <Upload className="w-4 h-4" strokeWidth={2.25} />
                          <span className="hidden sm:inline">Upload Notes</span>
                        </button>
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {docs.map((doc) => (
                      <button 
                      onClick={()=>{
                        navigate('/documents');
                      }}
                      key={doc.id}>
                        <div className="paper-card p-5 flex items-center gap-3.5 hover:border-pencil/30 transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-chalk-blue/15 text-chalk-blue-dark flex items-center justify-center shrink-0">
                            <FileText className="w-4.5 h-4.5" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{doc.title}</p>
                            <p className="text-xs text-pencil-soft">
                              {formatRelativeTime(doc.uploadedAt)} · {doc.pages} pages
                            </p>
                          </div>
                          {doc.status === 'processing' ? (
                            <Badge tone="blue">Processing</Badge>
                          ) : (
                            <Badge tone="sage">{doc.flashcardCount} cards</Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-ink">Today's plan</h3>
                  <button onClick={()=>{
                    navigate('/plan');
                  }} className="text-sm font-medium text-chalk-blue-dark hover:underline flex items-center gap-1">
                    Full plan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="paper-card p-5 p-4 space-y-1">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-pencil-soft py-3">Nothing scheduled for today. Generate a plan to get going.</p>
                  ) : (
                    tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => handleToggle(task.id, !task.done)}
                        className="w-full flex items-start gap-2.5 text-left py-2 px-1.5 rounded-lg hover:bg-paper-line/40 transition-colors"
                      >
                        {task.done ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-sage-dark shrink-0 mt-0.5" strokeWidth={2} />
                        ) : (
                          <Circle className="w-4.5 h-4.5 text-pencil-soft shrink-0 mt-0.5" strokeWidth={2} />
                        )}
                        <span>
                          <span className={`text-sm block ${task.done ? 'text-pencil-soft line-through' : 'text-ink'}`}>
                            {task.label}
                          </span>
                          <span className="text-xs text-pencil-soft">{task.minutes} min</span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

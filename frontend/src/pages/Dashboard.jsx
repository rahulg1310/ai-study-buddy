import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Flame, User } from 'lucide-react'
import { Upload } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import { Clock, Layers, Target, FileText, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { UserData } from '../context/UserContext'
import { DocData } from '../context/DocumentsContext'

const Dashboard = () => {
  const {user} = useContext(UserData);
  const {docs,setDocs} = useContext(DocData);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  function formatRelativeTime(date) {
    return new Date(date).toLocaleDateString();
  }
  return (
    <div className='min-h-screen flex bg-paper'>
      <Sidebar />
      <div className='flex-1'>
        <header className="flex items-center justify-between gap-3 px-4 sm:px-6 h-16 border-b border-paper-line bg-paper/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display text-xl text-ink truncate">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
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
              <h2 className="font-display text-2xl text-ink mb-1">Hey {user?.name}!</h2>
            </div>
            
            <div className="">
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
                              {formatRelativeTime(doc.upload_date)} · {doc.pages} pages
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

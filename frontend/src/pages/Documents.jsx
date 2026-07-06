import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import EmptyState from '../ui/EmptyState'
import { Flame } from 'lucide-react'
import { Upload } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import UploadZone from '../components/UploadZone'
import { DocData } from '../context/DocumentsContext'

const Documents = () => {
  const {docs,setDocs} = useContext(DocData);
  const [uploading, setUploading] = useState(false);
  async function handleFiles(files) {
    setUploading(true);
    try{
      for(const file of files){
        setDocs((prev)=> [file, ...(prev || [])])
      }
    }
    finally{
      setUploading(false);
    }
  }
  return (
    <div className='min-h-screen flex bg-paper'>
      <Sidebar />
      <div className='flex-1'>
        <header className="flex items-center justify-between gap-3 px-4 sm:px-6 h-16 border-b border-paper-line bg-paper/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display text-xl text-ink truncate">Documents</h1>
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
          <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6'>
            <UploadZone onFiles={handleFiles} busy={uploading}/>
            
          </div>
      </div>
    </div>
  )
}

export default Documents

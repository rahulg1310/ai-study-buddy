import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import EmptyState from '../ui/EmptyState'
import { Flame } from 'lucide-react'
import { Upload } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import UploadZone from '../components/UploadZone'
import { DocData } from '../context/DocumentsContext'
import { FileStack } from 'lucide-react'
import DocumentCard from '../components/DocumentCard'
import Modal from '../components/Modal'
import { Sparkle } from 'lucide-react'
import axios from 'axios'

const Documents = () => {
  const navigate = useNavigate();
  const [docPendingDelete, setDocPendingDelete] = useState(null);
  const {docs,setDocs} = useContext(DocData);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  async function confirmDelete(){
    try{
        setLoading(true);
        const token=JSON.parse(localStorage.getItem("token"));
        await axios.delete(
            `http://127.0.0.1:8000/documents/${docPendingDelete.id}`,
            {
              headers:{
                Authorization: `Bearer ${token}`
              }
            }
        );
        setDocs((prev) =>
            prev.filter((doc) => doc.id !== docPendingDelete.id)
        );
        setDocPendingDelete(null);
    }
    catch(error){
      console.log(error);
    }
    finally{
      setLoading(false);
    }
    }
  async function handleFiles(files) {
    setUploading(true);
    try{
      const token=JSON.parse(localStorage.getItem("token"));
      for(const file of files){
        const formData = new FormData();
        formData.append("file",file);
        const res=await axios.post("http://127.0.0.1:8000/documents",formData,{
          headers:{
            Authorization : `Bearer ${token}`
          }
        });
        setDocs((prev)=> [res.data, ...(prev || [])])
      }
    }
    catch(error){
      console.log(error);
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
            {docs.length === 0 ? (
              <EmptyState
                icon={FileStack}
                title="Nothing uploaded yet"
                description="Drop a PDF, Word doc, or text file above to get started — your summary and flashcards will be ready in moments."
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc,idx) => (
                  <DocumentCard key={idx} doc={doc} onDelete={setDocPendingDelete} />
                ))}
              </div>
            )}

            <Modal open={Boolean(docPendingDelete)} onClose={() => setDocPendingDelete(null)} title="Delete this document?">
              <p className="text-sm text-pencil-soft mb-5">
                "{docPendingDelete?.title}" and its flashcards, quizzes, and chat history will be removed. This can't be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button className='bg-black disabled:cursor-not-allowed flex items-center justify-center rounded-lg font-body font-semibold transition-colors duration-150 w-full text-black py-2 gap-2 text-[15px] hover:bg-black/50 shadow-lg text-white'  onClick={() => setDocPendingDelete(null)}>
                  Cancel
                </button>
                <button className='bg-red-500 disabled:cursor-not-allowed flex items-center justify-center rounded-lg font-body font-semibold transition-colors duration-150 w-full text-black py-2 gap-2 text-[15px] hover:bg-black/50 shadow-lg text-white' onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </Modal>
          </div>
      </div>
    </div>
  )
}

export default Documents

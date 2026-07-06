import React, { useState } from 'react'
import {
  FileText,
  FileType2,
  File,
  MoreVertical,
  Trash2,
  Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const DocumentCard = ({ doc, onDelete}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  let Icon = FileText;
  if(doc.type === "docx"){
    Icon = FileType2;
  }
  if(doc.type === "txt"){
    Icon = File;
  }
  const navigate = useNavigate();
  return (
    <div className="paper-card p-5 flex flex-col gap-4 relative">
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 rounded-lg bg-chalk-blue/15 flex items-center justify-center text-chalk-blue-dark">
          <Icon className="w-5 h-5" strokeWidth={2}/>
        </div>
        <div className="relative">
          <button
            onClick={()=>{
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-md hover:bg-paper-line"
          >
            <MoreVertical className="w-4 h-4"/>
          </button>
          {
            menuOpen && (
            <div
            className="absolute right-0 mt-2 w-36 paper-card shadow-lg p-1 z-20"
            onMouseLeave={()=>{
                setMenuOpen(false);
            }}
            >
                <button
                    onClick={()=>{
                    setMenuOpen(false);
                    onDelete(doc);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-red-500 hover:bg-red-100"
                >
                    <Trash2 className="w-4 h-4"/>
                    Delete
                </button>
            </div>
            )
          }
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-ink truncate">
          {doc.title}
        </h3>
        <p className="text-xs text-pencil-soft mt-1">
          {doc.uploadedAt} • {doc.pages} pages • {doc.sizeBytes} bytes
        </p>
      </div>
      {
        doc.tags &&
        (
          <div className="flex flex-wrap gap-2">
            {
              doc.tags.map((tag,index)=>(
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs bg-paper-line"
                >
                  {tag}
                </span>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default DocumentCard;
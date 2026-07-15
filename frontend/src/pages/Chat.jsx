import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import LoadModal from '../components/LoadModal'
import { UserData } from '../context/UserContext'
import { DocData } from '../context/DocumentsContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { Upload } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { useNavigation } from 'react-router-dom'
import EmptyState from '../ui/EmptyState'
import ChatInput from '../components/ChatInput'
import ChatMessage from '../components/ChatMessage'
import axios from 'axios'
import { ChatData } from '../context/ChatContext'

const Chat = () => {
  const {
    messages,
    setMessages,
    activeDocId,
    setActiveDocId,
    loadingHistory,
  } = useContext(ChatData);
  async function handleSend(text) {
    const userMessage = {
        id: Date.now(),
        role: "user",
        content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    try {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await axios.post(
            `http://127.0.0.1:8000/documents/${activeDocId}/chat`,
            {
              message: text,
            },
            {
              headers:{
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + 1,
                role: "assistant",
                content: res.data.answer,
            },
        ]);
    }catch(error) {
        console.log(error);
    }finally{
      setSending(false);
    }
  }
  const navigate = useNavigate();
  const {user} = useContext(UserData);
  const {docs} = useContext(DocData);
  const location = useLocation()
  useEffect(() => {
    if (!activeDocId && docs.length > 0) {
        setActiveDocId(location.state?.docId || docs[0]?.id);
    }
  }, [docs]);
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const activeDoc = docs.find((doc) => doc.id === activeDocId);
  return (
    <div className='min-h-screen flex bg-paper'>
      <Sidebar />
      <div className='flex-1'>
        <header className="flex items-center justify-between gap-3 px-4 sm:px-6 h-16 border-b border-paper-line bg-paper/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display text-xl text-ink truncate">Chat</h1>
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
        <div className='flex flex-col px-16 py-7 h-[calc(100vh-4.5rem)]'>
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 scrollbar-thin">
            {docs.map(function (doc) {
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`shrink-0 text-sm font-medium px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    doc.id === activeDocId ? 'bg-ink text-paper' : 'paper-card text-pencil hover:border-pencil/30'
                  }`}
                >
                  {doc.title}
                </button>
              )
            })}
          </div>
            <div className="paper-card flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4  scrollbar-thin">
                {loading ? (
                    <LoadModal />
                ) : docs.length === 0 ? (
                    <EmptyState
                        icon={Upload}
                        title="No documents yet"
                        description="Upload your first PDF, DOCX, or TXT file to start chatting."
                    />
                ) : messages.length === 0 ? (
                    <EmptyState
                        icon={Sparkles}
                        title={`Ask anything about "${activeDoc?.title}"`}
                        description='Try: "Summarize the key points" or "Explain this in simpler terms."'
                    />
                ) : (
                    messages.map((m) => (
                        <ChatMessage
                            key={m.id}
                            message={m}
                        />
                    ))
                )}
                {sending && (
                  <div className="flex items-center gap-2 text-sm text-pencil-soft pl-9">
                    <span className="flex gap-1">
                      <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
                    </span>
                    thinking…
                  </div>
                )}
              </div>
              {docs.length > 0 && (
                  <ChatInput
                      onSend={handleSend}
                      disabled={sending}
                  />
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Dot = (props) => {
  const delay = props.delay || '0s'
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-pencil-soft inline-block animate-bounce"
      style={{ animationDelay: delay }}
    />
  )
}

export default Chat

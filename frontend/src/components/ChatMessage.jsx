import { Sparkles, BookMarked } from 'lucide-react'

const ChatMessage = (props) => {
  const message = props.message
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-ink text-highlighter flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}
      <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser ? 'bg-highlighter text-ink rounded-br-sm' : 'paper-card rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        {message.citations?.length > 0 && (
          <div className="mt-1.5 space-y-1">
            {message.citations.map(function (c, i) {
              return (
                <div key={i} className="flex items-start gap-1.5 text-xs text-pencil-soft px-1">
                  <BookMarked className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>
                    p. {c.page} — <span className="italic">"{c.snippet}"</span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage

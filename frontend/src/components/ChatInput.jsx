import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'

const ChatInput = (props) => {
  const [value, setValue] = useState('')
  const placeholder = props.placeholder || 'Ask something about this document…'

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || props.disabled) return
    props.onSend(trimmed)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 border-t border-paper-line bg-paper-card rounded-b-xl">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        rows={1}
        placeholder={placeholder}
        disabled={props.disabled}
        className="flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-pencil-soft/70 outline-none py-2 px-1 max-h-32"
      />
      <button
        type="submit"
        disabled={props.disabled || !value.trim()}
        aria-label="Send message"
        className="w-9 h-9 rounded-lg bg-highlighter text-ink flex items-center justify-center disabled:opacity-40 hover:bg-highlighter-dark transition-colors shrink-0"
      >
        <SendHorizontal className="w-4 h-4" strokeWidth={2.25} />
      </button>
    </form>
  )
}

export default ChatInput

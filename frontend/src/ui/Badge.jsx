const tones = {
  neutral: 'bg-paper-line/60 text-pencil',
  highlight: 'bg-highlighter/30 text-ink',
  coral: 'bg-coral/15 text-coral-dark',
  blue: 'bg-chalk-blue/20 text-chalk-blue-dark',
  sage: 'bg-sage/15 text-sage-dark',
}

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}
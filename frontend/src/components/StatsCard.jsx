import React from 'react'

const StatsCard = (props) => {
  const iconTones = {
    highlight: 'bg-highlighter/25 text-highlighter-dark',
    coral: 'bg-coral/15 text-coral-dark',
    blue: 'bg-chalk-blue/20 text-chalk-blue-dark',
    sage: 'bg-sage/15 text-sage-dark',
  }
  return (
    <div className="flex items-start gap-3.5 paper-card p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconTones[props.tone]}`}>
        <props.icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <div>
        <p className="text-2xl font-display text-ink leading-none mb-1">{props.value}</p>
        <p className="text-sm text-pencil-soft">{props.label}</p>
      </div>
    </div>
  )
}

export default StatsCard

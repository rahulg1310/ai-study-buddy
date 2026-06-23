export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-paper-line/50 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-pencil-soft" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-pencil-soft max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  )
}
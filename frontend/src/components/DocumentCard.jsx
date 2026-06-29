import { Link } from 'react-router-dom'
import { FileText, FileType2, File, MoreVertical, Trash2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import Badge from '../ui/Badge'

export default function DocumentCard({doc, onDelete, onOpenSummary}){
    const [menuOpen, setMenuOpen] = useState(false)
    const Icon = typeIcon[doc.type] || FileText
    const isProcessing = doc.status === 'processing'
    return (
        <div className="relative flex flex-col gap-3 paper-card p-5">
            <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-chalk-blue/15 text-chalk-blue-dark flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <div className="relative">
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Document options"
                    className="p-1.5 rounded-md text-pencil-soft hover:bg-paper-line/60 hover:text-ink"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                    <div
                    className="absolute right-0 top-9 z-10 w-40 paper-card p-1 shadow-card-lg"
                    onMouseLeave={() => setMenuOpen(false)}
                    >
                    <button
                        onClick={() => {
                        setMenuOpen(false)
                        onDelete(doc)
                        }}
                        className="w-full flex items-center gap-2 text-sm text-coral-dark px-2.5 py-1.5 rounded-md hover:bg-coral/10"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    </div>
                )}
                </div>
            </div>

            <div>
                <h3 className="font-display text-base text-ink leading-snug mb-1 line-clamp-2">{doc.title}</h3>
                <p className="text-xs text-pencil-soft">
                {formatRelativeTime(doc.uploadedAt)} · {doc.pages} pages · {formatBytes(doc.sizeBytes)}
                </p>
            </div>

            {doc.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((tag) => (
                    <Badge key={tag} tone="neutral">
                    {tag}
                    </Badge>
                ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-paper-line mt-auto">
                {isProcessing ? (
                <Badge tone="blue">
                    <Sparkles className="w-3 h-3" /> Processing
                </Badge>
                ) : (
                <button onClick={() => onOpenSummary(doc)} className="text-sm font-medium text-chalk-blue-dark hover:underline">
                    View summary
                </button>
                )}
                {!isProcessing && (
                <div className="flex gap-3 text-xs text-pencil-soft">
                    <Link to="/app/flashcards" state={{ docId: doc.id }} className="hover:text-ink hover:underline">
                    {doc.flashcardCount} cards
                    </Link>
                    <Link to="/app/quizzes" state={{ docId: doc.id }} className="hover:text-ink hover:underline">
                    {doc.quizCount} quiz
                    </Link>
                </div>
                )}
            </div>
        </div>
    )

}
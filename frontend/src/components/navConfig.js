import { LayoutDashboard, FileStack, MessageSquare, Layers, ListChecks, CalendarRange, BarChart3 } from 'lucide-react'

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/documents', label: 'Documents', icon: FileStack },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/flashcards', label: 'Flashcards', icon: Layers},
  { to: '/quizzes', label: 'Quizzes', icon: ListChecks }
]

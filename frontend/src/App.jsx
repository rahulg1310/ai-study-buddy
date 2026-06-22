import React from 'react'
import Landing from './pages/Landing'
import { Routes , Route } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Chat from './pages/Chat'
import Flashcards from './pages/Flashcards'
import Quizzes from './pages/Quizzes'
import Studyplan from './pages/Studyplan'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/documents' element={<Documents />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/flashcards' element={<Flashcards />} />
        <Route path='/quizzes' element={<Quizzes />} />
        <Route path='/plan' element={<Studyplan />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App

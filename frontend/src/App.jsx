import React, { useContext } from 'react'
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
import { UserData } from './context/UserContext'
import { Navigate } from 'react-router-dom'

const App = () => {
  const {user} = useContext(UserData);
  const token = localStorage.getItem("token");
  return (
    <div>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to='/signin' />} />
        <Route path='/documents' element={user ? <Documents /> : <Navigate to='/signin' />} />
        <Route path='/chat' element={user ? <Chat /> : <Navigate to='/signin' />} />
        <Route path='/flashcards' element={user ? <Flashcards /> : <Navigate to='/signin' />} />
        <Route path='/quizzes' element={user ? <Quizzes /> : <Navigate to='/signin' />} />
        <Route path='/plan' element={user ? <Studyplan /> : <Navigate to='/signin' />} />
        <Route path='/analytics' element={user ? <Analytics /> : <Navigate to='/signin' />} />
        <Route path='/profile' element={user ? <Profile /> : <Navigate to='/signin' />} />
      </Routes>
    </div>
  )
}

export default App

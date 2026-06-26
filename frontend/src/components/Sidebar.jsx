import React, { useContext, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { navItems } from './navConfig'
import { Flame } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { UserData } from '../context/UserContext'

const Sidebar = () => {
  const {user,setUser} = useContext(UserData);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex min-h-screen w-68 flex-col bg-ink text-paper">
      <div className="flex items-center gap-2 px-6 pt-6 pb-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-highlighter text-ink">
          <BookOpen className="w-4.5 h-4.5" strokeWidth={2.25} />
        </div>
        <span className="font-display text-lg tracking-tight">Grace</span>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-3 space-y-0.5 mt-2 overflow-y-auto scrollbar-thin">
        {navItems.map(function(elem){
            const isActive = location.pathname === `/${elem.label.toLowerCase()}`;
            return(
                <button key={elem.label} 
                onClick={()=>{
                    navigate(`/${elem.to}`);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-highlighter text-ink' : 'text-paper/75 hover:bg-ink-light hover:text-paper'
                }`}>
                    <elem.icon className="w-4.5 h-4.5 shrink-0" strokeWidth={2} />
                    {elem.label}
                </button>
            )
        })}
      </nav>
      <div className="px-4 pb-4 pt-3 border-t border-paper/10">
        <div className="flex items-center gap-2 px-2 py-2 mb-1 rounded-lg">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-coral/20 text-coral">
            <Flame className="w-4 h-4" strokeWidth={2.25} />
          </div>
          <div className="text-sm">
            <span className="font-semibold text-paper">0-day</span>{' '}
            <span className="text-paper/60">streak</span>
          </div>
        </div>
        <button 
        onClick={()=>{
            navigate('/profile');
        }}
        className='flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors hover:bg-ink-light'>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-ink shrink-0 bg-gray-400">
                R
            </div>
            <div className="min-w-0 flex flex-col items-start">
                <p className="text-sm font-medium text-paper truncate">{user?.name}</p>
                <p className="text-xs text-paper/50 truncate">{user?.email}</p>
            </div>
        </button>
        <button
          onClick={()=>{
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            navigate('/');
          }}
          className="flex items-center gap-2.5 w-full px-2 py-2 mt-1 rounded-lg text-sm text-paper/60 hover:text-paper hover:bg-ink-light transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          Log out
        </button>
      </div>
    </div>
  )
}

export default Sidebar

import React, { useState } from 'react'
import AuthBrandPanel from '../components/AuthBrandPanel'
import { Lock } from 'lucide-react';
import { Mail } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [emailError,setEmailError] = useState('');
  const validate = () =>{
    setEmailError('');
    setPassError('');
    if(email===''){
        setEmailError('Please enter email');
        return false;
    }
     if(!email.includes('@')){
        setEmailError('Please enter valid email');
        return false;
    }
    if(password===''){
        setPassError('Please enter password');
        return false;
    }
    if(password.length<8){
        setPassError('Please enter atleast 8 characters');
        return false;
    }
    return true;
  }
  return (
    <div className='min-h-screen bg-paper flex'>
      <AuthBrandPanel />
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className='w-full max-w-sm mx-auto'>
            <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
            <p className="text-pencil-soft text-sm mb-8">
            Pick up right where you left off
            </p>
            <button className="w-full flex items-center justify-center gap-2.5 border border-pencil/25 rounded-lg py-2.5 text-sm font-semibold text-ink hover:bg-paper-card transition-colors mb-5 disabled:opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="" className='w-5 h-5' />
            Continue with Google
            </button>
            <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-paper-line" />
                <span className="text-xs text-pencil-soft">or</span>
                <div className="flex-1 h-px bg-paper-line" />
            </div>
            <form onSubmit={(e)=>{
                e.preventDefault();
                if(!validate()) return;
                navigate('/dashboard');
            }} className='space-y-2'>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pencil-soft" />
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            placeholder="you@school.edu"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-pencil/25 bg-paper-card text-sm text-ink placeholder:text-pencil-soft/70 focus:border-chalk-blue-dark outline-none "
                        />
                    </div>
                    <span className='text-[12px] font-medium text-[#ff2929] ml-1'>{emailError}</span>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pencil-soft" />
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPassError('');
                            }}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-pencil/25 bg-paper-card text-sm text-ink placeholder:text-pencil-soft/70 focus:border-chalk-blue-dark outline-none"
                        />
                    </div>
                    <span className='text-[11px] text-[#ff2929] ml-1'>{passError}</span>
                </div>
                <button type="submit" className='bg-amber-400/50 disabled:cursor-not-allowed flex items-center justify-center rounded-lg font-body font-semibold transition-colors duration-150 w-full text-black py-2 gap-2 text-[15px] hover:bg-amber-400 shadow-lg'>
                    <span>Sign in</span>
                    <ArrowRight size={18} className=''/>
                </button>
                <p className="text-sm text-pencil-soft text-center mt-7">
                    New here?{' '}
                    <button 
                    onClick={()=>{
                        navigate('/signup');
                    }}
                    className="text-ink font-semibold hover:underline">
                    Create an account
                    </button>
                </p>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Signin

import React, { useContext, useState } from 'react'
import AuthBrandPanel from '../components/AuthBrandPanel'
import { Navigate, useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { Mail } from 'lucide-react'
import { Lock } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { UserData } from '../context/UserContext'
import axios from 'axios'
import LoadModal from '../components/LoadModal'

const Signup = () => {
  const{user,setUser} = useContext(UserData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [emailError,setEmailError] = useState('');
  const [userError,setUserError] = useState('');
  const validate = () =>{
    setEmailError('');
    setPassError('');
    setUserError('');
    if(name===''){
        setUserError('Please enter name');
        return false;
    }
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
            <div className="w-full max-w-sm mx-auto">
          <h1 className="font-display text-3xl text-ink mb-2">Create your account</h1>
          <p className="text-pencil-soft text-sm mb-8">Free to start. Upload your first set of notes in under a minute.</p>
          <button
            onClick={()=>{

            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 border border-pencil/25 rounded-lg py-2.5 text-sm font-semibold text-ink hover:bg-paper-card transition-colors mb-5 disabled:opacity-50"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="" className='w-5 h-5' />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-paper-line" />
            <span className="text-xs text-pencil-soft">or</span>
            <div className="flex-1 h-px bg-paper-line" />
          </div>

          <form onSubmit={async (e)=>{
            e.preventDefault();
            if(!validate()) return;
            setLoading(true);
            try{
              const res = await axios.post(`http://127.0.0.1:8000/signup`,
                {
                  name,
                  email,
                  password
                }
                
              )
              console.log(res.data.message);
              const newUser={
                id: res.data.id,
                name : res.data.name,
                email : res.data.email
              }
              setUser(newUser);
              navigate('/signin');
            }
            catch(error){
              setEmailError(error.response?.data?.message || "Something went wrong")
            }
            finally{
              setLoading(false);
            }
          }} className="space-y-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pencil-soft" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) =>{
                    setName(e.target.value);
                    setUserError('');
                  }}
                  placeholder="Rahul Ganesan"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-pencil/25 bg-paper-card text-sm text-ink placeholder:text-pencil-soft/70 focus:border-chalk-blue-dark outline-none "
                />
              </div>
              <span className='body text-[12px] text-[#ff2929] ml-1'>{userError}</span>
            </div>
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-pencil/25 bg-paper-card text-sm text-ink placeholder:text-pencil-soft/70 focus:border-chalk-blue-dark outline-none"
                />
              </div>
              <span className='body text-[12px] text-[#ff2929] ml-1'>{emailError}</span>
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPassError('');
                  }}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-pencil/25 bg-paper-card text-sm text-ink placeholder:text-pencil-soft/70 focus:border-chalk-blue-dark outline-none"
                />
              </div>
              <span className='text-[12px] text-[#ff2929] ml-1'>{passError}</span>
            </div>
            <button disabled={loading} type="submit" className='bg-amber-400/50 disabled:cursor-not-allowed flex items-center justify-center rounded-lg font-body font-semibold transition-colors duration-150 w-full text-black py-2 gap-2 text-[15px] hover:bg-amber-400 shadow-lg'>
                <span>Sign up</span>
                <ArrowRight size={18} className=''/>
            </button>
          </form>
          <p className="text-xs text-pencil-soft text-center mt-5">
            By continuing, you agree to the Terms of Service and Privacy Policy.
          </p>
          <p className="text-sm text-pencil-soft text-center mt-4">
            Already have an account?{' '}
            <button 
            onClick={()=>{
                navigate('/signin');
            }}
            className="text-ink font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </div>
        </div>
        {
          loading && (<LoadModal />)
        }
    </div>
  )
}

export default Signup

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import "@fontsource/fraunces";
import "@fontsource/plus-jakarta-sans";
import "@fontsource/caveat";
import "./index.css";
import App from './App.jsx'
import UserContext from './context/UserContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <UserContext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserContext>
  </GoogleOAuthProvider>
)

import { useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AuthPage() {
  const { login } = useAuth()
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  const [signUpFirstName, setSignUpFirstName] = useState('')
  const [signUpLastName, setSignUpLastName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpBirthday, setSignUpBirthday] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  // Derive state from URL
  const isSignUp = location.pathname === '/auth/sign-up'

  const toggleMode = () => {
    setErrorMsg('')
    setSuccessMsg('')
    navigate(isSignUp ? '/auth/sign-in' : '/auth/sign-up')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const response = await axios.post('http://localhost:8009/api/auth/login', {
        email: signInEmail,
        password: signInPassword
      })
      const data = response.data
      const userInfo = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role
      }
      login(data.token, userInfo)
      setSuccessMsg('Login successful!')
      if (data.role === 'ADMIN') {
        setTimeout(() => navigate('/admin/dashboard'), 800)
      } else if (data.role === 'DOCTOR') {
        setTimeout(() => navigate('/doctor/dashboard'), 800)
      } else {
        const from = location.state?.from || '/'
        setTimeout(() => navigate(from), 800)
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    let formattedBirthday = signUpBirthday;
    if (formattedBirthday && formattedBirthday.includes('-')) {
      const [year, month, day] = formattedBirthday.split('-');
      formattedBirthday = `${month}/${day}/${year}`;
    }

    try {
      const response = await axios.post('http://localhost:8009/api/auth/register', {
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
        birthday: formattedBirthday
      })
      login(response.data.token)
      setSuccessMsg('Registration successful!')
      const decoded = jwtDecode(response.data.token);
      if (decoded.role === 'ADMIN') {
        setTimeout(() => navigate('/admin/dashboard'), 1000)
      } else {
        setTimeout(() => navigate('/'), 1000)
      }
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          const firstKey = Object.keys(data)[0];
          setErrorMsg(data[firstKey]);
        }
      } else {
        setErrorMsg('Failed to register');
      }
    } finally {
      setLoading(false)
    }
  }

  // Common input styles
  const inputClass = "w-full bg-[#f8fcfc] border border-gray-200/50 rounded-xl px-4 py-3 text-sm text-[#1e6262] placeholder:text-[#1e6262]/40 outline-none focus:bg-white focus:border-[#b4f1f1] focus:ring-4 focus:ring-[#b4f1f1]/30 transition-all duration-300"

  const socialBtnClass = "flex items-center justify-center w-12 h-12 rounded-full border border-gray-200/60 text-gray-600 hover:bg-gray-50 hover:text-[#1e6262] transition-colors duration-300 shadow-sm"

  return (
    <div className="min-h-screen bg-[#ecfffb] flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden relative">

      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#b4f1f1]/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#2d767f]/20 blur-[120px] pointer-events-none" />

      {/* Back to Home Link */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#1e6262] font-semibold hover:text-[#2d767f] transition-colors z-20 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm ring-1 ring-[#1e6262]/10">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>

      {/* Main Container */}
      <div className="relative w-full max-w-[900px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(30,98,98,0.2)] overflow-hidden">

        {/* ─── Sign In Form Container ─── */}
        <div
          className={`absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col justify-center px-10 sm:px-16 transition-all duration-[800ms] ease-in-out ${isSignUp ? 'translate-x-[100%] opacity-0 z-0' : 'translate-x-0 opacity-100 z-10'
            }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#1e6262] tracking-tight">Sign in</h2>
            <div className="flex justify-center gap-4 mt-6">
              <button type="button" className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              </button>
              <button type="button" className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>
              </button>
              <button type="button" className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.34 2h-14.7C3.18 2 2 3.18 2 4.66v14.69C2 20.82 3.18 22 4.64 22h14.7c1.46 0 2.66-1.18 2.66-2.65V4.66C22 3.18 20.82 2 19.34 2zm-10.4 16H6V9h2.94v9zM7.47 7.68c-.94 0-1.7-.76-1.7-1.7s.76-1.7 1.7-1.7 1.7.76 1.7 1.7-.76 1.7-1.7 1.7zm10.47 10.32h-2.94v-4.3c0-1.02-.02-2.33-1.42-2.33-1.42 0-1.64 1.11-1.64 2.26v4.37h-2.94V9h2.82v1.23h.04c.39-.74 1.35-1.52 2.77-1.52 2.96 0 3.51 1.95 3.51 4.49v5.8h-.2z" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or use email</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {errorMsg && !isSignUp && <div className="p-3 bg-red-50 text-red-500 text-xs rounded-xl font-medium border border-red-100">{errorMsg}</div>}
            {successMsg && !isSignUp && <div className="p-3 bg-green-50 text-green-600 text-xs rounded-xl font-medium border border-green-100">{successMsg}</div>}

            <input type="email" placeholder="Email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} className={inputClass} required />
            <input type="password" placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} className={inputClass} required />
            <div className="text-right">
              <a href="#" className="text-xs font-bold text-[#2d767f] hover:text-[#1e6262] transition-colors">Forgot your password?</a>
            </div>
            <button disabled={loading} className="mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#1e6262] to-[#2d767f] text-white font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#1e6262]/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Mobile only switch button */}
          <div className="mt-8 text-center lg:hidden">
            <span className="text-sm text-gray-500">Don't have an account? </span>
            <button onClick={toggleMode} className="text-sm font-bold text-[#1e6262]">Sign up</button>
          </div>
        </div>

        {/* ─── Sign Up Form Container ─── */}
        <div
          className={`absolute top-0 left-0 w-full lg:w-1/2 h-full flex flex-col justify-center px-10 sm:px-16 transition-all duration-[800ms] ease-in-out ${isSignUp ? 'translate-x-0 lg:translate-x-[100%] opacity-100 z-10' : '-translate-x-[100%] opacity-0 z-0'
            }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#1e6262] tracking-tight">Create Account</h2>
            <div className="flex justify-center gap-4 mt-6">
              <button type="button" className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              </button>
              <button type="button" className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or register via email</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>
          </div>

          <form className="flex flex-col gap-3" onSubmit={handleRegister}>
            {errorMsg && isSignUp && <div className="p-3 bg-red-50 text-red-500 text-xs rounded-xl font-medium border border-red-100">{errorMsg}</div>}
            {successMsg && isSignUp && <div className="p-3 bg-green-50 text-green-600 text-xs rounded-xl font-medium border border-green-100">{successMsg}</div>}

            <div className="flex gap-3">
              <input type="text" placeholder="First Name" value={signUpFirstName} onChange={(e) => setSignUpFirstName(e.target.value)} className={inputClass} required />
              <input type="text" placeholder="Last Name" value={signUpLastName} onChange={(e) => setSignUpLastName(e.target.value)} className={inputClass} required />
            </div>

            <input type="email" placeholder="Email Address" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} className={inputClass} required />
            <input type="password" placeholder="Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} className={inputClass} required />

            <div className="relative">
              <input type="date" value={signUpBirthday} onChange={(e) => setSignUpBirthday(e.target.value)} className={`${inputClass} text-[#1e6262]/80 uppercase text-xs font-bold tracking-widest`} required />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none bg-transparent">BIRTHDAY</span>
            </div>

            <button disabled={loading} className="mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#1e6262] to-[#2d767f] text-white font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#1e6262]/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
          </form>

          {/* Mobile only switch button */}
          <div className="mt-8 text-center lg:hidden">
            <span className="text-sm text-gray-500">Already have an account? </span>
            <button onClick={toggleMode} className="text-sm font-bold text-[#1e6262]">Sign in</button>
          </div>
        </div>

        {/* ─── Overlay Container (Colored Panel) ─── */}
        <div
          className={`hidden lg:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-[800ms] ease-in-out z-20 ${isSignUp ? '-translate-x-full' : 'translate-x-0'
            }`}
        >
          {/* Overlay Background */}
          <div
            className={`absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-br from-[#1e6262] via-[#2d767f] to-[#1e6262] text-white transition-transform duration-[800ms] ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'
              }`}
          >

            {/* Decorative background shapes in the overlay */}
            <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] rounded-full border-[40px] border-white/10 opacity-50 backdrop-blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[450px] h-[450px] rounded-full border-[50px] border-white/10 opacity-50 backdrop-blur-3xl" />

            {/* Overlay Panels */}
            {/* Left Overlay Panel (Sign In Mode -> Shows text to jump to Sign Up) */}
            <div
              className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center transition-transform duration-[800ms] ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-[20%]'
                }`}
            >
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight">New Here?</h2>
              <p className="text-[#ecfffb] opacity-90 mb-8 max-w-[280px] leading-relaxed font-medium">
                Sign up and discover a premium, fast, and secure medical platform tailored for your needs.
              </p>
              <button
                onClick={toggleMode}
                className="px-10 py-3 rounded-full border border-white/60 bg-transparent text-white font-bold tracking-widest hover:bg-white hover:text-[#1e6262] transition-all duration-300 uppercase text-xs focus:ring-4 focus:ring-white/30 outline-none"
              >
                Sign Up
              </button>
            </div>

            {/* Right Overlay Panel (Sign Up Mode -> Shows text to jump to Sign In) */}
            <div
              className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center transition-transform duration-[800ms] ease-in-out ${isSignUp ? 'translate-x-[20%]' : 'translate-x-0'
                }`}
            >
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Welcome Back!</h2>
              <p className="text-[#ecfffb] opacity-90 mb-8 max-w-[280px] leading-relaxed font-medium">
                To stay connected with us, please login with your personal info and access your records securely.
              </p>
              <button
                onClick={toggleMode}
                className="px-10 py-3 rounded-full border border-white/60 bg-transparent text-white font-bold tracking-widest hover:bg-white hover:text-[#1e6262] transition-all duration-300 uppercase text-xs focus:ring-4 focus:ring-white/30 outline-none"
              >
                Sign In
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

// chaima: sliding panel animation

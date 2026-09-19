import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Building, Calendar, ArrowLeft, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { SkillSwapLogo } from './SkillSwapLogo';
import { apiClient } from '../api/client';
import { User } from '../types';

interface AuthModalProps {
  onSuccess: (user: User, token: string) => void;
  initialMode?: 'login' | 'register' | 'welcome';
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onSuccess,
  initialMode = 'login',
  onClose,
}) => {
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state (Representative Order)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (Representative Order)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regYear, setRegYear] = useState('3rd Year');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Please provide your email/username and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.login(loginIdentifier, loginPassword);
      onSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        college: regCollege.trim() || 'Engineering Institute',
        year: regYear,
      });
      onSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (userEmail: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.login(userEmail, 'password123');
      onSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // 1. WELCOME SCREEN (Image 7 Screen 1)
  if (mode === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-between min-h-[640px] p-8 text-center bg-gradient-to-b from-indigo-600 to-indigo-800 text-white rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full flex justify-end">
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 text-sm font-medium"
            >
              Skip
            </button>
          )}
        </div>

        <div className="my-auto flex flex-col items-center space-y-6">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            <SkillSwapLogo size="xl" inverted={true} />
          </div>

          <div className="space-y-2 max-w-xs">
            <p className="text-indigo-100 text-sm font-medium">
              Share your skills • Learn new skills • Build a better you
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs text-indigo-100">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>JWT Auth & AES-256 Storage at Rest</span>
          </div>
        </div>

        <div className="w-full space-y-3 pt-6">
          <button
            id="welcome-get-started-btn"
            onClick={() => setMode('register')}
            className="w-full py-3.5 px-6 rounded-xl bg-white text-indigo-700 font-bold text-base shadow-md hover:bg-indigo-50 transition active:scale-[0.98]"
          >
            Get Started
          </button>
          <button
            id="welcome-login-btn"
            onClick={() => setMode('login')}
            className="w-full py-3 px-6 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 border border-white/20 text-white font-semibold text-sm transition"
          >
            I Already Have an Account
          </button>
        </div>
      </div>
    );
  }

  // 2. LOGIN SCREEN (Representative Order from Image 7 Screen 2)
  if (mode === 'login') {
    return (
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        {/* Top Header with Back Arrow */}
        <div className="flex items-center justify-between mb-4">
          <button
            id="login-header-back-btn"
            type="button"
            onClick={() => {
              if (initialMode === 'welcome') {
                setMode('welcome');
              } else if (onClose) {
                onClose();
              } else {
                setMode('welcome');
              }
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-slate-800">Sign In</span>
          <div className="w-5" />
        </div>

        {/* Header with Logo */}
        <div className="mb-6 text-center">
          <SkillSwapLogo size="lg" showSubtitle={true} />
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <KeyRound className="w-3.5 h-3.5" />
            <span>JWT Session Authentication</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Representative Order: Field 1 (Email or Username), Field 2 (Password) */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email or username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="login-identifier-input"
                type="text"
                placeholder="john.doe@college.edu"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link has been dispatched to your verified email address.')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* OR divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
              OR
            </span>
          </div>
        </div>

        {/* Continue with Google */}
        <button
          id="login-google-btn"
          type="button"
          onClick={() => handleQuickDemo('john.doe@college.edu')}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Quick Demo Fill Buttons for Testing */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Quick Test Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('john.doe@college.edu')}
              className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 text-xs rounded-lg font-medium text-left truncate transition"
            >
              👤 John Doe (Demo)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('alex.kumar@college.edu')}
              className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 text-xs rounded-lg font-medium text-left truncate transition"
            >
              👨‍💻 Alex Kumar (Tutor)
            </button>
          </div>
        </div>

        {/* Footer Toggle */}
        <div className="mt-6 text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <button
            id="toggle-to-signup-btn"
            type="button"
            onClick={() => {
              setError(null);
              setMode('register');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-bold ml-1"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // 3. CREATE ACCOUNT / SIGN UP SCREEN (Representative Order from Image 7 Screen 3)
  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      {/* Top Header with Back Arrow & Title */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMode('login')}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-slate-800">Create Account</span>
        <div className="w-5" />
      </div>

      {/* Logo */}
      <div className="mb-5 text-center">
        <SkillSwapLogo size="md" showSubtitle={true} />
        <p className="mt-1 text-xs text-slate-500">
          Personal data encrypted with AES-256-GCM at rest
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Representative Order:
          1. Full Name
          2. Email
          3. Password
          4. College Name
          5. Year
      */}
      <form onSubmit={handleRegister} className="space-y-3.5">
        {/* Field 1: Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              id="signup-fullname-input"
              type="text"
              placeholder="e.g. John Doe"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Field 2: Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="signup-email-input"
              type="email"
              placeholder="student@college.edu"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Field 3: Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="signup-password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Field 4: College Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            College Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building className="w-4 h-4" />
            </div>
            <input
              id="signup-college-input"
              type="text"
              placeholder="e.g. National Institute of Technology"
              value={regCollege}
              onChange={(e) => setRegCollege(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Field 5: Year */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Year
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <select
              id="signup-year-select"
              value={regYear}
              onChange={(e) => setRegYear(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
        </div>

        <button
          id="signup-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      {/* Footer Toggle */}
      <div className="mt-5 text-center text-xs text-slate-600">
        Already have an account?{' '}
        <button
          id="toggle-to-login-btn"
          type="button"
          onClick={() => {
            setError(null);
            setMode('login');
          }}
          className="text-indigo-600 hover:text-indigo-800 font-bold ml-1"
        >
          Login
        </button>
      </div>
    </div>
  );
};

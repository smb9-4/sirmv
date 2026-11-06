import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  GraduationCap, Users, Eye, EyeOff, Lock, User, Mail,
  AlertCircle, ArrowLeft, ShieldCheck, KeyRound, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROFESSOR_1, PROFESSOR_2 } from '../rosterData';
import InstitutionHeader from '../components/InstitutionHeader';

export default function LoginPage() {
  const { role: initialRole } = useParams<{ role?: string }>();
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();

  const [role, setRole] = useState<'student' | 'professor'>(
    initialRole === 'professor' ? 'professor' : 'student'
  );

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate('/professor/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  // Synchronize role with URL if changed
  useEffect(() => {
    if (initialRole === 'professor' || initialRole === 'student') {
      setRole(initialRole);
    }
    setErrorMsg('');
  }, [initialRole]);

  const handleRoleSwitch = (newRole: 'student' | 'professor') => {
    setRole(newRole);
    setErrorMsg('');
    setIdentifier('');
    setPassword('');
  };

  const handleQuickDemoFillStudent = (roll = '23CSE001') => {
    setIdentifier(roll);
    setPassword('student123');
    setErrorMsg('');
  };

  const handleQuickDemoFillProf = (profEmail: string) => {
    setIdentifier(profEmail);
    setPassword('prof123');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg(role === 'student' ? 'Please enter your Roll Number' : 'Please enter your Official Email ID');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    try {
      const success = await login({
        identifier: identifier.trim(),
        password,
        role,
      });

      if (success) {
        if (role === 'student') {
          navigate('/student/dashboard');
        } else {
          navigate('/professor/dashboard');
        }
      } else {
        setErrorMsg(
          role === 'student'
            ? 'Invalid Roll Number or Password. Use Demo Roll: 23CSE001 to 23CSE100 (Pass: student123)'
            : 'Invalid Email ID or Password. Use: priya.nayak@sirmv.edu.in or ravi.shankar@sirmv.edu.in (Pass: prof123)'
        );
      }
    } catch {
      setErrorMsg('Authentication service encountered an unexpected error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-institutional-bg flex flex-col font-sans">
      <InstitutionHeader />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-maroon-deep mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Return to Homepage
          </Link>

          {/* Main Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-institutional-border overflow-hidden">
            {/* Top Branding Banner */}
            <div
              className="p-6 text-white text-center relative"
              style={{
                background: role === 'student'
                  ? 'linear-gradient(135deg, #500000 0%, #650000 70%, #A60000 100%)'
                  : 'linear-gradient(135deg, #222222 0%, #343434 70%, #500000 100%)'
              }}
            >
              <div className="inline-block p-2.5 bg-white/10 rounded-xl mb-3 backdrop-blur-sm border border-white/20">
                <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
              </div>
              <h2 className="text-xl font-bold tracking-wide">
                {role === 'student' ? 'Student Academic Login' : 'Faculty / Professor Login'}
              </h2>
              <p className="text-xs text-white/80 mt-1">
                SIR MV GROUP OF INSTITUTIONS PORTAL
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex border-b border-institutional-border bg-gray-50 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleRoleSwitch('student')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 transition-all ${
                  role === 'student'
                    ? 'bg-white text-crimson border-b-2 border-crimson'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <GraduationCap size={16} /> Student Login (100 Enrolled)
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch('professor')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 transition-all ${
                  role === 'professor'
                    ? 'bg-white text-crimson border-b-2 border-crimson'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Users size={16} /> Professor Login (2 Faculty)
              </button>
            </div>

            {/* Form Area */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Validation error display */}
              {errorMsg && (
                <div
                  className="p-3 rounded-lg flex items-start gap-2.5 text-xs font-medium border"
                  style={{ backgroundColor: '#FFF0F0', borderColor: '#F37F84', color: '#900000' }}
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Identifier field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {role === 'student' ? 'University Roll Number' : 'Official Faculty Email ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    {role === 'student' ? <User size={18} /> : <Mail size={18} />}
                  </div>
                  <input
                    type={role === 'student' ? 'text' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. 23CSE001 (or 23CSE001-100)' : 'e.g. priya.nayak@sirmv.edu.in'}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-institutional-border focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition"
                    autoComplete={role === 'student' ? 'username' : 'email'}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-11 py-2.5 text-sm rounded-lg border border-institutional-border focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent transition"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options: Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-crimson focus:ring-crimson"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-medium text-crimson hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all duration-200"
                style={{
                  backgroundColor: '#A60000',
                  opacity: isLoading ? 0.75 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Sign In to Portal</span>
                  </>
                )}
              </button>

              {/* Quick Demo Fill Options */}
              <div className="pt-3 border-t border-institutional-border space-y-2">
                <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-600" /> Quick 1-Click Demo Profiles:
                </span>

                {role === 'student' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFillStudent('23CSE001')}
                      className="p-2 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left transition"
                    >
                      <strong className="block text-gray-900 text-[11px]">Rahul Sharma</strong>
                      <span className="text-[10px] text-gray-600">23CSE001 (Sec A)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFillStudent('23CSE055')}
                      className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left transition"
                    >
                      <strong className="block text-gray-900 text-[11px]">Prajwal M</strong>
                      <span className="text-[10px] text-gray-600">23CSE055 (Sec B)</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFillProf(PROFESSOR_1.email)}
                      className="p-2 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left transition"
                    >
                      <strong className="block text-gray-900 text-[11px]">Dr. Priya Nayak</strong>
                      <span className="text-[10px] text-gray-600">Assoc. Prof (CSE)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFillProf(PROFESSOR_2.email)}
                      className="p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left transition"
                    >
                      <strong className="block text-gray-900 text-[11px]">Prof. Ravi Shankar</strong>
                      <span className="text-[10px] text-gray-600">HOD (CSE Dept)</span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Security Assurance */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={16} className="text-green-600" />
            <span>256-Bit SSL Encrypted Institutional Session</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-institutional-border">
            <div className="flex items-center gap-3 text-crimson mb-3">
              <KeyRound size={24} />
              <h3 className="text-lg font-bold text-gray-900">Password Reset Request</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              For security compliance, student and faculty passwords cannot be reset automatically online. Please contact your Department Exam Coordinator or the Central Academic IT Cell.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1 text-gray-700 border border-gray-200 mb-5">
              <p>📍 <strong>Office:</strong> Academic Section, Ground Floor, Admin Block</p>
              <p>📞 <strong>Helpline:</strong> 08192-224455 (Ext. 104)</p>
              <p>✉ <strong>Email:</strong> registrar@sirmv.edu.in</p>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-full font-bold text-white text-xs"
              style={{ backgroundColor: '#650000' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

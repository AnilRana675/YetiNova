import { useState } from 'react';
import logo from '../assets/YetiNovaLogo.svg';
import { 
  Rocket, 
  Loader2, 
  CheckCircle2, 
  Mail
} from 'lucide-react';

export function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
    console.log('Email submitted:', email);
  };

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
      <div className="glass-card w-full max-w-lg p-8 md:p-12 text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={logo}
            alt="YetiNova AI"
            className="relative w-32 h-32 mx-auto rounded-2xl shadow-lg object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Company Name */}
        <h2 className="text-slate-600 text-lg font-medium tracking-wide mb-2">
          YetiNova AI Tech Pvt. Ltd.
        </h2>

        {/* Coming Soon Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text pb-1">
          Coming Soon
        </h1>

        {/* Tagline */}
        <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          We're building the cognitive infrastructure of tomorrow. 
          <br className="hidden sm:block" />
          Join us on the journey to AGI.
        </p>

        {/* Rocket Icon */}
        <div className="flex items-center justify-center gap-2 text-cyan-600 mb-8 bg-cyan-50/50 py-2 px-4 rounded-full w-fit mx-auto border border-cyan-100">
          <Rocket className="w-5 h-5 animate-bounce" />
          <span className="font-medium">Launching Q4 2026</span>
        </div>

        {/* Email Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email address"
                disabled={loading}
                className={`w-full pl-12 pr-5 py-4 rounded-xl border bg-white/90 
                         text-slate-800 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                         transition-all duration-300 disabled:opacity-70
                         ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
              />
              {error && (
                <p className="absolute -bottom-6 left-0 text-sm text-red-500 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-teal-600 to-cyan-500
                       hover:from-teal-700 hover:to-cyan-600
                       disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed
                       transform hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-300 shadow-lg shadow-cyan-500/25
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                'Get Notified'
              )}
            </button>
          </form>
        ) : (
          <div className="py-8 px-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-cyan-200 mb-8 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-teal-800 mb-1">You're on the list!</h3>
            <p className="text-teal-600">
              We'll notify you as soon as we launch.
            </p>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-sm text-slate-400 flex items-center justify-center gap-4">
          <span>© 2026 YetiNova AI</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { supabase } from '../lib/supabase';
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
    
    try {
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (supabaseError) {
        if (supabaseError.code === '23505') { // Unique violation
          setSubmitted(true);
        } else {
          throw supabaseError;
        }
      }
      
      setSubmitted(true);
      console.log('Email submitted:', email);
    } catch (err) {
      console.error('Error submitting email:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // CONTAINER: Uses 100svh to ensure full screen fit on mobile browsers
    <div className="relative z-10 flex items-center justify-center h-[100svh] w-full px-4 overflow-hidden">
      
      {/* CARD: 
          1. max-h-[90svh]: Never touches the very edge of the screen.
          2. flex flex-col: Allows us to distribute space.
          3. overflow-y-auto: Safety scroll ONLY inside card for landscape phones.
      */}
      <div className="glass-card w-full max-w-lg max-h-[95svh] flex flex-col justify-center p-6 md:p-12 text-center animate-fade-in mx-auto overflow-y-auto custom-scrollbar">
        
        {/* LOGO GROUP */}
        <div className="shrink-0 mb-4 md:mb-8 relative group mx-auto">
          <div className="absolute inset-0 bg-[rgb(183,205,122)] blur-xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          {/* Logo scales smaller on mobile (w-16) to save vertical space */}
          <img
            src={logo}
            alt="YetiNova Logo"
            className="relative w-16 h-16 md:w-32 md:h-32 mx-auto rounded-2xl shadow-lg object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* TEXT CONTENT GROUP */}
        <div className="shrink-0">
          <h2 className="text-[rgb(102,102,102)] text-xs md:text-lg font-medium tracking-wide mb-1 md:mb-2">
            YetiNova AI Tech Pvt. Ltd.
          </h2>

          <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 text-[rgb(4,62,102)] pb-1">
            Coming Soon
          </h1>

          <p className="text-[rgb(102,102,102)] text-xs md:text-lg mb-4 md:mb-8 max-w-md mx-auto leading-relaxed">
            We're building the cognitive infrastructure of tomorrow. 
            <br className="hidden sm:block" />
            Join us on the journey to AGI.
          </p>

          <div className="flex items-center justify-center gap-2 text-[rgb(4,62,102)] mb-4 md:mb-8 bg-[rgb(232,233,237)]/80 py-1.5 px-3 md:py-2 md:px-4 rounded-full w-fit mx-auto border border-[rgb(183,205,122)] text-xs md:text-base">
            <Rocket className="w-3 h-3 md:w-5 md:h-5 animate-bounce" />
            <span className="font-medium">Launching Q4 2026</span>
          </div>
        </div>

        {/* FORM GROUP */}
        <div className="w-full">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 mb-2 md:mb-8">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(102,102,102)]">
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
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
                  // Input padding reduced slightly on mobile
                  className={`w-full pl-10 md:pl-12 pr-4 md:pr-5 py-2.5 md:py-4 rounded-xl border bg-white/80 
                            text-sm md:text-base text-[rgb(4,53,60)] placeholder:text-[rgb(102,102,102)]
                            focus:outline-none focus:ring-2 focus:ring-[rgb(85,184,96)] focus:border-transparent
                            transition-all duration-300 disabled:opacity-70
                            ${error ? 'border-red-300 focus:ring-red-200' : 'border-[rgb(232,233,237)]'}`}
                />
                {error && (
                  <p className="absolute -bottom-5 md:-bottom-6 left-0 text-[10px] md:text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 md:py-4 rounded-xl font-semibold text-white text-sm md:text-base
                          bg-[rgb(3,110,56)]
                          hover:bg-[rgb(85,184,96)]
                          disabled:bg-[rgb(102,102,102)] disabled:cursor-not-allowed
                          transform hover:scale-[1.02] active:scale-[0.98]
                          transition-all duration-300 shadow-lg shadow-[rgba(3,110,56,0.2)]
                          flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  'Get Notified'
                )}
              </button>
            </form>
          ) : (
            <div className="py-4 md:py-8 px-4 rounded-xl bg-[rgb(232,233,237)]/90 border border-[rgb(183,205,122)] mb-2 md:mb-8 animate-in fade-in zoom-in duration-300">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-[rgb(3,110,56)]">
                <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-xl font-bold text-[rgb(3,110,56)] mb-1">You're on the list!</h3>
              <p className="text-xs md:text-base text-[rgb(102,102,102)]">
                We'll notify you as soon as we launch.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="shrink-0 mt-2 md:mt-0 text-[10px] md:text-sm text-[rgb(102,102,102)] flex items-center justify-center gap-4">
          <span>&copy; 2026 YetiNova AI-Tech Pvt. Ltd.</span>
        </div>
      </div>
    </div>
  );
}
import React, { useState, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LogIn, UserPlus, Send, AlertTriangle } from 'lucide-react'; // Icons from your package.json

// Environment variables from your .env file
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

// Define component properties for a cleaner interface
interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // --- Animation Classes (Tailwind CSS) ---
  const pulseShadow = 'shadow-xl shadow-indigo-500/30 transition-shadow duration-500 ease-in-out hover:shadow-2xl';
  const buttonStyle = 'flex items-center justify-center space-x-2 w-full py-3 rounded-lg font-semibold transition-colors duration-200';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    let authResponse;
    
    try {
      if (isSignUp) {
        // Sign-Up Logic
        authResponse = await supabase.auth.signUp({ email, password });
      } else {
        // Log-In Logic
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      }

      const { data, error: authError } = authResponse;

      if (authError) {
        setError(authError.message);
      } else if (isSignUp && data.user && data.user.identities && data.user.identities.length === 0) {
        // Successful sign-up often requires email confirmation
        setMessage('Registration successful! Please check your email to confirm your account.');
        setIsSignUp(false); // Switch back to login view
      } else if (data.user) {
        // Successful login
        onLoginSuccess();
      } else {
        setError("An unknown error occurred.");
      }
    } catch (err) {
      setError("Network or API error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Create a New Account' : 'Sign in to Study Plan'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`bg-white py-8 px-4 ${pulseShadow} sm:rounded-lg sm:px-10`}>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center" role="alert">
              <AlertTriangle className="mr-2" size={20} />
              <p>{error}</p>
            </div>
          )}
          
          {/* Success Message (for email confirmation) */}
          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-center" role="alert">
              <Send className="mr-2" size={20} />
              <p>{message}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${buttonStyle} ${
                isSignUp 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading 
                ? 'Processing...' 
                : isSignUp 
                ? <><UserPlus size={20} /> Sign Up</>
                : <><LogIn size={20} /> Sign In</>
              }
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional: You can see the visual design here (The final component will be rendered with the code provided) 
//
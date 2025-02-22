import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignIn() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
  
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
  
        if (error?.message.includes('already registered')) {
          setError('This email is already registered.');
          setMessage('Please sign in instead.');
          setIsSignUp(false);
          return;
        }
  
        if (error) throw error;
  
        setMessage('Account created successfully! You can now sign in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (error) {
      // Type-safe error handling
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }
  // Floating elements animation variants
  const floatingElements = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  };

  const floatingCircle = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.2 }}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(50px)'
            }}
          />
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
        >
          <motion.div 
            className="flex items-center justify-center mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative">
              <motion.div
                animate={floatingCircle.animate}
                className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50"
              />
              <Building2 size={40} className="text-white relative" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center text-white mb-8"
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </motion.h1>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 text-red-200 p-4 rounded-lg mb-4"
            >
              {error}
              {message && (
                <p className="mt-2 text-sm text-red-200/80">{message}</p>
              )}
            </motion.div>
          )}

          {!error && message && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-500/10 text-green-200 p-4 rounded-lg mb-4"
            >
              {message}
            </motion.div>
          )}

          <motion.form
            variants={floatingElements}
            initial="initial"
            animate="animate"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <motion.div variants={floatingElements}>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-white/50"
                required
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div variants={floatingElements}>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-white/50"
                required
                minLength={6}
                placeholder="Enter your password"
              />
              <p className="mt-1 text-sm text-white/50">
                {isSignUp && 'Must be at least 6 characters'}
              </p>
            </motion.div>

            <motion.button
              variants={floatingElements}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </motion.button>

            <motion.div 
              variants={floatingElements}
              className="text-center text-sm text-white/80"
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setMessage('');
                }}
                className="text-white hover:text-blue-200 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
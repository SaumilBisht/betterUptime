"use client"
import React, { useState } from 'react';
import { Monitor, ArrowRight, Mail, Lock, Send } from 'lucide-react';

export default function Signin() 
{
  const [step, setStep] = useState<'email' | 'password' | 'magic-link-sent'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password login
    console.log('Login with password:', { email, password });
  };

  const handleMagicLink = () => {
    // Send magic link
    setStep('magic-link-sent');
  };

  if (step === 'magic-link-sent') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full mx-auto mb-6">
              <Send className="h-8 w-8 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Magic link sent</h2>
            <p className="text-gray-400 mb-6">
              We've sent a sign-in link to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to sign in to your account.
            </p>
            <button
              onClick={() => setStep('email')}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              Use a different email address
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Monitor className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-white">Better Stack</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Signin Form */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-orange-400 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Signing in as:</span>
                  <button
                    onClick={() => setStep('email')}
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                  >
                    Change email
                  </button>
                </div>
                <div className="bg-black border border-gray-700 rounded-lg p-3 mb-6">
                  <span className="text-white font-medium">{email}</span>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-orange-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">or</span>
                </div>
              </div>

              <button
                onClick={handleMagicLink}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-700 flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send me a magic link</span>
              </button>

              <div className="text-center">
                <a href="#" className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="/signup" className="text-orange-400 hover:text-orange-300 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"
import React, { useState } from 'react';
import { Monitor, ArrowRight, Mail, Check } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-6">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
            <p className="text-gray-400 mb-6">
              We've sent a verification link to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to complete your account setup and create your password.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
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
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Start monitoring your applications today</p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full bg-orange-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-orange-300 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue with email</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/signin" className="text-orange-400 hover:text-orange-300 font-medium">
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-orange-400 hover:text-orange-300">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span>14-day free trial, no credit card required</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span>Monitor up to 3 websites for free</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
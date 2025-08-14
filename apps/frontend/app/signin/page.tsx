"use client"
import React, { useState } from 'react';
import { Monitor, ArrowRight, Mail,  Eye } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function Signin() 
{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('');
  const router=useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${BACKEND_URL}/user/signin`, { email, password },{ withCredentials: true });
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||   
        'Something went wrong. Please try again.';
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Monitor className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-white">Better Stack</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account</p>
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter Password"
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

            <div className="mt-2 text-center">
            <p className="text-red-600 hover:text-red-300 font-medium">
              {error}
            </p>
          </div>
          

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
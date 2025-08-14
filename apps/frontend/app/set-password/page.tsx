"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from 'react';
import { Monitor, ArrowRight, Mail, Check } from 'lucide-react';
import { BACKEND_URL } from "@/lib/utils";
import axios from "axios";

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [password, setPassword] = useState('');
  const router=useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${BACKEND_URL}/user/set-password`, { email, password });
      router.push("/dashboard");
    } catch (err: any) {
      const errorMsg = 
        err.response?.data?.error || 
        'Something went wrong. Please try again.';
      setError(errorMsg);
    }
  };
  
  if(!email)
  {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Monitor className="h-8 w-8 text-orange-500" />
                  <span className="text-xl font-bold text-white">Better Stack</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">OOPS... You're not Authenticated</h1>
                
              </div>
            </div>
          </div>
    )
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Monitor className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-white">Better Stack</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set Your Password</h1>
          <p className="text-gray-400">For Email: {email}</p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Enter Password
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-orange-300 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Proceed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
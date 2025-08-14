"use client"
import React from 'react';
import { Monitor, Menu, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/lib/utils';
import axios from 'axios';

interface DashboardHeaderProps {
  isAuthenticated: boolean;
}

export function DashboardHeader({ isAuthenticated }: DashboardHeaderProps) 
{
  const router=useRouter();
  const removeCookie = async () => {
    console.log("Signout clicked");
    try {
      await axios.post(`${BACKEND_URL}/user/signout`, {}, { withCredentials: true });
    } catch (e) {
      console.error("Signout failed:", e);
    } finally {
      console.log("Redirecting to /signin");
      router.push("/signin");
    }
  };
  
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2" onClick={()=>router.push("/")}>
              <Monitor className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Better Stack</span>
            </div>

          </div>
          {(isAuthenticated)?
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-gray-300 hover:text-white transition-colors"
            onClick={()=>router.push("/signin")}>
              Sign Out
            </button>
          </div>
          :
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-gray-300 hover:text-white transition-colors"
            onClick={()=>router.push("/signin")}>
              Sign in
            </button>
            <button className="bg-orange-500 text-black px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors font-medium"
            onClick={()=>router.push("/signup")}>
              Start free trial
            </button>
            <button className="lg:hidden p-2">
              <Menu className="h-6 w-6 text-gray-300" />
            </button>
          </div>
          }
        </div>
      </div>
    </header>
  );
}

"use client"
import React from 'react';
import { Monitor, Menu, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const router=useRouter();
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2" onClick={()=>router.push("/")}>
              <Monitor className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Better Stack</span>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                  <span>Products</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Docs</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Changelog</a>
            </nav>
          </div>
          
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
        </div>
      </div>
    </header>
  );
}
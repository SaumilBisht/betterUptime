import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-black py-20 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700">
              🚀 Trusted by 100,000+ developers worldwide
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Better Stack
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Logs & Uptime
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
            Logs, uptime monitoring, status pages, and incident management in one platform. 
            See why developers love our tools for keeping their applications running smoothly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-orange-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-400 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2">
              <span>Start free trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:text-white transition-colors border border-gray-700 hover:border-gray-600 flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Watch demo</span>
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <span>✓ 14-day free trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
      
      {/* Dashboard preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="bg-black rounded-lg p-6 font-mono text-sm">
              <div className="text-green-400 mb-2">$ better-stack logs --tail</div>
              <div className="text-gray-400 space-y-1">
                <div>[2025-01-27 10:30:15] INFO: Application started successfully</div>
                <div>[2025-01-27 10:30:16] INFO: Database connection established</div>
                <div className="text-orange-400">[2025-01-27 10:30:17] WARN: High memory usage detected</div>
                <div className="text-red-400">[2025-01-27 10:30:18] ERROR: Failed to process request</div>
                <div className="text-blue-400">[2025-01-27 10:30:19] DEBUG: Retrying connection...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
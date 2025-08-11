"use client"
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { WebsiteTable } from '../../components/WebsiteTable';
import { AddWebsiteModal } from '../../components/AddWebsiteModal';
import { Website } from '../../lib/types';

export default function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([
    {
      id: '1',
      name: 'Google',
      url: 'https://google.com',
      status: 'up',
      lastChecked: new Date(),
      responseTime: 45
    },
    {
      id: '2',
      name: 'Example Site',
      url: 'https://example-down-site.com',
      status: 'down',
      lastChecked: new Date(Date.now() - 300000),
      responseTime: undefined
    },
    {
      id: '3',
      name: 'GitHub',
      url: 'https://github.com',
      status: 'up',
      lastChecked: new Date(Date.now() - 120000),
      responseTime: 120
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const addWebsite = (website: Omit<Website, 'id'>) => {
    const newWebsite: Website = {
      ...website,
      id: Math.random().toString(36).substr(2, 9),
    };
    setWebsites([...websites, newWebsite]);
    setIsModalOpen(false);
  };

  const deleteWebsite = (id: string) => {
    setWebsites(websites.filter(site => site.id !== id));
  };

  const upSites = websites.filter(site => site.status === 'up').length;
  const downSites = websites.filter(site => site.status === 'down').length;

  return (
    <div className="min-h-screen bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Website Monitor
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent ml-2">
                    Dashboard
                  </span>
                </h1>
                <p className="text-gray-400 mt-2">Monitor your websites and track their uptime status</p>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Website</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Websites</p>
                  <p className="text-3xl font-bold text-white">{websites.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Sites Up</p>
                  <p className="text-3xl font-bold text-green-400">{upSites}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Sites Down</p>
                  <p className="text-3xl font-bold text-red-400">{downSites}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Website Table */}
          <WebsiteTable websites={websites} onDelete={deleteWebsite} />
        </div>

        {/* Add Website Modal */}
        <AddWebsiteModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addWebsite}
        />
      </div>
    </div>
  );
}
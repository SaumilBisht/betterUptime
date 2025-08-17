import React from 'react';
import { ExternalLink, Clock, Trash2 } from 'lucide-react';
import { Website } from '../lib/types';

interface WebsiteTableProps {
  websites: Website[];
  onDelete: (id: string) => void;
}

export function WebsiteTable({ websites, onDelete }: WebsiteTableProps) {
  const formatLastChecked = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (websites.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No websites yet</h3>
        <p className="text-gray-400 mb-6">
          Add your first website to start monitoring its uptime
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Monitored Websites</h2>
        <p className="text-gray-400 text-sm mt-1">
          Track the status and performance of your websites
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                Website
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                Response Time
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                Last Checked
              </th>
              <th className="text-right py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {websites.map((website, index) => (
              <tr
                key={website.id}
                className={`hover:bg-gray-800/50 transition-colors ${
                  index % 2 === 0 ? 'bg-gray-900/50' : 'bg-transparent'
                }`}
              >
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-400 flex items-center space-x-1">
                    <ExternalLink className="h-3 w-3" />
                    <a
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400 transition-colors"
                    >
                      {website.url}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      website.status === 'Up'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        website.status === 'Up' ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    ></div>
                    {website.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-300">
                    {website.responseTime ? `${website.responseTime}ms` : '—'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-400 flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatLastChecked(website.lastChecked)}</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <a
                    href={`/website/${website.id}/actions`}
                    className="text-gray-400 hover:text-orange-400 transition-colors p-1 hover:bg-orange-500/10 rounded"
                    title="View last 10 checks"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => onDelete(website.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded"
                    title="Delete website"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
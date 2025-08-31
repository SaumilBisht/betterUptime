import React from 'react';
import { ExternalLink, Clock, Trash2 } from 'lucide-react';
import { Website } from '../lib/types';

interface WebsiteTableProps {
  websites: Website[];
  onDelete: (id: string) => void;
}

export function WebsiteTable({ websites, onDelete }: WebsiteTableProps) {

  const formatLastChecked = (date?: Date | null | string) => {
  if (!date) return 'Just now';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Just now';

  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
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
        <table className="w-full min-w-max">
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
                <td className="py-4 px-6 max-w-xs">
                  <div className="text-sm text-gray-400 flex items-center space-x-1 overflow-hidden">
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    <a
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400 transition-colors truncate block max-w-full"
                      title={website.url} // show full URL on hover
                    >
                      {website.url}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {['india', 'usa'].map(region => {
                    const status = region === 'india' ? website.indiaStatus : website.usStatus;
                    const response = region === 'india' ? website.indiaResponse : website.usResponse;
                    const colors = statusColor(status);

                    return (
                      <div key={region} className="mb-1 last:mb-0">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors.span}`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${colors.dot}`}></div>
                          {region}: {status || 'Unknown'}
                        </span>
                      </div>
                    );
                  })}
                </td>

                <td className="py-4 px-6">
                  <div className="text-gray-300 text-sm">
                    IN: {website.indiaResponse !== null && website.indiaResponse !== undefined ? `${website.indiaResponse}ms` : '—'}<br/>
                    US: {website.usResponse !== null && website.usResponse !== undefined ? `${website.usResponse}ms` : '—'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-400 flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatLastChecked(website.lastCheckedIndia)}</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <a
                      href={`/website/${website.id}`}
                      className="flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors p-1 hover:bg-orange-500/10 rounded"
                      title="View last 10 checks"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => onDelete(website.id)}
                      className="flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded"
                      title="Delete website"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function statusColor(status: string) {
  switch (status) {
    case 'Up':
      return {
        span: 'bg-green-500/10 text-green-400 border-green-500/20',
        dot: 'bg-green-400'
      };
    case 'Down':
      return {
        span: 'bg-red-500/10 text-red-400 border-red-500/20',
        dot: 'bg-red-400'
      };
    default:
      return {
        span: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        dot: 'bg-yellow-400'
      };
  }
}
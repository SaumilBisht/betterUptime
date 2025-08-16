import React, { useState } from 'react';
import { X, Globe, AlertCircle } from 'lucide-react';
import { Website } from '../lib/types';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (website: Pick<Website, 'url'>) => void; 
}

export function AddWebsiteModal({ isOpen, onClose, onAdd }: AddWebsiteModalProps) {
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState<{ url?: string }>({});

  const validateForm = () => {
    const newErrors: { url?: string } = {};

    if (!url.trim()) {
      newErrors.url = 'Website URL is required';
    } else {
      try {
        new URL(url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;

      onAdd({ url: formattedUrl });

      setUrl('');
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-2xl rounded-2xl border border-gray-800 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Globe className="h-6 w-6 text-orange-500" />
              <span>Add Website</span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                Website URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://mywebsite.com"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.url ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
                }`}
              />
              {errors.url && (
                <div className="flex items-center space-x-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.url}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                Add Website
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
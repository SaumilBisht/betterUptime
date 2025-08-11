import React from 'react';
import { 
  FileText, 
  Activity, 
  Globe, 
  Bell, 
  BarChart3, 
  Shield,
  Zap,
  Users
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Logs',
    description: 'Centralized logging with powerful search, real-time streaming, and intelligent alerts.',
    color: 'text-blue-400'
  },
  {
    icon: Activity,
    title: 'Uptime Monitoring',
    description: 'Monitor your websites and APIs from 15+ locations worldwide with sub-second precision.',
    color: 'text-green-400'
  },
  {
    icon: Globe,
    title: 'Status Pages',
    description: 'Beautiful, customizable status pages to keep your users informed during incidents.',
    color: 'text-purple-400'
  },
  {
    icon: Bell,
    title: 'Incident Management',
    description: 'Streamlined incident response with automated escalation and team collaboration.',
    color: 'text-orange-400'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Comprehensive dashboards with performance metrics and trend analysis.',
    color: 'text-pink-400'
  },
  {
    icon: Shield,
    title: 'SSL Monitoring',
    description: 'Automatic SSL certificate monitoring with expiration alerts and security checks.',
    color: 'text-cyan-400'
  },
  {
    icon: Zap,
    title: 'Fast Alerts',
    description: 'Get notified instantly via email, SMS, Slack, or webhook when issues are detected.',
    color: 'text-yellow-400'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with shared dashboards, on-call schedules, and escalation policies.',
    color: 'text-red-400'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need in one platform
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From logs to uptime monitoring, we've got all your observability needs covered
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-gray-700 group"
            >
              <div className={`flex items-center justify-center w-12 h-12 bg-gray-800 rounded-lg mb-4 group-hover:bg-gray-700 transition-colors`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
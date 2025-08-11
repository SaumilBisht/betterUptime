import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for personal projects and getting started',
    features: [
      '1 GB logs per month',
      '3 uptime monitors',
      '1 status page',
      'Email alerts',
      '7-day data retention',
      'Community support'
    ],
    popular: false,
    buttonText: 'Get started for free',
    buttonStyle: 'bg-gray-700 text-white hover:bg-gray-600'
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/month',
    description: 'For growing teams and production applications',
    features: [
      '10 GB logs per month',
      '20 uptime monitors',
      '5 status pages',
      'SMS + Email + Slack alerts',
      '30-day data retention',
      'Team collaboration',
      'Advanced analytics',
      'Priority support'
    ],
    popular: true,
    buttonText: 'Start free trial',
    buttonStyle: 'bg-orange-500 text-black hover:bg-orange-400'
  },
  {
    name: 'Team',
    price: '$50',
    period: '/month',
    description: 'For larger teams with advanced requirements',
    features: [
      '50 GB logs per month',
      'Unlimited monitors',
      'Unlimited status pages',
      'All notification channels',
      '90-day data retention',
      'Advanced team features',
      'Custom integrations',
      'SLA guarantees',
      'Dedicated support'
    ],
    popular: false,
    buttonText: 'Start free trial',
    buttonStyle: 'bg-gray-700 text-white hover:bg-gray-600'
  }
];

export function Pricing() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-400">
            Start free, scale as you grow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-gray-900 rounded-2xl p-8 border transition-all ${
                plan.popular 
                  ? 'border-orange-500 ring-1 ring-orange-500 scale-105' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-black px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${plan.buttonStyle}`}>
                <span>{plan.buttonText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400">
            All paid plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
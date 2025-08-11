import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Johnson',
    title: 'Senior DevOps Engineer at Stripe',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    content: 'Better Stack transformed how we handle incidents. The log aggregation is incredibly fast and the alerting is spot-on.',
    rating: 5
  },
  {
    name: 'Maria Garcia',
    title: 'CTO at Vercel',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    content: 'The best monitoring platform we\'ve used. Setup was effortless and the insights help us prevent issues before they impact users.',
    rating: 5
  },
  {
    name: 'David Chen',
    title: 'Lead Developer at GitHub',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    content: 'Better Stack\'s status pages are beautiful and the incident management features saved us hours during our last outage.',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by the best teams
          </h2>
          <p className="text-xl text-gray-400">
            Join thousands of developers who rely on Better Stack
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-orange-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
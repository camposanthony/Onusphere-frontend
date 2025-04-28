import React from 'react';
import { CircleDollarSign, LineChart, Clock, Layers, Shield, Server } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <CircleDollarSign className="h-10 w-10" />,
      title: 'Cost-Effective',
      description: 'Pay only for the tools and capacity you need. Scale up or down as your business requires.',
      features: [
        'Usage-based pricing',
        'No long-term contracts',
        'Transparent pricing'
      ]
    },
    {
      icon: <LineChart className="h-10 w-10" />,
      title: 'Enterprise Scale',
      description: 'Built to handle enterprise workloads with high availability and reliable performance.',
      features: [
        'High availability',
        'Load balancing',
        'Automatic scaling'
      ]
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: 'Quick Implementation',
      description: 'Start with a single tool and expand your toolset as needed, without lengthy setup processes.',
      features: [
        'Same-day setup',
        'Guided onboarding',
        'Training included'
      ]
    },
    {
      icon: <Layers className="h-10 w-10" />,
      title: 'Easy Integration',
      description: 'Connect with your existing systems through our enterprise-grade APIs and connectors.',
      features: [
        'REST API access',
        'Common integrations',
        'Custom connectors'
      ]
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified infrastructure with comprehensive security features.',
      features: [
        'SOC 2 certified',
        'Data encryption',
        'Access controls'
      ]
    },
    {
      icon: <Server className="h-10 w-10" />,
      title: 'Data Control',
      description: 'Maintain full control over your logistics data with advanced management tools.',
      features: [
        'Data retention',
        'Export options',
        'Audit logs'
      ]
    }
  ];

  return (
    <section id="benefits" className="section">
      <div className="section-title">
        <h2>Why Choose Onusphere</h2>
        <p>Enterprise-ready logistics tools that adapt to your business needs</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="card hover:shadow-lg hover:border-electric-blue/50 transition-all"
          >
            <div className="h-16 w-16 rounded-md bg-electric-blue/10 flex items-center justify-center mb-4 text-electric-blue">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
            <p className="mb-4 text-light-gray/80">{benefit.description}</p>
            <ul className="space-y-2">
              {benefit.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <span className="bg-electric-blue/20 p-1 rounded-full mr-2">
                    <svg className="h-3 w-3 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-slate-gray rounded-lg p-8 border border-electric-blue/20">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-medium mb-4">Enterprise-Ready Platform</h3>
            <p className="mb-6">Our platform is built to meet enterprise requirements while maintaining the flexibility modern businesses need.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span>High Availability</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span>SLA Guaranteed</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-80">
            <a href="#get-started" className="btn-primary w-full justify-center">
              Schedule a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
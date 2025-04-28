import React from 'react';
import { PackageOpen, CreditCard, TrendingUp, CheckCircle2 } from 'lucide-react';

const ToolboxConcept: React.FC = () => {
  const steps = [
    {
      icon: <PackageOpen className="h-12 w-12 text-electric-blue" />,
      title: 'Enterprise-Grade Tools',
      description: 'Choose from our suite of professional logistics tools, each designed for seamless enterprise integration.'
    },
    {
      icon: <CreditCard className="h-12 w-12 text-electric-blue" />,
      title: 'Flexible Licensing',
      description: 'Pay only for active users and selected tools. Scale up or down monthly based on your operational needs.'
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-electric-blue" />,
      title: 'Grow With Confidence',
      description: 'Add capacity, users, or new tools instantly. Our platform grows with your business without disruption.'
    }
  ];

  const features = [
    'SOC 2 Type II Certified',
    'Enterprise SLA Available',
    '24/7 Priority Support',
    'Custom Integration Options',
    'Dedicated Success Manager',
    'Regular Security Audits'
  ];

  return (
    <section id="toolbox" className="section">
      <div className="section-title">
        <h2>Enterprise Solutions, Startup Agility</h2>
        <p>Get the reliability of enterprise software with the flexibility of modern SaaS solutions.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="card hover:shadow-lg group relative"
          >
            <div className="absolute top-4 right-4">
              <div className="text-electric-blue/20 group-hover:text-electric-blue/40 transition-colors">
                {index + 1}
              </div>
            </div>
            <div className="h-16 w-16 rounded-md bg-electric-blue/10 flex items-center justify-center mb-6 group-hover:bg-electric-blue/20 transition-colors">
              {step.icon}
            </div>
            <h3 className="text-xl font-medium mb-3">{step.title}</h3>
            <p>{step.description}</p>
            
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="h-0.5 w-8 bg-medium-gray"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-slate-gray rounded-lg p-8 border border-medium-gray">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center px-4 py-2 bg-electric-blue/10 rounded-full text-electric-blue text-sm font-medium mb-6">
              Enterprise Ready
            </div>
            <h3 className="text-2xl font-medium mb-4">Built for Enterprise Scale</h3>
            <p className="mb-8">Our platform meets the stringent requirements of enterprise logistics operations while maintaining the agility needed in today's fast-moving supply chains.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-electric-blue" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="bg-charcoal rounded-lg border border-medium-gray p-6">
              <h4 className="text-lg font-medium mb-4">Implementation Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center text-sm">1</div>
                  <div>
                    <p className="font-medium">Tool Selection</p>
                    <p className="text-sm text-medium-gray">Day 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center text-sm">2</div>
                  <div>
                    <p className="font-medium">Configuration</p>
                    <p className="text-sm text-medium-gray">Day 2-3</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center text-sm">3</div>
                  <div>
                    <p className="font-medium">Team Training</p>
                    <p className="text-sm text-medium-gray">Day 4-5</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-sm text-green-500">✓</div>
                  <div>
                    <p className="font-medium">Go Live</p>
                    <p className="text-sm text-medium-gray">Day 5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolboxConcept;
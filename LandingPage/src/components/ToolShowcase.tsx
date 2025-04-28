import React from 'react';
import { Truck, MessageSquare, ClipboardList, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

const ToolShowcase: React.FC = () => {
  const tools = [
    {
      icon: <Truck className="h-10 w-10" />,
      name: 'Truck Loading Optimizer',
      description: 'Optimize cargo space utilization with AI-powered load planning and real-time adjustments.',
      features: [
        'Multi-constraint optimization',
        'Real-time load balancing',
        'Automated weight distribution',
        'Integration with major TMS'
      ],
      available: true
    },
    {
      icon: <MessageSquare className="h-10 w-10" />,
      name: 'Communication Automation Hub',
      description: 'Streamline stakeholder communications with intelligent automation and real-time status updates.',
      features: [
        'Automated status updates',
        'Multi-channel notifications',
        'Custom workflow builder',
        'Stakeholder portal'
      ],
      available: true
    },
    {
      icon: <ClipboardList className="h-10 w-10" />,
      name: 'Route Planning System',
      description: 'Optimize delivery routes considering traffic, constraints, and delivery windows in real-time.',
      features: [
        'Dynamic route optimization',
        'Real-time traffic integration',
        'Driver mobile app',
        'Delivery window management'
      ],
      available: false,
      comingSoon: true
    },
    {
      icon: <Globe className="h-10 w-10" />,
      name: 'Supply Chain Visibility',
      description: 'End-to-end supply chain visibility with predictive analytics and real-time tracking.',
      features: [
        'Real-time tracking',
        'Predictive analytics',
        'Custom dashboards',
        'Supplier portal'
      ],
      available: false,
      comingSoon: true
    }
  ];

  return (
    <section id="tools" className="section bg-charcoal">
      <div className="section-title">
        <div className="inline-flex items-center px-4 py-2 bg-electric-blue/10 rounded-full text-electric-blue text-sm font-medium mb-6">
          Enterprise-Grade Solutions
        </div>
        <h2>Modular Tools for Modern Logistics</h2>
        <p>Each tool is built for enterprise scale, with robust security, extensive customization, and seamless integration capabilities.</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        {tools.map((tool, index) => (
          <div 
            key={index}
            className={`card group transition-all ${
              !tool.available ? 'opacity-90 hover:opacity-100' : 'hover:border-electric-blue'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-md ${
                  tool.available ? 'bg-electric-blue/10 text-electric-blue' : 'bg-medium-gray/20 text-light-gray'
                } group-hover:bg-electric-blue/20 transition-colors`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">{tool.name}</h3>
                  <p className="text-light-gray/80">{tool.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${tool.available ? 'text-electric-blue' : 'text-medium-gray'}`} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-auto">
                {tool.available ? (
                  <a href="#get-started" className="btn-primary w-full justify-center">
                    Request Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-medium-gray border border-medium-gray px-3 py-1.5 rounded-md text-sm">
                      Coming Q2 2024
                    </span>
                    <button className="text-electric-blue hover:underline text-sm">
                      Get Early Access
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-slate-gray rounded-lg p-8 border border-medium-gray">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-medium mb-4">Need a Custom Solution?</h3>
            <p className="text-light-gray/80">Our enterprise team can help build tools tailored to your specific logistics challenges.</p>
          </div>
          <a href="#get-started" className="btn-secondary whitespace-nowrap">
            Contact Enterprise Sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default ToolShowcase;
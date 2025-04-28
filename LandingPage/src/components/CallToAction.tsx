import React from 'react';
import { ArrowRight, Package2 } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section id="get-started" className="section relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/5 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-electric-blue/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-slate-gray rounded-full border border-medium-gray">
          <Package2 className="h-8 w-8 text-electric-blue" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Building Your Logistics Toolbox</h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto">
          Begin with a single tool and add more as your needs grow. Our modular approach makes it easy to get started without a major investment.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-gray rounded-lg p-6 border border-medium-gray hover:border-electric-blue transition-all">
            <h3 className="text-xl font-medium mb-4">Start with One Tool</h3>
            <p className="mb-6">Choose the logistics tool that addresses your most pressing challenge. Scale up when you're ready.</p>
            <a href="#" className="btn-primary w-full justify-center">
              Choose Your First Tool
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          
          <div className="bg-slate-gray rounded-lg p-6 border border-medium-gray hover:border-electric-blue transition-all">
            <h3 className="text-xl font-medium mb-4">Schedule a Demo</h3>
            <p className="mb-6">See our logistics toolbox in action with a personalized demonstration tailored to your needs.</p>
            <a href="#" className="btn-secondary w-full justify-center">
              Book Your Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-slate-gray flex items-center justify-center border border-medium-gray">
            <svg className="h-8 w-8 text-light-gray" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12L12 16L16 12M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        <div className="mt-6 p-6 bg-slate-gray rounded-lg border border-medium-gray">
          <p className="text-lg font-medium mb-2">Ready for a comprehensive solution?</p>
          <p className="mb-4">Our enterprise package includes access to all current and future tools with priority support.</p>
          <a href="#" className="text-electric-blue hover:underline inline-flex items-center">
            Learn about Enterprise Options
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
import React from 'react';
import { Package2, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-electric-blue/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-electric-blue/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Headline */}
          <h1 className="text-white font-bold mb-6 tracking-tight">
            Enterprise Logistics,<br />Simplified
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Build your perfect logistics solution with enterprise-grade tools. Pay for what you need, scale when you grow.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#tools" className="btn-primary">
              View Solutions
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="#get-started" className="btn-secondary">
              Schedule Demo
            </a>
          </div>
        </div>

        {/* Solution Preview */}
        <div className="mt-16 md:mt-20 relative max-w-4xl mx-auto">
          <div className="bg-slate-gray rounded-lg border border-medium-gray p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-charcoal rounded-lg border border-medium-gray/30">
                  <div className="p-2 rounded-md bg-electric-blue/10">
                    <Package2 className="h-6 w-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Truck Loading Optimizer</h3>
                    <p className="text-sm text-light-gray/80">AI-powered cargo optimization with real-time adjustments</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-charcoal rounded-lg border border-medium-gray/30">
                  <div className="p-2 rounded-md bg-electric-blue/10">
                    <Package2 className="h-6 w-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Communication Hub</h3>
                    <p className="text-sm text-light-gray/80">Automated updates and intelligent stakeholder communication</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-gray/90"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-4 p-4 bg-charcoal/50 rounded-lg border border-medium-gray/20">
                      <div className="p-2 rounded-md bg-medium-gray/20">
                        <Package2 className="h-6 w-6 text-medium-gray" />
                      </div>
                      <div className="flex-1">
                        <div className="h-6 w-3/4 bg-medium-gray/20 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-medium-gray/20 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded text-sm text-electric-blue">
                    More Solutions Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Highlights */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <div className="px-4 py-2 bg-charcoal rounded-full border border-medium-gray flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Enterprise Ready</span>
            </div>
            <div className="px-4 py-2 bg-charcoal rounded-full border border-medium-gray flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
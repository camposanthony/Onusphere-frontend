import React from 'react';
import { Package2, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-brand/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-brand/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Headline */}
          <h1 className="text-dark-text dark:text-white font-bold mb-6 tracking-tight">
            Enterprise Logistics,<br />Simplified
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-secondary-text dark:text-light-gray">
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
          <div className="bg-light-card dark:bg-slate-gray rounded-lg border border-light-border dark:border-medium-gray p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/80 dark:bg-charcoal rounded-lg border border-light-border dark:border-medium-gray/30">
                  <div className="p-2 rounded-md bg-gradient-brand/10">
                    <Package2 className="h-6 w-6 text-accent-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-dark-text dark:text-white">Truck Loading Optimizer</h3>
                    <p className="text-sm text-secondary-text dark:text-light-gray/80">AI-powered cargo optimization with real-time adjustments</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/80 dark:bg-charcoal rounded-lg border border-light-border dark:border-medium-gray/30">
                  <div className="p-2 rounded-md bg-gradient-brand/10">
                    <Package2 className="h-6 w-6 text-accent-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-dark-text dark:text-white">Communication Hub</h3>
                    <p className="text-sm text-secondary-text dark:text-light-gray/80">Automated updates and intelligent stakeholder communication</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-light-card/90 dark:to-slate-gray/90"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-4 p-4 bg-white/30 dark:bg-charcoal/50 rounded-lg border border-light-border/50 dark:border-medium-gray/20">
                      <div className="p-2 rounded-md bg-secondary-text/10 dark:bg-medium-gray/20">
                        <Package2 className="h-6 w-6 text-secondary-text dark:text-medium-gray" />
                      </div>
                      <div className="flex-1">
                        <div className="h-6 w-3/4 bg-secondary-text/10 dark:bg-medium-gray/20 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-secondary-text/10 dark:bg-medium-gray/20 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-4 py-2 bg-gradient-brand/10 border border-accent-green/30 rounded text-sm text-accent-green">
                    More Solutions Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Highlights */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <div className="px-4 py-2 bg-white dark:bg-charcoal rounded-full border border-light-border dark:border-medium-gray flex items-center gap-2 shadow-md">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-dark-text dark:text-white">Enterprise Ready</span>
            </div>
            <div className="px-4 py-2 bg-white dark:bg-charcoal rounded-full border border-light-border dark:border-medium-gray flex items-center gap-2 shadow-md">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-dark-text dark:text-white">SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
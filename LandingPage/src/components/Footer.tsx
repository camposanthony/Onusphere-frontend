import React from 'react';
import { Package2, Twitter, Linkedin, Mail, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light-card dark:bg-slate-gray border-t border-light-border dark:border-medium-gray">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Package2 className="h-8 w-8 text-accent-green" />
              <span className="text-dark-text dark:text-white text-xl font-semibold">Onusphere</span>
            </div>
            <p className="mb-4 text-sm text-secondary-text dark:text-light-gray">
              The modular logistics toolbox for modern businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-medium-gray hover:text-accent-green transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-medium-gray hover:text-accent-green transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-medium-gray hover:text-accent-green transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-medium-gray hover:text-accent-green transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-dark-text dark:text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">About Us</a></li>
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">Careers</a></li>
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">Press</a></li>
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-dark-text dark:text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">Documentation</a></li>
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">Support</a></li>
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">API</a></li>
              <li><a href="#" className="text-secondary-text dark:text-light-gray hover:text-accent-green transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-dark-text dark:text-white font-medium mb-4">Stay Updated</h3>
            <p className="mb-4 text-sm text-secondary-text dark:text-light-gray">Subscribe to our newsletter for the latest updates and logistics insights.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white dark:bg-charcoal border border-light-border dark:border-medium-gray rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-accent-green text-dark-text dark:text-white"
              />
              <button 
                type="submit"
                className="bg-accent-green text-white px-4 py-2 rounded-r-lg hover:bg-accent-green/90 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-light-border dark:border-medium-gray mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-text dark:text-medium-gray">
            &copy; {new Date().getFullYear()} Onusphere. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-secondary-text dark:text-medium-gray hover:text-accent-green transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-secondary-text dark:text-medium-gray hover:text-accent-green transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-secondary-text dark:text-medium-gray hover:text-accent-green transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
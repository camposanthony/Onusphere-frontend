import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoSvg from '../assets/logo.svg';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'dark:bg-charcoal/95 bg-white/95 backdrop-blur shadow-md py-3' 
          : 'dark:bg-transparent bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3">
            <img src={logoSvg} alt="Onusphere Logo" className="h-10 w-10" />
            <span className="text-dark-text dark:text-white text-xl font-semibold">Onusphere</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
          <a href="#toolbox" className="text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors">Toolbox</a>
            <a href="#tools" className="text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors">Tools</a>
            <a href="#benefits" className="text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors">Benefits</a>
            <a href="#use-cases" className="text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors">Use Cases</a>
          </nav>

          {/* Theme Toggle and CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <a href="#get-started" className="btn-primary">Get Started</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button 
              className="text-white dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-light-card dark:bg-slate-gray absolute top-full left-0 right-0 shadow-lg animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <a 
              href="#toolbox" 
              className="block py-2 text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Toolbox
            </a>
            <a 
              href="#tools" 
              className="block py-2 text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tools
            </a>
            <a 
              href="#benefits" 
              className="block py-2 text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </a>
            <a 
              href="#use-cases" 
              className="block py-2 text-secondary-text dark:text-light-gray hover:text-dark-text dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Use Cases
            </a>
            <a 
              href="#get-started" 
              className="btn-primary w-full justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
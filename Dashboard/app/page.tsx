"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, BarChart3, Truck, Box, Users, Shield, Clock, ChevronRight, Check, Star, Twitter, Linkedin, Facebook, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-background/95 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Header/Navigation - Sticky with glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">LogiHub</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/features" 
              className="group text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 relative py-2"
            >
              Features
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/pricing" 
              className="group text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 relative py-2"
            >
              Pricing
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="group text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 relative py-2"
            >
              About
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="hidden md:block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors py-2"
            >
              Log In
            </Link>
            <Link href="/auth/signup" className="hidden md:block">
              <Button 
                size="sm" 
                variant="default"
                className="relative overflow-hidden group transition-all duration-200"
              >
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 translate-y-[105%] bg-foreground group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs border-l border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b border-border/40 py-4">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold">LogiHub</span>
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-1 py-6">
                    <Link 
                      href="/features" 
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      Features
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                    <Link 
                      href="/pricing" 
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      Pricing
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                    <Link 
                      href="/about" 
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md"
                      onClick={() => setOpen(false)}
                    >
                      About
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  </nav>
                  <div className="mt-auto border-t border-border/40 pt-6 flex flex-col gap-2">
                    <Link href="/auth/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1 z-10">
        {/* Hero Section - Enhanced with animations and visual effects */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 py-8">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium mb-6 animate-fade-in">
                  <span className="mr-2 rounded-md bg-primary px-1.5 py-0.5 text-xs text-white">New</span> Version 2.0 is now available
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl animate-slide-up">
                    <span className="block">Optimize Your</span> 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Logistics Operations</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-up animation-delay-200">
                    LogiHub provides a complete toolkit for logistics companies to streamline operations, reduce costs, and improve customer satisfaction.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up animation-delay-400">
                  <Link href="/auth/signup">
                    <Button 
                      size="lg" 
                      className="group relative overflow-hidden rounded-full shadow-lg" 
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started Free 
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full border-primary/20 hover:bg-primary/5"
                    >
                      View Live Demo
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 flex items-center space-x-4 text-sm animate-fade-in animation-delay-700">
                  <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full border-2 border-background bg-primary/20"></div>
                    <div className="h-7 w-7 rounded-full border-2 border-background bg-primary/40"></div>
                    <div className="h-7 w-7 rounded-full border-2 border-background bg-primary/60"></div>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">500+</span> companies already onboard
                  </div>
                </div>
              </div>
              
              {/* Truck Image Section */}
              <div className="flex items-center justify-center relative lg:justify-end">
                <div className="relative w-full h-[800px] flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[200%] h-[780px] overflow-hidden bg-transparent">
                      <Image 
                        src="/truck-glassmorphism.png" 
                        alt="Logistics Truck" 
                        fill 
                        className="object-contain scale-200"
                        priority
                      /> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Highlight key platform metrics */}
        <section className="w-full py-12 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/5 via-primary/40 to-primary/5"></div>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight relative mb-2 inline-flex items-center">
                  <span className="mr-1">30</span>
                  <span className="text-primary">%</span>
                  <div className="absolute -top-2 -right-3 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                </div>
                <p className="text-muted-foreground text-sm">Average cost reduction</p>
              </div>
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight relative mb-2">
                  <CountUp value={15} suffix="K+" />
                </div>
                <p className="text-muted-foreground text-sm">Deliveries optimized daily</p>
              </div>
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight relative mb-2">
                  <CountUp value={500} suffix="+" />
                </div>
                <p className="text-muted-foreground text-sm">Companies using LogiHub</p>
              </div>
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight relative mb-2 inline-flex items-center">
                  <span className="mr-1">99.9</span>
                  <span className="text-primary">%</span>
                </div>
                <p className="text-muted-foreground text-sm">Platform reliability</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced with better visual styling */}
        <section className="w-full py-20 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background/0 pointer-events-none"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-20">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4 animate-fade-in">
                <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>Everything you need to optimize your logistics</span>
              </div>
              <div className="space-y-3 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Powerful Features for Your Business
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our comprehensive toolkit is designed to help logistics companies of all sizes
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {featureCards.map((feature, index) => (
                <Card key={index} className="group overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Enhanced with better visuals */}
        <section className="w-full py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-30" />
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl opacity-30" />
          
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-primary text-primary" />
                  ))}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by Logistics Leaders
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  See what our customers have to say about how LogiHub transformed their operations
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 xl:gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.title}</CardTitle>
                        <CardDescription>{testimonial.author}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced with eye-catching design */}
        <section className="w-full py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          
          <div className="container px-4 md:px-6 relative">
            <div className="mx-auto max-w-5xl backdrop-blur-sm bg-white/5 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-white/10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                    Ready to Transform Your Logistics?
                  </h2>
                  <p className="max-w-[900px] text-white/90 md:text-xl/relaxed">
                    Join thousands of companies already using LogiHub to optimize their operations
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link href="/auth/signup">
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="rounded-full hover:bg-white hover:text-primary font-medium px-8 shadow-lg"
                    >
                      Start Your Free Trial
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full font-medium px-8"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 text-white/80 text-sm">
                  No credit card required • Free 14-day trial • Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Enhanced */}
        <footer className="w-full border-t border-border/40 bg-muted/30 backdrop-blur-sm py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 xl:gap-16">
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight">LogiHub</h1>
                </Link>
                <p className="text-sm text-muted-foreground max-w-xs">
                  A complete logistics management platform designed to streamline your operations.
                </p>
                <div className="flex mt-4 space-x-3">
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/10">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/10">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/10">
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                  <li><Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground">Integrations</Link></li>
                  <li><Link href="/changelog" className="text-sm text-muted-foreground hover:text-foreground">Changelog</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link href="/documentation" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
                  <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">Guides</Link></li>
                  <li><Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                  <li><Link href="/team" className="text-sm text-muted-foreground hover:text-foreground">Team</Link></li>
                  <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
                  <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-border/40 mt-12 pt-8">
              <p className="text-xs text-muted-foreground">
                © 2023 LogiHub. All rights reserved.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Simple CountUp animation component
interface CountUpProps {
  value: number;
  suffix?: string;
}

const CountUp = ({ value, suffix = '' }: CountUpProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().substring(0, 3));
    
    // If no duration is provided, assume 2 seconds
    const duration = 2000;
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, duration / end);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <span>
      {count}{suffix}
    </span>
  );
};

// Feature cards data
const featureCards = [
  {
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: "Fleet Management",
    description: "Track your vehicles in real-time, manage maintenance schedules, and optimize routes."
  },
  {
    icon: <Box className="h-6 w-6 text-primary" />,
    title: "Inventory Control",
    description: "Monitor stock levels, automate reordering, and reduce warehouse inefficiencies."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Analytics Dashboard",
    description: "Get actionable insights with powerful reporting tools and customizable dashboards."
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Customer Portal",
    description: "Provide your customers with a seamless tracking experience and real-time updates."
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Security",
    description: "Enterprise-grade security to protect your data and ensure regulatory compliance."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Scheduling",
    description: "Optimize delivery schedules, manage driver assignments, and reduce idle time."
  }
];

// Testimonials data
const testimonials = [
  {
    title: "Game-Changing Platform",
    author: "CEO at Express Delivery Co.",
    content: "LogiHub has completely transformed how we manage our fleet and deliveries. We've seen a 30% reduction in operational costs."
  },
  {
    title: "Incredible ROI",
    author: "COO at Global Freight Ltd.",
    content: "The analytics and reporting tools have given us insights we never had before. Our efficiency has improved dramatically."
  },
  {
    title: "Customer Satisfaction Up",
    author: "Director at Rapid Logistics",
    content: "Since implementing LogiHub, our customer satisfaction scores have increased by 45%. The tracking portal is a game-changer."
  }
];


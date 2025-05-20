"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Truck,
  Users,
  ChevronRight,
  Twitter,
  Linkedin,
  Facebook,
  Menu,
  Zap,
  LineChart,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/lottie/LottieAnimation";
import logisticsAnimation from "../public/animations/logistics.json";
import tetrisAnimation from "../public/animations/tetris.json";
import loadPlanProAnimation from "../public/animations/load-plan-pro.json";
import customerConnectAnimation from "../public/animations/customer-connect.json";
import moreToolsAnimation from "../public/animations/more-tools.json";
import connectedAnimation from "../public/animations/connected.json";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const [featureTab, setFeatureTab] = useState(0);

  // Removed tabRefs as it was unused
  // Removed indicatorStyle and setIndicatorStyle as they are unused

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Removed useLayoutEffect for indicatorStyle

  const getAnimationClass = (id: string) => {
    if (!visibleSections.has(id)) {
      switch (id) {
        case "hero":
          return "opacity-0 scale-95";
        case "features":
          return "opacity-0 translate-x-8";
        case "how-it-works":
          return "opacity-0 translate-y-12";
        case "integrations":
          return "opacity-0 -translate-x-8";
        case "pricing":
          return "opacity-0 translate-y-8";
        case "social-proof":
          return "opacity-0 scale-105";
        case "cta":
          return "opacity-0 translate-y-12";
        default:
          return "opacity-0";
      }
    }
    return "opacity-100 translate-y-0 translate-x-0 scale-100";
  };

  const getAnimationDelay = (id: string) => {
    switch (id) {
      case "hero":
        return "delay-0";
      case "features":
        return "delay-100";
      case "how-it-works":
        return "delay-200";
      case "integrations":
        return "delay-300";
      case "pricing":
        return "delay-400";
      case "social-proof":
        return "delay-500";
      case "cta":
        return "delay-600";
      default:
        return "delay-0";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const featureTabs = [
    {
      label: "Load Plan Pro",
      animation: loadPlanProAnimation,
      title: "Load Plan Pro",
      description:
        "Instantly generate optimal loading plans for every shipment. No more guesswork, no more manager interruptions—just efficient, accurate loading every time.",
    },
    {
      label: "Customer Connect",
      animation: customerConnectAnimation,
      title: "Customer Connect",
      description:
        "Automate every customer update, from order confirmation to delivery ETA. Keep your customers informed and happy—without lifting a finger.",
    },
    {
      label: "...And So Much More",
      animation: moreToolsAnimation,
      title: "...And So Much More",
      description:
        "Discover route planning, analytics, inventory management, and more—your complete logistics toolkit, all in one place.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Header/Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2 bg-background/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-primary/5 border-b border-border/40"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                scrolled ? "scale-90" : "scale-100"
              }`}
            >
              <Image
                src="/movomintlogo.png"
                alt="movomintlogo logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <h1
              className={`text-xl font-bold tracking-tight text-foreground transition-all duration-300 ${
                scrolled ? "text-lg" : "text-xl"
              }`}
            >
              <span>movo</span>
              <span style={{ color: "#00827B" }}>mint</span>
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className={`text-sm font-medium transition-all duration-300 ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Features
            </Link>
            <Link
              href="#integrations"
              className={`text-sm font-medium transition-all duration-300 ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Integrations
            </Link>
            <Link
              href="#how-it-works"
              className={`text-sm font-medium transition-all duration-300 ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#why-choose-us"
              className={`text-sm font-medium transition-all duration-300 ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Why Choose Us
            </Link>
            <Link
              href="#cta"
              className={`text-sm font-medium transition-all duration-300 ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Get a Demo
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full px-6 py-2 font-semibold shadow-sm transition-all duration-300 ${
                  scrolled
                    ? "border-primary/60 text-primary hover:bg-primary/5 hover:text-primary/100"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Log In
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="sm"
                className={`rounded-full px-6 py-2 font-semibold shadow-md transition-all duration-300 ${
                  scrolled
                    ? "bg-primary/90 hover:bg-primary"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                Request a Demo
              </Button>
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-xs border-l border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b border-border/40 py-4">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setOpen(false)}
                    >
                      <Image
                        src="/movomintlogo.png"
                        alt="movomintlogo logo"
                        width={32}
                        height={32}
                        className="object-contain"
                        priority
                      />
                      <span className="font-bold text-foreground">
                        <span>movo</span>
                        <span style={{ color: "#00827B" }}>mint</span>
                      </span>
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-1 py-6">
                    <Link
                      href="#features"
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Features
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                    <Link
                      href="#integrations"
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Integrations
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      How It Works
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                    <Link
                      href="#why-choose-us"
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Why Choose Us
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                    <Link
                      href="#cta"
                      className="flex items-center justify-between p-3 text-sm hover:bg-muted rounded-md text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Get a Demo
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  </nav>
                  <div className="mt-auto border-t border-border/40 pt-6 flex flex-col gap-2">
                    <Link href="/demo" onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-full px-6 py-3 font-semibold shadow-md">
                        Request a Demo
                      </Button>
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="w-full text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mt-2"
                    >
                      Log In
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 z-10 pt-24 flex flex-col">
        {/* Hero Section */}
        <section
          id="hero"
          className={`relative min-h-[90vh] flex items-center justify-center transition-all duration-500 ease-out ${getAnimationClass("hero")} ${getAnimationDelay("hero")}`}
        >
          <div className="container px-4 md:px-6 mx-auto flex flex-col lg:flex-row items-center justify-center text-center lg:text-left relative gap-8 pb-8 pt-8 md:pt-16 md:pb-16">
            <motion.div
              className="space-y-8 max-w-2xl mx-auto flex-1 relative z-10"
              variants={containerVariants}
              initial="hidden"
              animate={visibleSections.has("hero") ? "visible" : "hidden"}
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mx-auto lg:mx-0 bg-background/80 backdrop-blur-sm"
              >
                <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <Zap className="h-3.5 w-3.5" />
                </span>
                <span className="text-foreground">The AWS of Logistics</span>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl text-foreground drop-shadow-lg">
                  <span className="block">Your Complete</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Logistics Toolkit
                  </span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0 drop-shadow">
                  Access powerful algorithms and tools built by top-tier
                  engineers. Need something specific? We&apops;ll build it for
                  you.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/demo">
                  <Button size="lg" className="rounded-full w-full sm:w-auto">
                    Request a Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo#video">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-full sm:w-auto"
                  >
                    Watch Demo Video
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-8 pt-8 justify-center lg:justify-start"
              >
                <div className="w-full text-center lg:text-left">
                  <span className="inline-block text-base md:text-lg font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl shadow-sm">
                    See how movomint can transform your logistics in 15 minutes.
                  </span>
                </div>
              </motion.div>
            </motion.div>
            {/* Lottie Animation - right on desktop, below on mobile, with color bleed background */}
            <motion.div
              className="relative flex-1 flex items-center justify-center w-full max-w-[420px] sm:max-w-[520px] md:max-w-[600px] lg:max-w-[700px] mx-auto lg:mx-0 mt-8 lg:mt-0"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Restored color bleed background */}
              <div
                className="absolute inset-0 z-0 rounded-full pointer-events-none w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at 65% 50%, #39BEB7 0%, #00827B 60%, rgba(56,190,183,0.18) 100%)",
                  filter: "blur(110px)",
                  opacity: 0.6,
                }}
              />
              <LottieAnimation
                animationData={logisticsAnimation}
                loop
                className="relative z-10 w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[520px] select-none"
                style={{ objectFit: "contain" }}
                rendererSettings={{ progressiveLoad: true }}
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={`py-20 relative transition-all duration-1000 ease-out ${getAnimationClass("features")} ${getAnimationDelay("features")}`}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={
                visibleSections.has("features")
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Frictionless connection to all your logistics tools. No API
                keys. No integrations. Just log in and use everything in one
                place.
              </p>
            </motion.div>
            {/* Tabs UI */}
            <div className="flex justify-center mb-10 relative">
              <div className="inline-flex bg-muted/40 rounded-full p-1 shadow-sm border border-border/30 relative">
                {featureTabs.map((tab, idx) => (
                  <button
                    key={tab.label}
                    className={`px-6 py-2 rounded-full text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                      ${
                        featureTab === idx
                          ? "text-primary font-bold"
                          : "text-muted-foreground hover:text-primary"
                      }
                    `}
                    onClick={() => setFeatureTab(idx)}
                    style={{
                      zIndex: 1,
                      fontWeight: featureTab === idx ? 700 : 500,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Tab Content with animation */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 min-h-[400px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={featureTab}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-1 flex-col md:flex-row items-center justify-center w-full gap-10 md:gap-16"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <LottieAnimation
                      animationData={featureTabs[featureTab].animation}
                      loop
                      className="w-full max-w-[340px] md:max-w-[420px] lg:max-w-[520px] h-[220px] md:h-[320px] lg:h-[400px] select-none"
                      style={{ objectFit: "contain" }}
                      rendererSettings={{ progressiveLoad: true }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {featureTabs[featureTab].title}
                    </h3>
                    <p className="text-muted-foreground md:text-lg mb-4 max-w-xl">
                      {featureTabs[featureTab].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className={`py-20 relative overflow-hidden transition-all duration-1000 ease-out ${getAnimationClass("how-it-works")} ${getAnimationDelay("how-it-works")}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />
          <div className="container px-4 md:px-6 mx-auto relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Get started instantly. No integrations, no setup, no API keys.
                Just sign up, connect your tools, and get more from your
                logistics.
              </p>
            </div>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={
                visibleSections.has("how-it-works") ? "visible" : "hidden"
              }
            >
              {/* Card 1 */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col min-h-[240px]">
                  <CardHeader className="flex flex-col items-start flex-shrink-0 pb-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground mb-0">
                      Sign Up Instantly
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end pt-2 pb-3">
                    <p className="text-muted-foreground">
                      Create your account in seconds. No technical setup
                      required.
                    </p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
              {/* Card 2 */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col min-h-[240px]">
                  <CardHeader className="flex flex-col items-start flex-shrink-0 pb-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground mb-0">
                      Connect Your Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end pt-2 pb-3">
                    <p className="text-muted-foreground">
                      One click to connect all your existing logistics tools. No
                      API keys, no integrations, no hassle.
                    </p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
              {/* Card 3 */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col min-h-[240px]">
                  <CardHeader className="flex flex-col items-start flex-shrink-0 pb-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground mb-0">
                      Use & Optimize
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end pt-2 pb-3">
                    <p className="text-muted-foreground">
                      Access and use all your tools in one place. Get more
                      value, insights, and automation instantly.
                    </p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Integration Section */}
        <section
          id="integrations"
          className={`py-20 relative transition-all duration-1000 ease-out ${getAnimationClass("integrations")} ${getAnimationDelay("integrations")}`}
        >
          <div className="container px-4 md:px-6 mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Section Content - left on desktop, above on mobile */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-1">
              <div className="text-center lg:text-left max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-4">
                  Instantly Connected
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  All your favorite logistics tools, unified. No setup, no API
                  keys—just seamless access and better results.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                {integrations.map((integration, index) => (
                  <div
                    key={index}
                    className="w-32 h-16 flex items-center justify-center p-4 rounded-lg bg-card hover:shadow-lg transition-all duration-300"
                  >
                    <Image
                      src={`/icons/${integration.name.toLowerCase()}.png`}
                      alt={integration.name}
                      width={80}
                      height={40}
                      className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Lottie Animation - right on desktop, below on mobile */}
            <div className="flex-1 flex items-center justify-center mb-8 lg:mb-0 order-2 lg:order-2">
              <LottieAnimation
                animationData={connectedAnimation}
                loop
                className="w-full max-w-[340px] md:max-w-[420px] lg:max-w-[520px] h-[220px] md:h-[320px] lg:h-[400px] select-none"
                style={{ objectFit: "contain" }}
                rendererSettings={{ progressiveLoad: true }}
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section
          id="why-choose-us"
          className="mt-16 mb-16 py-12 md:py-16 bg-gradient-to-b from-primary/5 via-white to-white overflow-hidden"
        >
          <div className="w-full max-w-6xl px-4 md:px-12 mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-12">
            {/* 3D Tetris Animation - left on desktop, above on mobile */}
            <div className="flex-1 flex items-center justify-center mb-8 lg:mb-0">
              <LottieAnimation
                animationData={tetrisAnimation}
                loop
                className="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[600px] h-[260px] md:h-[400px] lg:h-[520px] select-none"
                style={{ objectFit: "contain" }}
                rendererSettings={{ progressiveLoad: true }}
              />
            </div>
            {/* Content - right on desktop, below on mobile */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-left">
                  Why Choose Us?
                </h2>
                <p className="text-muted-foreground md:text-xl text-left max-w-2xl">
                  We&apos;re building the future of logistics: one platform,
                  every tool, zero friction. Our mission is to make logistics
                  effortless, unified, and powerful for everyone—no technical
                  barriers, no integration headaches, just results.
                </p>
              </div>
              <div className="flex flex-row items-center justify-center gap-12 lg:gap-24 mt-12 mb-2 md:mb-0">
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-3xl bg-primary/10 flex items-center justify-center shadow-2xl shadow-primary/30 ring-4 ring-primary/10 hover:shadow-primary/40 transition-all duration-300 mb-4"
                    style={{
                      width: "160px",
                      height: "160px",
                      minWidth: "160px",
                      minHeight: "160px",
                      borderRadius: "2rem",
                    }}
                  >
                    <Zap
                      className="text-primary"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <span className="text-xl font-semibold text-foreground mt-2">
                    Frictionless
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-3xl bg-primary/10 flex items-center justify-center shadow-2xl shadow-primary/30 ring-4 ring-primary/10 hover:shadow-primary/40 transition-all duration-300 mb-4"
                    style={{
                      width: "160px",
                      height: "160px",
                      minWidth: "160px",
                      minHeight: "160px",
                      borderRadius: "2rem",
                    }}
                  >
                    <Settings
                      className="text-primary"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <span className="text-xl font-semibold text-foreground mt-2">
                    Unified
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-3xl bg-primary/10 flex items-center justify-center shadow-2xl shadow-primary/30 ring-4 ring-primary/10 hover:shadow-primary/40 transition-all duration-300 mb-4"
                    style={{
                      width: "160px",
                      height: "160px",
                      minWidth: "160px",
                      minHeight: "160px",
                      borderRadius: "2rem",
                    }}
                  >
                    <LineChart
                      className="text-primary"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <span className="text-xl font-semibold text-foreground mt-2">
                    Evolving
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          id="cta"
          className={`pt-4 md:pt-2 relative overflow-hidden transition-all duration-1000 bg-white ${getAnimationClass("cta")} ${getAnimationDelay("cta")}`}
        >
          <div className="container px-4 md:px-6 mx-auto relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-6">
                See movo<span style={{ color: "#00827B" }}>mint</span> in Action
              </h2>
              <p className="text-muted-foreground md:text-xl mb-8">
                Book a personalized demo and discover how our unified platform
                can streamline your operations—no setup, no hassle.
              </p>
              <div className="flex flex-col gap-4 justify-center items-center">
                <Link href="/demo">
                  <Button size="lg" className="rounded-full px-10 py-6 text-lg">
                    Request a Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <span className="block text-base text-muted-foreground mt-4">
                  Our team will walk you through the platform and answer all
                  your questions.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer between CTA and Footer */}
        <div className="h-24 md:h-40" />
      </main>
      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 backdrop-blur-sm py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 xl:gap-16">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full flex items-center justify-center">
                  <Image
                    src="/movomintlogo.png"
                    alt="movomintlogo logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  <span>movo</span>
                  <span style={{ color: "#00827B" }}>mint</span>
                </h1>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                The complete toolkit for modern logistics companies. Built by
                engineers, for engineers.
              </p>
              <div className="flex mt-4 space-x-3">
                <a
                  href="#"
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/10"
                >
                  <Twitter className="h-4 w-4 text-foreground" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/10"
                >
                  <Linkedin className="h-4 w-4 text-foreground" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/10"
                >
                  <Facebook className="h-4 w-4 text-foreground" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-foreground">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/tools"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/algorithms"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Algorithms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/custom-solutions"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Custom Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-foreground">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/documentation"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-foreground">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-border/40 mt-12 pt-8">
            <p className="text-xs text-muted-foreground">
              © 2024 movomint. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const integrations = [
  {
    name: "Shopify",
    logo: "/integrations/shopify.svg",
  },
  {
    name: "WooCommerce",
    logo: "/integrations/woocommerce.svg",
  },
  {
    name: "QuickBooks",
    logo: "/integrations/quickbooks.svg",
  },
  {
    name: "Salesforce",
    logo: "/integrations/salesforce.svg",
  },
  {
    name: "Zapier",
    logo: "/integrations/zapier.svg",
  },
  {
    name: "Stripe",
    logo: "/integrations/stripe.svg",
  },
  {
    name: "Amazon",
    logo: "/integrations/amazon.svg",
  },
  {
    name: "eBay",
    logo: "/integrations/ebay.svg",
  },
];

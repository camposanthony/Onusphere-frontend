import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolboxConcept from './components/ToolboxConcept';
import ToolShowcase from './components/ToolShowcase';
import InteractiveToolbox from './components/InteractiveToolbox';
import Benefits from './components/Benefits';
import UseCaseExample from './components/UseCaseExample';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-charcoal text-light-gray">
      <Header />
      <main>
        <Hero />
        <ToolboxConcept />
        <ToolShowcase />
        <InteractiveToolbox />
        <Benefits />
        <UseCaseExample />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default App;
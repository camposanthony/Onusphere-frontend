import { ThemeProvider } from './components/ThemeProvider';
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
    <ThemeProvider>
      <div className="min-h-screen bg-light-bg dark:bg-charcoal text-dark-text dark:text-light-gray transition-colors duration-300">
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
    </ThemeProvider>
  );
}

export default App;
import React from 'react';
import { TruckLoadingProvider, useTruckLoading } from './context/TruckLoadingContext';
import CustomersList from './CustomersList';
import CustomerDetails from './components/Customer/CustomerDetails';
import OrderDetails from './components/Order/OrderDetails';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import { getAccentStyles } from './styles';

/**
 * Main component content that renders based on the application state
 * Uses the TruckLoadingContext to manage application state
 */
const TruckLoadingHelperContent: React.FC = () => {
  const { 
    selectedCustomer, 
    selectedOrder, 
    isOnboarding 
  } = useTruckLoading();

  /**
   * Render the appropriate content based on application state
   */
  const renderContent = () => {
    // Show onboarding flow for first-time users
    if (isOnboarding) {
      return <OnboardingFlow />;
    }

    // Show order details when an order is selected
    if (selectedOrder) {
      return <OrderDetails />;
    }

    // Show customer details when a customer is selected
    if (selectedCustomer) {
      return <CustomerDetails />;
    }

    // Show customers list by default
    return <CustomersList showAddCustomerButton={!isOnboarding} />;
  };

  const accentStyles = getAccentStyles();
  
  return (
    <div className="space-y-8 bg-white">
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${accentStyles.text}`}>Truck Loading Helper</h1>
        <p className="mt-1 text-[#6B7280]">
          Manage customers and their orders for efficient truck loading operations
        </p>
      </div>
      
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

/**
 * Root component that provides the context to the entire tree
 * Manages state through the TruckLoadingProvider
 */
const TruckLoadingHelper: React.FC = () => {
  return (
    <TruckLoadingProvider>
      <TruckLoadingHelperContent />
    </TruckLoadingProvider>
  );
};

export default TruckLoadingHelper;

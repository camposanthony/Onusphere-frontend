import React, { useState } from 'react';
import { Search, X, HelpCircle, Users, Plus, Truck } from 'lucide-react';
import { useTruckLoading } from '../../context/TruckLoadingContext';
import OnboardingHelpDialog from '../Onboarding/OnboardingHelpDialog';
import { styles, getAccentStyles } from '../../styles';

interface CustomersListProps {
  showAddCustomerButton?: boolean;
}

export const CustomersList: React.FC<CustomersListProps> = ({ showAddCustomerButton = true }) => {
  const { customers, selectCustomer, addCustomer } = useTruckLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [showOnboardingHelp, setShowOnboardingHelp] = useState(false);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomerName.trim()) {
      addCustomer(newCustomerName.trim(), newCustomerEmail.trim());
      setNewCustomerName('');
      setNewCustomerEmail('');
      setShowAddCustomerForm(false);
    }
  };

  const accentStyles = getAccentStyles();
  
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-[#1F2937]">
          <Users size={20} className={`text-[${accentStyles.primary}] mr-2`} />
          Customers
          <button 
            onClick={() => setShowOnboardingHelp(true)}
            className={`ml-2 p-1.5 text-[#6B7280] hover:text-[${accentStyles.primary}] transition-colors`}
            title="How to add customers"
            aria-label="View help for adding customers"
          >
            <HelpCircle size={16} />
          </button>
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[#6B7280]" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchBox}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] p-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {showAddCustomerButton && (
            <button 
              onClick={() => setShowAddCustomerForm(true)}
              className={styles.primaryButton}
            >
              <Plus size={18} className="mr-2" />
              Add Customer
            </button>
          )}
        </div>

        {/* Customers list */}
        <div className={styles.grid}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => selectCustomer(customer)}
                className={styles.customerCard}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={styles.iconContainer}>
                      <Truck size={24} className={`text-[${accentStyles.primary}]`} />
                    </div>
                    <div className={styles.smallStatusTag}>
                      {customer.orders.length > 0 ? `${customer.orders.length} Orders` : 'New'}
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-2 truncate text-[#1F2937]">{customer.name}</h3>
                  <p className="text-sm mb-4 text-[#6B7280]">
                    {customer.email || 'No email provided'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">
                      {customer.orders.filter(order => order.status === 'pending').length} pending orders
                    </span>
                    <div className={`rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all ${accentStyles.background}`}>
                      <X size={14} className={`text-[${accentStyles.primary}]`} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-8 text-center bg-white rounded-lg border border-[#E5E7EB]">
              <p className="text-[#6B7280] mb-2">No customers found</p>
              <p className="text-sm text-[#6B7280]">Try adjusting your search or add a new customer</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Customer Modal */}
      {showAddCustomerForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-lg border border-[#E5E7EB]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-[#1F2937]">Add New Customer</h3>
                <button
                  onClick={() => setShowAddCustomerForm(false)}
                  className="text-[#6B7280] p-1 hover:text-[#1F2937] rounded-sm"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitNewCustomer}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium mb-1 text-[#1F2937]">
                      Customer Name *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className={styles.input}
                      required
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium mb-1 text-[#1F2937]">
                      Email Address
                    </label>
                    <input
                      id="customerEmail"
                      type="email"
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      className={styles.input}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className={styles.notificationContainer}>
                    <p className={`text-sm text-[${accentStyles.primary}]`}>
                      <strong>Note:</strong> For better results, we recommend adding customers by forwarding their order emails to orders@onusphere.com
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCustomerForm(false)}
                      className={styles.secondaryButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.primaryButton}
                      disabled={!newCustomerName.trim()}
                    >
                      Add Customer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Help Modal */}
      {showOnboardingHelp && (
        <OnboardingHelpDialog onClose={() => setShowOnboardingHelp(false)} />
      )}
    </div>
  );
};

export default CustomersList;

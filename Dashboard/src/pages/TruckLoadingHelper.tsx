import { useState, useCallback } from 'react';
import { Truck, Package, Copy, CheckCheck, Box, Edit, Save, Search } from 'lucide-react';

// Types for our data
interface Item {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  weight: number;
  dimensions: {
    length: number; // in inches
    width: number; // in inches
    height: number; // in inches
  };
  specialInstructions?: string;
  dateAdded: string;
}

interface Order {
  id: string;
  name: string;
  items: number;
  status: 'pending' | 'loaded' | 'delivered';
}

interface Customer {
  id: string;
  name: string;
  orders: Order[];
  items: Item[];
}

const TruckLoadingHelper = () => {
  // State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Copy to clipboard function
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }, []);

  // Sample data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'ABC Corporation',
      orders: [
        { id: '101', name: 'Office Supplies', items: 12, status: 'pending' },
        { id: '102', name: 'Electronics', items: 5, status: 'loaded' },
        { id: '103', name: 'Furniture', items: 8, status: 'delivered' }
      ],
      items: [
        {
          id: '201',
          name: 'Office Chair',
          sku: 'OC-1234',
          quantity: 10,
          weight: 30,
          dimensions: { length: 24, width: 24, height: 36 },
          specialInstructions: 'Fragile, handle with care',
          dateAdded: '2025-01-15T12:00:00Z'
        },
        {
          id: '202',
          name: 'Desk Lamp',
          sku: 'DL-5678',
          quantity: 20,
          weight: 5,
          dimensions: { length: 8, width: 8, height: 15 },
          dateAdded: '2025-01-20T12:00:00Z'
        }
      ]
    },
    {
      id: '2',
      name: 'XYZ Industries',
      orders: [
        { id: '104', name: 'Building Materials', items: 24, status: 'pending' },
        { id: '105', name: 'Tools', items: 15, status: 'delivered' }
      ],
      items: [
        {
          id: '203',
          name: 'Hammer',
          sku: 'HM-9101',
          quantity: 50,
          weight: 2,
          dimensions: { length: 12, width: 3, height: 1 },
          dateAdded: '2025-02-01T12:00:00Z'
        }
      ]
    }
  ]);

  // Filter items based on search query
  const getFilteredItems = (customer: Customer | null) => {
    if (!customer) return [];
    return customer.items.filter(item => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        (item.specialInstructions && item.specialInstructions.toLowerCase().includes(query))
      );
    });
  };

  // Add a new customer
  const addCustomer = () => {
    if (!newCustomerName.trim()) return;
    
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      name: newCustomerName.trim(),
      orders: [],
      items: []
    };
    
    setCustomers([...customers, newCustomer]);
    setNewCustomerName('');
    setIsAddingCustomer(false);
    setSelectedCustomer(newCustomer);
  };

  // Update order status
  const updateOrderStatus = (customerId: string, orderId: string, newStatus: Order['status']) => {
    setCustomers(prevCustomers => {
      return prevCustomers.map(customer => {
        if (customer.id !== customerId) return customer;
        
        return {
          ...customer,
          orders: customer.orders.map(order => {
            if (order.id !== orderId) return order;
            return { ...order, status: newStatus };
          })
        };
      });
    });
    
    // Update selected customer if it's the one being modified
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(prev => {
        if (!prev) return null;
        return {
          ...prev,
          orders: prev.orders.map(order => {
            if (order.id !== orderId) return order;
            return { ...order, status: newStatus };
          })
        };
      });
    }
  };

  // Save edited item
  const saveEditedItem = () => {
    if (!editingItem || !selectedCustomer) return;
    
    // Update in the customers array
    setCustomers(prevCustomers => {
      return prevCustomers.map(customer => {
        if (customer.id !== selectedCustomer.id) return customer;
        
        return {
          ...customer,
          items: customer.items.map(item => {
            if (item.id !== editingItem.id) return item;
            return editingItem;
          })
        };
      });
    });
    
    // Update in the selected customer
    setSelectedCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(item => {
          if (item.id !== editingItem.id) return item;
          return editingItem;
        })
      };
    });
    
    setEditingItem(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Truck size={24} className="mr-2" />
        Truck Loading Helper
      </h1>
      
      {!selectedCustomer ? (
        // Customers List - Full width when no customer is selected
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Choose a Customer</h2>
            <button 
              onClick={() => setIsAddingCustomer(!isAddingCustomer)}
              className="px-3 py-1.5 rounded bg-accent text-white text-sm"
            >
              {isAddingCustomer ? 'Cancel' : '+ Add Customer'}
            </button>
          </div>
          
          {/* New Customer Form - Simple version */}
          {isAddingCustomer && (
            <div className="mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h3 className="text-md font-semibold mb-3">New Customer</h3>
              <div className="flex items-end gap-3">
                <div className="flex-grow">
                  <label className="block text-sm mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter customer name"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <button
                  onClick={addCustomer}
                  disabled={!newCustomerName.trim()}
                  className="px-4 py-2 rounded bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          )}
          
          {/* Simple Customers List */}
          {customers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map(customer => (
                <div
                  key={customer.id}
                  className="p-5 border rounded-lg cursor-pointer transition-colors hover:border-accent hover:shadow-sm"
                  style={{ borderColor: 'var(--border)' }}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="font-bold text-xl mb-2">{customer.name}</div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Package size={16} className="mr-1 text-blue-500" />
                      {customer.orders.length} {customer.orders.length === 1 ? 'order' : 'orders'}
                    </div>
                    <div className="flex items-center">
                      <Box size={16} className="mr-1 text-green-500" />
                      {customer.items.length} {customer.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Customers Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first customer to get started
              </p>
              <button
                onClick={() => setIsAddingCustomer(true)}
                className="px-4 py-2 rounded bg-accent text-white"
              >
                Add Customer
              </button>
            </div>
          )}
        </div>
      ) : (
        // Customer Details - Full screen when selected
        <div>
          {/* Simple header with back button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="px-3 py-1.5 rounded border hover:bg-accent/10 transition-colors text-sm flex items-center"
              style={{ borderColor: 'var(--border)' }}
            >
              ← Back to Customers
            </button>
          </div>
          
          {/* Simple tab buttons - more intuitive */}
          <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
            <button 
              onClick={() => setShowItems(false)}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${!showItems ? 'border-accent text-accent' : 'border-transparent'}`}
            >
              <Package size={16} className="inline mr-1" />
              Orders
            </button>
            <button 
              onClick={() => setShowItems(true)}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${showItems ? 'border-accent text-accent' : 'border-transparent'}`}
            >
              <Box size={16} className="inline mr-1" />
              Items
            </button>
          </div>
          
          {/* Items View */}
          {showItems ? (
            <div>
              {/* Simple search */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Item List</h3>
                <div className="relative w-64">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md w-full"
                    style={{borderColor: 'var(--border)'}}
                  />
                </div>
              </div>
              
              {/* Item List */}
              {getFilteredItems(selectedCustomer).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredItems(selectedCustomer).map(item => (
                    <div 
                      key={item.id} 
                      className="border rounded-lg p-4 hover:border-accent/50 transition-colors"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {editingItem?.id === item.id ? (
                        // Simple Edit Form
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs mb-1">Name</label>
                            <input
                              type="text"
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                              className="w-full p-2 text-sm border rounded"
                              style={{borderColor: 'var(--border)'}}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs mb-1">SKU</label>
                            <input
                              type="text"
                              value={editingItem.sku}
                              onChange={(e) => setEditingItem({...editingItem, sku: e.target.value})}
                              className="w-full p-2 text-sm border rounded"
                              style={{borderColor: 'var(--border)'}}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs mb-1">Quantity</label>
                              <input
                                type="number"
                                value={editingItem.quantity}
                                onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value) || 0})}
                                className="w-full p-2 text-sm border rounded"
                                style={{borderColor: 'var(--border)'}}
                              />
                            </div>
                            <div>
                              <label className="block text-xs mb-1">Weight (lbs)</label>
                              <input
                                type="number"
                                value={editingItem.weight}
                                onChange={(e) => setEditingItem({...editingItem, weight: parseFloat(e.target.value) || 0})}
                                className="w-full p-2 text-sm border rounded"
                                style={{borderColor: 'var(--border)'}}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs mb-1">Dimensions (inches)</label>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="number"
                                placeholder="L"
                                value={editingItem.dimensions.length}
                                onChange={(e) => setEditingItem({
                                  ...editingItem, 
                                  dimensions: {
                                    ...editingItem.dimensions,
                                    length: parseFloat(e.target.value) || 0
                                  }
                                })}
                                className="w-full p-2 text-sm border rounded"
                                style={{borderColor: 'var(--border)'}}
                              />
                              <input
                                type="number"
                                placeholder="W"
                                value={editingItem.dimensions.width}
                                onChange={(e) => setEditingItem({
                                  ...editingItem, 
                                  dimensions: {
                                    ...editingItem.dimensions,
                                    width: parseFloat(e.target.value) || 0
                                  }
                                })}
                                className="w-full p-2 text-sm border rounded"
                                style={{borderColor: 'var(--border)'}}
                              />
                              <input
                                type="number"
                                placeholder="H"
                                value={editingItem.dimensions.height}
                                onChange={(e) => setEditingItem({
                                  ...editingItem, 
                                  dimensions: {
                                    ...editingItem.dimensions,
                                    height: parseFloat(e.target.value) || 0
                                  }
                                })}
                                className="w-full p-2 text-sm border rounded"
                                style={{borderColor: 'var(--border)'}}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs mb-1">Special Instructions</label>
                            <textarea
                              value={editingItem.specialInstructions || ''}
                              onChange={(e) => setEditingItem({...editingItem, specialInstructions: e.target.value})}
                              className="w-full p-2 text-sm border rounded min-h-[60px]"
                              style={{borderColor: 'var(--border)'}}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2 pt-2">
                            <button
                              onClick={() => setEditingItem(null)}
                              className="px-3 py-1 rounded border text-sm"
                              style={{borderColor: 'var(--border)'}}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveEditedItem}
                              className="px-3 py-1 rounded bg-accent text-white text-sm flex items-center"
                            >
                              <Save size={14} className="mr-1" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Simple View Mode
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{item.name}</h4>
                            <button
                              onClick={() => setEditingItem({...item})}
                              className="p-1 text-accent hover:bg-accent/10 rounded transition-colors"
                              title="Edit item"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                          
                          <div className="text-xs bg-accent/10 inline-block px-2 py-0.5 rounded mb-2 text-accent">
                            {item.sku}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>
                              <span className="text-muted-foreground">Qty:</span> {item.quantity}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span> {item.weight} lbs
                            </div>
                          </div>
                          
                          <div className="text-sm mb-2">
                            <span className="text-muted-foreground">Size:</span> {item.dimensions.length}" × {item.dimensions.width}" × {item.dimensions.height}"
                          </div>
                          
                          {item.specialInstructions && (
                            <div className="text-sm mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                              <span className="block text-yellow-800 dark:text-yellow-400 font-medium mb-1">Special Instructions:</span>
                              {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                  {searchQuery ? 
                    `No items found matching "${searchQuery}"` : 
                    'No items found for this customer'}
                </div>
              )}
            </div>
          ) : (
            // Orders View - Simplified
            <div>
              {/* Status summary */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-yellow-500/10 p-3 rounded-lg text-center">
                  <div className="text-yellow-700 dark:text-yellow-400 text-2xl font-bold">
                    {selectedCustomer.orders.filter(order => order.status === 'pending').length}
                  </div>
                  <div className="text-sm">Pending</div>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg text-center">
                  <div className="text-blue-700 dark:text-blue-400 text-2xl font-bold">
                    {selectedCustomer.orders.filter(order => order.status === 'loaded').length}
                  </div>
                  <div className="text-sm">Loaded</div>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg text-center">
                  <div className="text-green-700 dark:text-green-400 text-2xl font-bold">
                    {selectedCustomer.orders.filter(order => order.status === 'delivered').length}
                  </div>
                  <div className="text-sm">Delivered</div>
                </div>
              </div>
              
              {/* Email Forwarding - Simplified and prominent */}
              <div className="mb-6 p-4 bg-accent/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Add New Orders
                </h3>
                <p className="text-sm mb-3">
                  To add orders for <strong>{selectedCustomer.name}</strong>, forward order emails to:
                </p>
                <div className="p-3 bg-white dark:bg-gray-800 rounded border font-mono text-sm flex justify-between items-center">
                  <span>orders@onusphere.com</span>
                  <button 
                    onClick={() => copyToClipboard('orders@onusphere.com')} 
                    className="p-1 hover:bg-accent/20 rounded transition-colors" 
                  >
                    {copied ? 
                      <CheckCheck size={18} className="text-green-500" /> : 
                      <Copy size={18} className="text-accent" />}
                  </button>
                </div>
              </div>
              
              {/* Order List - Simplified */}
              <h3 className="text-lg font-semibold mb-4">Orders</h3>
              {selectedCustomer.orders.length > 0 ? (
                <div className="space-y-3">
                  {selectedCustomer.orders.map(order => (
                    <div 
                      key={order.id}
                      className="p-4 border rounded-lg"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-lg">{order.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Items: {order.items}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                          order.status === 'loaded' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                          'bg-green-500/20 text-green-700 dark:text-green-400'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {order.status !== 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(selectedCustomer.id, order.id, 'pending')}
                            className="px-3 py-1 text-sm bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded border border-yellow-500/30 hover:bg-yellow-500/20 transition-colors"
                          >
                            Mark Pending
                          </button>
                        )}
                        {order.status !== 'loaded' && (
                          <button 
                            onClick={() => updateOrderStatus(selectedCustomer.id, order.id, 'loaded')}
                            className="px-3 py-1 text-sm bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                          >
                            Mark Loaded
                          </button>
                        )}
                        {order.status !== 'delivered' && (
                          <button 
                            onClick={() => updateOrderStatus(selectedCustomer.id, order.id, 'delivered')}
                            className="px-3 py-1 text-sm bg-green-500/10 text-green-700 dark:text-green-400 rounded border border-green-500/30 hover:bg-green-500/20 transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                  <Package size={36} className="mx-auto text-muted-foreground mb-2" />
                  <p>No orders found for this customer.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Forward order emails to add them automatically.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TruckLoadingHelper;

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, X, Plus, Package, FileSpreadsheet, Download, Search } from 'lucide-react';
import { useTruckLoading } from '../../context/TruckLoadingContext';
import { Order, AutoEmailRecipient } from '../../types';
import { styles, getAccentStyles, getStatusBadge } from '../../styles';

const CustomerDetails: React.FC = () => {
  const accentStyles = getAccentStyles();
  const { 
    selectedCustomer, 
    selectCustomer, 
    selectOrder, 
    updateOrderStatus,
    addAutoEmailRecipient,
    addOrder
  } = useTruckLoading();

  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const [newOrderName, setNewOrderName] = useState('');
  const [showAddRecipientForm, setShowAddRecipientForm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState<string[]>([]);
  const [showMasterSheet, setShowMasterSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('product');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!selectedCustomer) {
    return null;
  }

  const pendingOrders = selectedCustomer.orders.filter(order => order.status === 'pending');
  const loadedOrders = selectedCustomer.orders.filter(order => order.status === 'loaded');
  const deliveredOrders = selectedCustomer.orders.filter(order => order.status === 'delivered');

  // Generate master order sheet data
  const masterOrderItems = useMemo(() => {
    // Create a map to consolidate items by product name
    const itemsMap = new Map<string, { 
      product: string; 
      totalQuantity: number; 
      price: number; 
      totalValue: number;
      orders: string[] 
    }>(); 
    
    // Loop through all orders with receipts
    selectedCustomer.orders.forEach(order => {
      if (order.receipt?.order_details) {
        // Process each item in the order
        order.receipt.order_details.forEach(item => {
          const existingItem = itemsMap.get(item.product);
          
          if (existingItem) {
            // Update existing item
            existingItem.totalQuantity += item.quantity;
            existingItem.totalValue += (item.price * item.quantity);
            if (!existingItem.orders.includes(order.name)) {
              existingItem.orders.push(order.name);
            }
          } else {
            // Add new item
            itemsMap.set(item.product, {
              product: item.product,
              totalQuantity: item.quantity,
              price: item.price,
              totalValue: item.price * item.quantity,
              orders: [order.name]
            });
          }
        });
      }
    });
    
    // Convert map to array
    return Array.from(itemsMap.values());
  }, [selectedCustomer.orders]);
  
  // Filter and sort the master items
  const filteredAndSortedItems = useMemo(() => {
    let filteredItems = [...masterOrderItems];
    
    // Apply search filtering
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      filteredItems = filteredItems.filter(item => {
        return (
          item.product.toLowerCase().includes(lowerSearchTerm) ||
          item.orders.some(order => order.toLowerCase().includes(lowerSearchTerm))
        );
      });
    }
    
    // Apply sorting
    filteredItems.sort((a, b) => {
      let comparison = 0;
      
      switch(sortField) {
        case 'product':
          comparison = a.product.localeCompare(b.product);
          break;
        case 'quantity':
          comparison = a.totalQuantity - b.totalQuantity;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'value':
          comparison = a.totalValue - b.totalValue;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filteredItems;
  }, [masterOrderItems, searchTerm, sortField, sortDirection]);
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrderName.trim() && selectedCustomer) {
      addOrder(selectedCustomer.id, newOrderName.trim());
      setNewOrderName('');
      setShowAddOrderForm(false);
    }
  };

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientEmail.trim() && selectedNotificationTypes.length > 0 && selectedCustomer) {
      addAutoEmailRecipient(
        selectedCustomer.id,
        recipientEmail.trim(),
        recipientName.trim(),
        selectedNotificationTypes
      );
      setRecipientEmail('');
      setRecipientName('');
      setSelectedNotificationTypes([]);
      setShowAddRecipientForm(false);
    }
  };

  const toggleNotificationType = (type: string) => {
    if (selectedNotificationTypes.includes(type)) {
      setSelectedNotificationTypes(selectedNotificationTypes.filter(t => t !== type));
    } else {
      setSelectedNotificationTypes([...selectedNotificationTypes, type]);
    }
  };

  // Helper to render orders with the given status
  const renderOrdersList = (orders: Order[], title: string) => {
    if (orders.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium uppercase text-[#6B7280] mb-3">{title}</h3>
        <div className="space-y-2">
          {orders.map(order => (
            <div
              key={order.id}
              onClick={() => selectOrder(order)}
              className={styles.orderItem}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className={`mr-3 ${styles.iconContainer} !p-2`}>
                    <Package size={16} className={`text-[${accentStyles.primary}]`} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-[#1F2937]">{order.name}</h4>
                    {order.receipt && (
                      <div className="flex items-center text-xs text-[#6B7280]">
                        <Clock size={12} className="mr-1" />
                        <span>
                          Ordered: {new Date(order.receipt.date_ordered).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span className={getStatusBadge(order.status, true)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4">
      <button
        onClick={() => selectCustomer(null)}
        className={`mb-4 flex items-center text-sm hover:text-[${accentStyles.primary}] transition-colors`}
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Customers
      </button>

      <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3 text-[#1F2937]">{selectedCustomer.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {selectedCustomer.email && (
            <div className="flex items-center text-sm">
              <Mail size={16} className="mr-2 text-[#6B7280]" />
              <span className="text-[#1F2937]">{selectedCustomer.email}</span>
            </div>
          )}
          {selectedCustomer.phone && (
            <div className="flex items-center text-sm">
              <Phone size={16} className="mr-2 text-[#6B7280]" />
              <span className="text-[#1F2937]">{selectedCustomer.phone}</span>
            </div>
          )}
          {selectedCustomer.address && (
            <div className="flex items-start text-sm col-span-full">
              <MapPin size={16} className="mr-2 text-[#6B7280] flex-shrink-0 mt-0.5" />
              <span className="text-[#1F2937]">{selectedCustomer.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-[#1F2937]">Orders</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowMasterSheet(true)}
            className="text-[#1F2937] hover:text-[#1F2937]/80 py-1.5 px-3 rounded-md border border-[#E5E7EB] text-sm font-medium transition-colors flex items-center hover:bg-[#F9F9FA]"
          >
            <FileSpreadsheet size={16} className="mr-1 text-[#6B7280]" />
            Master Sheet
          </button>
          <button
            onClick={() => setShowAddOrderForm(true)}
            className={styles.primaryButton}
          >
            <Plus size={16} className="mr-1" />
            Add Order
          </button>
        </div>
      </div>

      {renderOrdersList(pendingOrders, 'Pending Orders')}
      {renderOrdersList(loadedOrders, 'Loaded Orders')}
      {renderOrdersList(deliveredOrders, 'Delivered Orders')}

      {selectedCustomer.orders.length === 0 && (
        <div className={styles.emptyStateContainer}>
          <p className="text-[#6B7280]">No orders found for this customer</p>
          <button
            onClick={() => setShowAddOrderForm(true)}
            className={`mt-3 text-[${accentStyles.primary}] hover:underline text-sm`}
          >
            Add an order
          </button>
        </div>
      )}

      {/* Auto Email Recipients Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[#1F2937]">Automatic Email Recipients</h3>
          <button
            onClick={() => setShowAddRecipientForm(true)}
            className="text-[#1F2937] hover:text-[#1F2937]/80 py-1.5 px-3 rounded-md border border-[#E5E7EB] text-sm font-medium transition-colors flex items-center hover:bg-[#F9F9FA]"
          >
            <Plus size={14} className="mr-1" />
            Add Recipient
          </button>
        </div>

        {(!selectedCustomer.autoEmailRecipients || selectedCustomer.autoEmailRecipients.length === 0) ? (
          <div className={styles.emptyStateContainer}>
            <p className="text-[#6B7280]">No automatic email recipients configured</p>
            <p className="text-xs text-[#6B7280] mt-1">
              Add recipients to automatically send them loading instructions and order updates
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedCustomer.autoEmailRecipients?.map((recipient: AutoEmailRecipient) => (
              <div key={recipient.id} className="bg-white border border-[#E5E7EB] rounded-md p-3 shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">
                      {recipient.name || recipient.email}
                    </h4>
                    {recipient.name && (
                      <p className="text-sm text-muted-foreground">{recipient.email}</p>
                    )}
                  </div>
                  <div className="space-x-1">
                    {recipient.notificationTypes.includes('loading-instructions') && (
                      <span className={`inline-block px-2 py-1 text-xs bg-[${accentStyles.light}] text-[${accentStyles.primary}] rounded`}>
                        Loading Instructions
                      </span>
                    )}
                    {recipient.notificationTypes.includes('new-orders') && (
                      <span className={`inline-block px-2 py-1 text-xs bg-[${accentStyles.light}] text-[${accentStyles.primary}] rounded`}>
                        New Orders
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Order Modal */}
      {showAddOrderForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-lg border border-[#E5E7EB]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-[#1F2937]">Add New Order</h3>
                <button
                  onClick={() => setShowAddOrderForm(false)}
                  className="text-[#6B7280] p-1 hover:text-[#1F2937] rounded-sm"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddOrder}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="orderName" className="block text-sm font-medium mb-1 text-[#1F2937]">
                      Order Name *
                    </label>
                    <input
                      id="orderName"
                      type="text"
                      value={newOrderName}
                      onChange={(e) => setNewOrderName(e.target.value)}
                      className={styles.input}
                      required
                      placeholder="Enter order name or reference"
                    />
                  </div>

                  <div className={styles.notificationContainer}>
                    <p className={`text-sm text-[${accentStyles.primary}]`}>
                      <strong>Note:</strong> For complete order information including attachments and loading instructions, 
                      we recommend forwarding order emails to orders@onusphere.com
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddOrderForm(false)}
                      className={styles.secondaryButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.primaryButton}
                      disabled={!newOrderName.trim()}
                    >
                      Add Order
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Master Order Sheet Modal */}
      {showMasterSheet && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-[#1F2937]">Master Order Sheet - {selectedCustomer.name}</h3>
              <button
                onClick={() => setShowMasterSheet(false)}
                className="text-[#6B7280] p-1 hover:text-[#1F2937] rounded-sm"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 border-b border-[#E5E7EB] bg-[#F9F9FA]">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                {/* Search field */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-[#6B7280]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by product or order..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-[#E5E7EB] rounded-md focus:ring-1 focus:ring-[#E28743] focus:border-[#E28743] outline-none text-sm"
                  />
                </div>
                
                {/* Export button */}
                <button 
                  className="text-[#1F2937] hover:text-[#1F2937]/80 py-2 px-3 rounded-md border border-[#E5E7EB] text-sm font-medium transition-colors flex items-center hover:bg-white justify-center whitespace-nowrap"
                  onClick={() => {
                    // Create CSV content
                    const headers = ['Product', 'Total Quantity', 'Price', 'Total Value', 'Orders'];
                    const rows = filteredAndSortedItems.map(item => [
                      item.product,
                      item.totalQuantity.toString(),
                      formatPrice(item.price),
                      formatPrice(item.totalValue),
                      item.orders.join(', ')
                    ]);
                    
                    // Combine headers and rows
                    const csvContent = [
                      headers.join(','),
                      ...rows.map(row => row.join(','))
                    ].join('\n');
                    
                    // Create and trigger download
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${selectedCustomer.name.replace(/\s+/g, '_')}_order_sheet.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download size={16} className="mr-1 text-[#6B7280]" />
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-auto flex-grow p-5">
              {masterOrderItems.length > 0 ? (
                <div>
                  {filteredAndSortedItems.length > 0 ? (
                    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9F9FA] border-b border-[#E5E7EB]">
                            <th 
                              className="py-3 px-4 text-left text-sm font-medium text-[#1F2937] cursor-pointer hover:bg-[#F9EFE6]"
                              onClick={() => {
                                setSortDirection(sortField === 'product' && sortDirection === 'asc' ? 'desc' : 'asc');
                                setSortField('product');
                              }}
                            >
                              <div className="flex items-center">
                                Product
                                {sortField === 'product' && (
                                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="py-3 px-4 text-center text-sm font-medium text-[#1F2937] cursor-pointer hover:bg-[#F9EFE6]"
                              onClick={() => {
                                setSortDirection(sortField === 'quantity' && sortDirection === 'asc' ? 'desc' : 'asc');
                                setSortField('quantity');
                              }}
                            >
                              <div className="flex items-center justify-center">
                                Total Quantity
                                {sortField === 'quantity' && (
                                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="py-3 px-4 text-right text-sm font-medium text-[#1F2937] cursor-pointer hover:bg-[#F9EFE6]"
                              onClick={() => {
                                setSortDirection(sortField === 'price' && sortDirection === 'asc' ? 'desc' : 'asc');
                                setSortField('price');
                              }}
                            >
                              <div className="flex items-center justify-end">
                                Price
                                {sortField === 'price' && (
                                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="py-3 px-4 text-right text-sm font-medium text-[#1F2937] cursor-pointer hover:bg-[#F9EFE6]"
                              onClick={() => {
                                setSortDirection(sortField === 'value' && sortDirection === 'asc' ? 'desc' : 'asc');
                                setSortField('value');
                              }}
                            >
                              <div className="flex items-center justify-end">
                                Total Value
                                {sortField === 'value' && (
                                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-[#1F2937]">
                              Orders
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {filteredAndSortedItems.map((item, index) => (
                            <tr key={index} className="text-sm hover:bg-[#F9EFE6] transition-colors">
                              <td className="py-3 px-4 text-[#1F2937]">{item.product}</td>
                              <td className="py-3 px-4 text-center text-[#1F2937]">{item.totalQuantity}</td>
                              <td className="py-3 px-4 text-right text-[#1F2937]">{formatPrice(item.price)}</td>
                              <td className="py-3 px-4 text-right text-[#1F2937]">
                                {formatPrice(item.totalValue)}
                              </td>
                              <td className="py-3 px-4 text-[#6B7280] text-sm">
                                {item.orders.join(', ')}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-[#F9EFE6] font-medium">
                            <td className="py-3 px-4 text-[#1F2937]" colSpan={3}>Total</td>
                            <td className="py-3 px-4 text-right text-[#1F2937]">
                              {formatPrice(filteredAndSortedItems.reduce((sum, item) => sum + item.totalValue, 0))}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyStateContainer}>
                      <p className="text-[#6B7280]">No matches found for "{searchTerm}"</p>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-[#E28743] hover:underline text-sm"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.emptyStateContainer}>
                  <p className="text-[#6B7280]">No order items found for this customer</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    When this customer has orders with items, they will appear here
                  </p>
                </div>
              )}
            </div>
            
            <div className="border-t border-[#E5E7EB] p-4 bg-[#F9F9FA] flex justify-end">
              <button
                onClick={() => setShowMasterSheet(false)}
                className={styles.secondaryButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Email Recipient Modal */}
      {showAddRecipientForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-lg border border-[#E5E7EB]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-[#1F2937]">Add Email Recipient</h3>
                <button
                  onClick={() => setShowAddRecipientForm(false)}
                  className="text-[#6B7280] p-1 hover:text-[#1F2937] rounded-sm"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddRecipient}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="recipientEmail" className="block text-sm font-medium mb-1 text-[#1F2937]">
                      Email Address *
                    </label>
                    <input
                      id="recipientEmail"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className={styles.input}
                      required
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="recipientName" className="block text-sm font-medium mb-1 text-[#1F2937]">
                      Recipient Name (Optional)
                    </label>
                    <input
                      id="recipientName"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className={styles.input}
                      placeholder="Enter recipient name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#1F2937]">
                      Notification Types *
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="loadingInstructions"
                          checked={selectedNotificationTypes.includes('loading-instructions')}
                          onChange={() => toggleNotificationType('loading-instructions')}
                          className={`mr-2 h-4 w-4 border-[${accentStyles.primary}] rounded text-[${accentStyles.primary}] focus:ring-[${accentStyles.primary}]`}
                        />
                        <label htmlFor="loadingInstructions" className="text-sm cursor-pointer text-[#1F2937]">
                          Loading Instructions (When an order is marked as loaded)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newOrders"
                          checked={selectedNotificationTypes.includes('new-orders')}
                          onChange={() => toggleNotificationType('new-orders')}
                          className={`mr-2 h-4 w-4 border-[${accentStyles.primary}] rounded text-[${accentStyles.primary}] focus:ring-[${accentStyles.primary}]`}
                        />
                        <label htmlFor="newOrders" className="text-sm cursor-pointer text-[#1F2937]">
                          New Orders (When new orders are added for this customer)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRecipientForm(false)}
                      className={styles.secondaryButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.primaryButton}
                      disabled={!recipientEmail.trim() || selectedNotificationTypes.length === 0}
                    >
                      Add Recipient
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;

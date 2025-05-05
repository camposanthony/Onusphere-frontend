import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  ExternalLink, 
  TruckIcon, 
  Mail, 
  HelpCircle, 
  MessageSquare, 
  CheckCheck,
  Send,
  X
} from 'lucide-react';
import { Customer, Order, AutoEmailRecipient } from './types';
import TruckModelViewer from './TruckModelViewer';
import { styles, getStatusBadge } from './styles';

interface OrderDetailsProps {
  customer: Customer;
  order: Order;
  onBackToOrders: () => void;
  onUpdateOrderStatus: (customerId: string, orderId: string, status: 'pending' | 'loaded' | 'delivered') => void;
  onAddAutoEmailRecipient: (customerId: string, email: string, name: string, notificationTypes: string[]) => void;
  onRemoveAutoEmailRecipient: (customerId: string, recipientId: string) => void;
}

const OrderDetails = ({ 
  customer, 
  order, 
  onBackToOrders,
  onUpdateOrderStatus,
  onAddAutoEmailRecipient,
  onRemoveAutoEmailRecipient
}: OrderDetailsProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'instructions' | 'auto-email'>('details');
  
  // Question functionality
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  
  // Email functionality
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  // Auto-email functionality
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState<string[]>(['loading-instructions']);
  const [autoEmailUpdated, setAutoEmailUpdated] = useState(false);

  // Submit question function
  const submitQuestion = () => {
    // Here you would typically send the question to your backend
    console.log(`Question about order ${order.id}: ${question}`);
    setQuestionSubmitted(true);
    
    // Reset after a few seconds
    setTimeout(() => {
      setShowQuestionForm(false);
      setQuestion('');
      setQuestionSubmitted(false);
    }, 3000);
  };

  // Send email function
  const sendInstructionsEmail = () => {
    // Here you would typically send the email via your backend
    console.log(`Sending loading instructions for order ${order.id} to ${emailAddress}`);
    setEmailSent(true);
    
    // Reset after a few seconds
    setTimeout(() => {
      setShowEmailForm(false);
      setEmailAddress('');
      setEmailSent(false);
    }, 3000);
  };

  // Add auto-email recipient
  const addAutoEmailRecipient = () => {
    onAddAutoEmailRecipient(customer.id, newRecipientEmail, newRecipientName, selectedNotificationTypes);
    setAutoEmailUpdated(true);
    
    // Reset form
    setTimeout(() => {
      setNewRecipientEmail('');
      setNewRecipientName('');
      setSelectedNotificationTypes(['loading-instructions']);
      setAutoEmailUpdated(false);
    }, 3000);
  };

  // Ensure the order has the required data
  if (!order.receipt) {
    return (
      <div className={styles.contentContainer} style={{ borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <FileText size={20} className="mr-2 text-accent" />
            {order.name}
          </h2>
          <button 
            onClick={onBackToOrders}
            className="px-3 py-1.5 rounded border hover:bg-accent/10 transition-colors text-sm flex items-center"
            style={{ borderColor: 'var(--border)' }}
          >
            ← Back to Orders
          </button>
        </div>
        <div className="text-center p-8">
          <p className="text-muted-foreground">Order details are not available. This may be a placeholder order or the details are still processing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
      {/* Order Header with back button */}
      <div className="p-6 pb-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <FileText size={20} className="mr-2 text-accent" />
            {order.name}
          </h2>
          <button 
            onClick={onBackToOrders}
            className="px-3 py-1.5 rounded border hover:bg-accent/10 transition-colors text-sm flex items-center"
            style={{ borderColor: 'var(--border)' }}
          >
            ← Back to Orders
          </button>
        </div>
        
        {/* Order Header Info - Visible in all tabs */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-4">
              <div className={getStatusBadge(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">ID:</span> {order.receipt.order_id}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Date:</span> {order.receipt.date_ordered}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className={styles.tabContainer} style={{ borderColor: 'var(--border)' }}>
          <button
            className={activeTab === 'details' ? styles.activeTab : styles.inactiveTab}
            onClick={() => {
              setActiveTab('details');
              setShowQuestionForm(false);
              setShowEmailForm(false);
            }}
          >
            <FileText size={16} className="mr-2" />
            Order Details
          </button>
          <button
            className={activeTab === 'instructions' ? styles.activeTab : styles.inactiveTab}
            onClick={() => {
              setActiveTab('instructions');
              setShowQuestionForm(false);
              setShowEmailForm(false);
            }}
            disabled={!order.receipt.loading_instructions}
          >
            <TruckIcon size={16} className="mr-2" />
            Loading Instructions
          </button>
          <button
            className={activeTab === 'auto-email' ? styles.activeTab : styles.inactiveTab}
            onClick={() => {
              setActiveTab('auto-email');
              setShowQuestionForm(false);
              setShowEmailForm(false);
            }}
          >
            <Mail size={16} className="mr-2" />
            Auto-Email Setup
          </button>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        {/* Order Details Tab Content */}
        {activeTab === 'details' && (
          <>
            <div className={styles.twoColumnGrid + " mb-4"}>
              <div className={styles.infoCard}>
                <div className="text-sm text-muted-foreground mb-1">Customer ID</div>
                <div className="font-medium">{order.receipt.customer_id}</div>
              </div>
              <div className={styles.infoCard + " flex items-start"}>
                <Calendar size={18} className="mr-2 mt-0.5 text-accent" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Upcoming Shipment</div>
                  <div className="font-medium">
                    {new Date(order.receipt.upcoming_shipments).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          
            {/* Order Details */}
            <div className="mb-6">
              <h4 className={styles.subSectionTitle}>Order Details</h4>
              <div className="overflow-x-auto">
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableRow} style={{ borderColor: 'var(--border)' }}>
                      <th className="py-2 px-4 text-left">Product</th>
                      <th className={styles.tableHeader + " text-right"}>Quantity</th>
                      <th className={styles.tableHeader + " text-right"}>Price</th>
                      <th className={styles.tableHeader + " text-right"}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.receipt.order_details.map((item, index) => (
                      <tr key={index} className={styles.tableRow} style={{ borderColor: 'var(--border)' }}>
                        <td className="py-2 px-4">{item.product}</td>
                        <td className={styles.tableCell + " text-right"}>{item.quantity}</td>
                        <td className={styles.tableCell + " text-right"}>${item.price.toFixed(2)}</td>
                        <td className={styles.tableCell + " text-right"}>${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-medium">
                      <td className={styles.tableCell} colSpan={3}>Total</td>
                      <td className="py-2 px-4 text-right">
                        ${order.receipt.order_details.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* PDF Link */}
            <div className="mb-4">
              <a 
                href={order.receipt.order_pdf_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.primaryButton + " rounded-lg"}
              >
                <FileText size={16} className="mr-2" />
                View PDF Invoice
                <ExternalLink size={14} className="ml-2" />
              </a>
            </div>
          </>
        )}
        
        {/* Loading Instructions Tab Content */}
        {activeTab === 'instructions' && order.receipt.loading_instructions && (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className={styles.subSectionTitle}>
                  <TruckIcon size={18} className="mr-2 text-accent" />
                  {order.receipt.loading_instructions.truck_type}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setShowEmailForm(!showEmailForm);
                      setShowQuestionForm(false);
                    }}
                    className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent flex items-center text-sm"
                    title="Send instructions via email"
                  >
                    <Mail size={16} className="mr-1" />
                    Email Instructions
                  </button>
                  <button 
                    onClick={() => {
                      setShowQuestionForm(!showQuestionForm);
                      setShowEmailForm(false);
                    }}
                    className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent flex items-center text-sm"
                    title="Ask a question about loading instructions"
                  >
                    <HelpCircle size={16} className="mr-1" />
                    Ask Question
                  </button>
                </div>
              </div>
              
              {/* Email Form */}
              {showEmailForm && (
                <div className="mb-4 p-4 border rounded-lg bg-accent/5" style={{ borderColor: 'var(--border)' }}>
                  {!emailSent ? (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Send Loading Instructions via Email</h4>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="recipient@example.com"
                          className={styles.input + " flex-grow"}
                          style={{ borderColor: 'var(--border)' }}
                        />
                        <button
                          onClick={sendInstructionsEmail}
                          disabled={!emailAddress.trim()}
                          className="px-3 py-1 rounded bg-accent text-white flex items-center disabled:opacity-50"
                        >
                          <Send size={14} className="mr-1" />
                          Send
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-green-600 dark:text-green-400">
                      <CheckCheck size={20} className="inline mr-1" />
                      Instructions sent successfully!
                    </div>
                  )}
                </div>
              )}
              
              {/* Question Form */}
              {showQuestionForm && (
                <div className="mb-4 p-4 border rounded-lg bg-accent/5" style={{ borderColor: 'var(--border)' }}>
                  {!questionSubmitted ? (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Ask a Question About These Instructions</h4>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        className={styles.textarea}
                        style={{ borderColor: 'var(--border)' }}
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={submitQuestion}
                          disabled={!question.trim()}
                          className="px-3 py-1 rounded bg-accent text-white flex items-center disabled:opacity-50"
                        >
                          <MessageSquare size={14} className="mr-1" />
                          Submit Question
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-green-600 dark:text-green-400">
                      <CheckCheck size={20} className="inline mr-1" />
                      Question submitted successfully! We'll respond shortly.
                    </div>
                  )}
                </div>
              )}
              
              {/* 3D Visualization */}
              <div className="mb-6">
                <h4 className={styles.subSectionTitle}>Loading Visualization</h4>
                <TruckModelViewer 
                  modelUrl={order.receipt.loading_instructions.visual_model_url} 
                  truckType={order.receipt.loading_instructions.truck_type}
                />
              </div>
              
              {/* Verbal Instructions */}
              <div className="mb-4">
                <h4 className={styles.subSectionTitle}>Verbal Instructions</h4>
                <div className={styles.notificationContainer} style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm">{order.receipt.loading_instructions.verbal}</p>
                </div>
              </div>
              
              {/* Special Notes - if available */}
              {order.receipt.loading_instructions.special_notes && (
                <div className="mb-4">
                  <h4 className={styles.subSectionTitle}>Special Notes</h4>
                  <div className={styles.specialNotesContainer}>
                    <p className="text-sm">{order.receipt.loading_instructions.special_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Auto-Email Setup Tab Content */}
        {activeTab === 'auto-email' && (
          <div className="mb-6">
            <div className="mb-4">
              <h3 className={styles.subSectionTitle}>Auto-Email Recipients</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add email addresses that should automatically receive loading instructions and other notifications for {customer.name}.
              </p>
              
              {/* Add recipient form */}
              <div className={styles.formContainer} style={{ borderColor: 'var(--border)' }}>
                <h4 className="text-md font-medium mb-3">Add New Recipient</h4>
                
                <div className={styles.twoColumnGrid + " mb-4"}>
                  <div>
                    <label className="block text-sm mb-1 font-medium">Email Address *</label>
                    <input 
                      type="email" 
                      value={newRecipientEmail}
                      onChange={(e) => setNewRecipientEmail(e.target.value)}
                      placeholder="email@example.com"
                      className={styles.input}
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium">Name (Optional)</label>
                    <input 
                      type="text" 
                      value={newRecipientName}
                      onChange={(e) => setNewRecipientName(e.target.value)}
                      placeholder="Contact name or department"
                      className={styles.input}
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm mb-2 font-medium">Notification Types</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedNotificationTypes.includes('all')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotificationTypes(['all']);
                          } else {
                            setSelectedNotificationTypes(['loading-instructions']);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">All notifications</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedNotificationTypes.includes('loading-instructions')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotificationTypes(prev => 
                              prev.includes('all') ? prev : [...prev, 'loading-instructions']
                            );
                          } else {
                            setSelectedNotificationTypes(prev => 
                              prev.filter(type => type !== 'loading-instructions')
                            );
                          }
                        }}
                        disabled={selectedNotificationTypes.includes('all')}
                        className="rounded"
                      />
                      <span className="text-sm">Loading Instructions</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedNotificationTypes.includes('new-orders')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotificationTypes(prev => 
                              prev.includes('all') ? prev : [...prev, 'new-orders']
                            );
                          } else {
                            setSelectedNotificationTypes(prev => 
                              prev.filter(type => type !== 'new-orders')
                            );
                          }
                        }}
                        disabled={selectedNotificationTypes.includes('all')}
                        className="rounded"
                      />
                      <span className="text-sm">New Orders</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedNotificationTypes.includes('status-change')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotificationTypes(prev => 
                              prev.includes('all') ? prev : [...prev, 'status-change']
                            );
                          } else {
                            setSelectedNotificationTypes(prev => 
                              prev.filter(type => type !== 'status-change')
                            );
                          }
                        }}
                        disabled={selectedNotificationTypes.includes('all')}
                        className="rounded"
                      />
                      <span className="text-sm">Status Changes</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={addAutoEmailRecipient}
                    disabled={!newRecipientEmail.trim()}
                    className={`${styles.primaryButton} disabled:opacity-50`}
                  >
                    <Send size={16} className="mr-2" />
                    Add Recipient
                  </button>
                </div>
                
                {autoEmailUpdated && (
                  <div className="mt-3 text-center text-green-600 dark:text-green-400">
                    <CheckCheck size={18} className="inline mr-1" />
                    Email recipient added successfully!
                  </div>
                )}
              </div>
              
              {/* Current recipients */}
              <div>
                <h4 className={styles.subSectionTitle}>Current Recipients</h4>
                
                {customer.autoEmailRecipients && customer.autoEmailRecipients.length > 0 ? (
                  <div className="space-y-3">
                    {customer.autoEmailRecipients.map(recipient => (
                      <div 
                        key={recipient.id} 
                        className="p-3 border rounded-lg flex justify-between items-center"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div>
                          <div className="font-medium">{recipient.email}</div>
                          {recipient.name && (
                            <div className="text-sm text-muted-foreground">{recipient.name}</div>
                          )}
                          <div className="mt-1 flex flex-wrap gap-1">
                            {recipient.notificationTypes.includes('all') ? (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">All Notifications</span>
                            ) : (
                              <>
                                {recipient.notificationTypes.includes('loading-instructions') && (
                                  <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">Loading Instructions</span>
                                )}
                                {recipient.notificationTypes.includes('new-orders') && (
                                  <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">New Orders</span>
                                )}
                                {recipient.notificationTypes.includes('status-change') && (
                                  <span className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">Status Changes</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => onRemoveAutoEmailRecipient(customer.id, recipient.id)}
                          className="p-1 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Remove recipient"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyStateContainer} style={{ borderColor: 'var(--border)' }}>
                    <Mail size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      No auto-email recipients set up yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Order Action Buttons */}
        <div className="pt-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-wrap gap-2">
            {order.status !== 'pending' && (
              <button 
                onClick={() => onUpdateOrderStatus(customer.id, order.id, 'pending')}
                className={`px-3 py-1 text-sm rounded border border-yellow-500/30 hover:bg-yellow-500/20 transition-colors ${getStatusBadge('pending').replace('px-3 py-1 rounded-full', '')}`}
              >
                Mark Pending
              </button>
            )}
            {order.status !== 'loaded' && (
              <button 
                onClick={() => onUpdateOrderStatus(customer.id, order.id, 'loaded')}
                className={`px-3 py-1 text-sm rounded border border-blue-500/30 hover:bg-blue-500/20 transition-colors ${getStatusBadge('loaded').replace('px-3 py-1 rounded-full', '')}`}
              >
                Mark Loaded
              </button>
            )}
            {order.status !== 'delivered' && (
              <button 
                onClick={() => onUpdateOrderStatus(customer.id, order.id, 'delivered')}
                className={`px-3 py-1 text-sm rounded border border-green-500/30 hover:bg-green-500/20 transition-colors ${getStatusBadge('delivered').replace('px-3 py-1 rounded-full', '')}`}
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

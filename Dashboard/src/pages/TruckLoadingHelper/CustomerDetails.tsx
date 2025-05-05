import { Copy, CheckCircle, Mail } from 'lucide-react';
import { Customer, Order } from './types';
import { styles } from './styles';
import { useState } from 'react';

interface CustomerDetailsProps {
  customer: Customer;
  onBackToCustomers: () => void;
  onSelectOrder: (order: Order) => void;
  onAddOrder: (customerId: string, orderName: string) => void;
}

const CustomerDetails = ({ 
  customer,
  onBackToCustomers,
  onSelectOrder,
  onAddOrder 
}: CustomerDetailsProps) => {
  // Group orders by status for better organization
  const pendingOrders = customer.orders.filter(order => order.status === 'pending');
  const loadedOrders = customer.orders.filter(order => order.status === 'loaded');
  const deliveredOrders = customer.orders.filter(order => order.status === 'delivered');

  // State for copy email button
  const [copied, setCopied] = useState(false);
  
  // Email address for order forwarding
  const orderEmail = 'orders@onusphere.com';
  
  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(orderEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.sectionContainer}>
      {/* Customer header with back button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className={styles.sectionTitle}>{customer.name}</h2>
        <button 
          onClick={onBackToCustomers}
          className={styles.secondaryButton}
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="mr-1">←</span> Back to Customers
        </button>
      </div>
      
      {/* Customer info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {customer.email && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm text-muted-foreground mb-1">Email</div>
            <div className="font-medium">{customer.email}</div>
          </div>
        )}
        {customer.phone && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm text-muted-foreground mb-1">Phone</div>
            <div className="font-medium">{customer.phone}</div>
          </div>
        )}
        {customer.address && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm text-muted-foreground mb-1">Address</div>
            <div className="font-medium">{customer.address}</div>
          </div>
        )}
      </div>
      
      {/* Orders section */}
      {/* Email section for adding orders */}
      <div className={styles.formContainer} style={{ borderColor: 'var(--border)' }}>
        <h3 className={styles.subSectionTitle}>
          <Mail className="mr-2 text-accent" size={16} />
          Add Orders via Email
        </h3>
          
        <div className="flex items-center bg-accent/5 rounded p-3 mb-3">
          <div className="flex-1 font-mono text-sm pr-3">
            {orderEmail}
          </div>
          <button 
            onClick={copyEmailToClipboard}
            className={styles.secondaryButton}
            aria-label="Copy email address"
            style={{ borderColor: 'var(--border)' }}
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            <span className="ml-1.5">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
          
        <p className="text-sm text-muted-foreground">
          Forward order emails to this address. Orders will automatically appear on this page within 5 minutes.
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className={styles.subSectionTitle}>Orders</h3>
        </div>
        
        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              Pending Orders
            </h4>
            <div className={styles.grid}>
              {pendingOrders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className={styles.card}
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{order.name}</h4>
                    <div className={styles.smallPendingBadge}>Pending</div>
                  </div>
                  {order.receipt && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {order.receipt.order_id && <div>Order #{order.receipt.order_id}</div>}
                      {order.receipt.date_ordered && <div>Ordered: {order.receipt.date_ordered}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Loaded Orders */}
        {loadedOrders.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              Loaded Orders
            </h4>
            <div className={styles.grid}>
              {loadedOrders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className={styles.card}
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{order.name}</h4>
                    <div className={styles.smallLoadedBadge}>Loaded</div>
                  </div>
                  {order.receipt && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {order.receipt.order_id && <div>Order #{order.receipt.order_id}</div>}
                      {order.receipt.date_ordered && <div>Ordered: {order.receipt.date_ordered}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Delivered Orders */}
        {deliveredOrders.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-3 flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Delivered Orders
            </h4>
            <div className={styles.grid}>
              {deliveredOrders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className={styles.card}
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{order.name}</h4>
                    <div className={styles.smallDeliveredBadge}>Delivered</div>
                  </div>
                  {order.receipt && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {order.receipt.order_id && <div>Order #{order.receipt.order_id}</div>}
                      {order.receipt.date_ordered && <div>Ordered: {order.receipt.date_ordered}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* No orders message */}
        {customer.orders.length === 0 && (
          <div className={styles.emptyStateContainer} style={{ borderColor: 'var(--border)' }}>
            <p className="text-muted-foreground">
              No orders found for this customer. Orders will appear here automatically after you forward them to the email address above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;

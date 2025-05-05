import React from 'react';
import { ArrowLeft, FileText, Truck, Calendar } from 'lucide-react';
import { useTruckLoading } from '../../context/TruckLoadingContext';
import { styles, getAccentStyles, getStatusBadge } from '../../styles';

const OrderDetails: React.FC = () => {
  const { selectedOrder, selectedCustomer, selectOrder, updateOrderStatus } = useTruckLoading();
  const accentStyles = getAccentStyles();

  if (!selectedOrder || !selectedCustomer) {
    return null;
  }

  const receipt = selectedOrder.receipt;

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Calculate order totals
  const calculateTotal = () => {
    if (!receipt?.order_details) return 0;
    return receipt.order_details.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Format date properly
  const formatDate = (dateString: string) => {
    try {
      // Check if it's a full ISO string
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      // Otherwise treat as simple date
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      // If parsing fails, return the original string
      return dateString;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4">
      <button
        onClick={() => selectOrder(null)}
        className={`mb-4 flex items-center text-sm hover:text-[${accentStyles.primary}] transition-colors`}
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Customer
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 mb-6 shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-[#1F2937]">{selectedOrder.name}</h2>
            {receipt && (
              <p className="text-sm text-[#6B7280]">
                Order ID: {receipt.order_id}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedOrder.status === 'pending' && (
              <>
                <span className={getStatusBadge('pending')}>
                  Pending
                </span>
                <button
                  onClick={() =>
                    updateOrderStatus(selectedCustomer.id, selectedOrder.id, 'loaded')
                  }
                  className={`${styles.primaryButton} py-1.5 px-3 text-xs`}
                >
                  Mark as Loaded
                </button>
              </>
            )}
            {selectedOrder.status === 'loaded' && (
              <>
                <span className={getStatusBadge('loaded')}>
                  Loaded
                </span>
                <button
                  onClick={() =>
                    updateOrderStatus(selectedCustomer.id, selectedOrder.id, 'delivered')
                  }
                  className={`${styles.primaryButton} py-1.5 px-3 text-xs`}
                >
                  Mark as Delivered
                </button>
              </>
            )}
            {selectedOrder.status === 'delivered' && (
              <span className={getStatusBadge('delivered')}>
                Delivered
              </span>
            )}
          </div>
        </div>

        {receipt && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-[#6B7280]" />
              <div>
                <p className="text-[#6B7280]">Date Ordered</p>
                <p className="text-[#1F2937]">{formatDate(receipt.date_ordered)}</p>
              </div>
            </div>
            {receipt.upcoming_shipments && (
              <div className="flex items-center">
                <Truck className="mr-2 h-4 w-4 text-[#6B7280]" />
                <div>
                  <p className="text-[#6B7280]">Upcoming Shipment</p>
                  <p className="text-[#1F2937]">{formatDate(receipt.upcoming_shipments)}</p>
                </div>
              </div>
            )}
            {receipt.order_pdf_link && receipt.order_pdf_link !== '#' && (
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-[#6B7280]" />
                <div>
                  <p className="text-[#6B7280]">Invoice PDF</p>
                  <a
                    href={receipt.order_pdf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[${accentStyles.primary}] hover:underline`}
                  >
                    View PDF
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Section */}
      {receipt && receipt.order_details && receipt.order_details.length > 0 && (
        <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden mb-6 shadow-sm">
          <div className="p-4 border-b border-[#E5E7EB] bg-[#F9F9FA]">
            <h3 className="font-medium text-[#1F2937]">Order Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9F9FA] text-sm">
                <tr>
                  <th className="py-3 px-4 text-left text-[#6B7280] font-medium">Product</th>
                  <th className="py-3 px-4 text-right text-[#6B7280] font-medium">Quantity</th>
                  <th className="py-3 px-4 text-right text-[#6B7280] font-medium">Price</th>
                  <th className="py-3 px-4 text-right text-[#6B7280] font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {receipt.order_details.map((item, index) => (
                  <tr key={index} className="text-sm hover:bg-[#F9EFE6] transition-colors">
                    <td className="py-3 px-4 text-[#1F2937]">{item.product}</td>
                    <td className="py-3 px-4 text-right text-[#1F2937]">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-[#1F2937]">{formatPrice(item.price)}</td>
                    <td className="py-3 px-4 text-right text-[#1F2937]">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#F9EFE6] font-medium">
                  <td className="py-3 px-4 text-[#1F2937]" colSpan={3}>
                    Total
                  </td>
                  <td className="py-3 px-4 text-right text-[#1F2937]">
                    {formatPrice(calculateTotal())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading Instructions Section */}
      {receipt && receipt.loading_instructions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 3D Truck Model */}
          {receipt.loading_instructions.visual_model_url && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F9F9FA]">
                <h3 className="font-medium text-[#1F2937]">Truck Model</h3>
                <p className="text-sm text-[#6B7280]">
                  {receipt.loading_instructions.truck_type || "Loading configuration"}
                </p>
              </div>
              <div className="h-64 p-4 bg-[#F9F9FA]/50 flex items-center justify-center">
                <Truck size={48} className="text-[#E28743] opacity-50" />
              </div>
            </div>
          )}
          
          {/* Loading Instructions */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9F9FA]">
              <h3 className="font-medium text-[#1F2937]">Loading Instructions</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-[#1F2937] mb-4">
                {receipt.loading_instructions.verbal || 
                 "Please follow the loading pattern shown in the truck model. Load heaviest items first and distribute weight evenly."}
              </p>
              
              {receipt.loading_instructions.special_notes && (
                <div className="bg-[#FEF3C7]/50 border border-[#D97706]/30 rounded-md p-3 mb-3">
                  <h4 className="text-sm font-medium text-[#D97706] mb-1">Special Notes:</h4>
                  <p className="text-sm text-[#92400E]">{receipt.loading_instructions.special_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

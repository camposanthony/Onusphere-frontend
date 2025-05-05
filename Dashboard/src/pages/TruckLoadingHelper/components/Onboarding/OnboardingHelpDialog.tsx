import React from 'react';
import { X, Info } from 'lucide-react';
import { FiMail } from "react-icons/fi";

interface OnboardingHelpDialogProps {
  onClose: () => void;
}

const OnboardingHelpDialog: React.FC<OnboardingHelpDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-card dark:bg-gray-800 max-w-2xl w-full rounded-lg shadow-lg dark:shadow-xl border border-muted dark:border-gray-700 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-md bg-accent/10 dark:bg-accent/20 flex items-center justify-center mr-3">
                <Info className="text-accent" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-medium">Email-Based Customer Onboarding</h2>
                <p className="text-sm text-muted-foreground">How to add customers and their orders</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-muted-foreground p-1 hover:text-foreground rounded-sm"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded mb-6 text-accent text-sm">
            Customers and their orders are added through our email-based workflow
          </div>
          
          <div className="space-y-6 mb-6">
            {/* Step 1 */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-accent text-white font-medium mr-3.5">
                1
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Find order emails</h4>
                <p className="text-sm text-muted-foreground">
                  Locate an email with order details from the customer you want to add.
                  <strong> Make sure it includes CSV and PDF attachments.</strong>
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-accent text-white font-medium mr-3.5">
                2
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Forward to our system</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Forward the complete email with all attachments to:
                </p>
                <div className="border border-muted dark:border-gray-700 bg-background dark:bg-gray-900 rounded-md p-3 flex items-center">
                  <FiMail className="text-accent mr-2" size={18} />
                  <code className="font-mono bg-accent/10 dark:bg-accent/20 px-2 py-0.5 rounded text-accent">
                    orders@onusphere.com
                  </code>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-accent text-white font-medium mr-3.5">
                3
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Wait for processing</h4>
                <p className="text-sm text-muted-foreground">
                  Our system automatically extracts customer and order details from your forwarded email.
                  This typically takes less than 5 minutes to complete.
                </p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-accent text-white font-medium mr-3.5">
                4
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Customer appears in your dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Once processing is complete, the new customer and their order will appear in your dashboard.
                  You can then view and manage their information.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted dark:border-gray-700 pt-5">
            <h3 className="font-medium mb-2">Tips for best results</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex">
                <span className="text-accent mr-2">•</span>
                <span>Make sure the forwarded email contains all the original content and attachments</span>
              </li>
              <li className="flex">
                <span className="text-accent mr-2">•</span>
                <span>Ensure attachments include order details in CSV or PDF format</span>
              </li>
              <li className="flex">
                <span className="text-accent mr-2">•</span>
                <span>If the customer information is incomplete, you can edit it after processing</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={onClose}
              className="bg-accent hover:bg-accent/90 dark:bg-accent dark:hover:bg-accent/90 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHelpDialog;

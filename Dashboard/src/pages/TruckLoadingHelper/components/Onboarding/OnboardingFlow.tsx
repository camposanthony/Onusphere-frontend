import React from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useTruckLoading } from '../../context/TruckLoadingContext';
import { useTheme } from '../../../../components/ui/ThemeProvider';
import { styles, getAccentStyles } from '../../styles';

const OnboardingFlow: React.FC = () => {
  // We use the ThemeProvider but don't need to directly reference theme here
  // as we're using Tailwind's dark mode classes to handle theme changes
  useTheme();
  const accentStyles = getAccentStyles();
  const { 
    isProcessingEmail, 
    onboardingComplete, 
    simulateEmailProcessing, 
    completeOnboarding 
  } = useTruckLoading();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className={`text-2xl font-semibold mb-2 text-[#1F2937]`}>Welcome to Truck Loading Helper</h1>
        <p className="text-[#6B7280]">
          Our system makes managing truck loading operations easy with an email-based workflow
        </p>
      </div>
      
      {/* Visual step indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center max-w-lg w-full">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              onboardingComplete ? 'bg-[#059669]' : `bg-[${accentStyles.primary}]`
            } text-white`}>
              <Mail size={20} />
            </div>
            <span className="text-xs mt-2 font-medium text-[#1F2937]">Forward Email</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${
            isProcessingEmail || onboardingComplete ? `bg-[${accentStyles.primary}]` : 'bg-[#E5E7EB]'
          }`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isProcessingEmail ? `bg-[${accentStyles.primary}]` : onboardingComplete ? 'bg-[#059669]' : 'bg-[#E5E7EB]'
            } ${isProcessingEmail || onboardingComplete ? 'text-white' : 'text-[#6B7280]'}`}>
              {isProcessingEmail ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
            </div>
            <span className="text-xs mt-2 font-medium text-[#1F2937]">Processing</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${onboardingComplete ? 'bg-[#059669]' : 'bg-[#E5E7EB]'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              onboardingComplete ? 'bg-[#059669]' : 'bg-[#E5E7EB]'
            } ${onboardingComplete ? 'text-white' : 'text-[#6B7280]'}`}>
              <CheckCircle size={20} />
            </div>
            <span className="text-xs mt-2 font-medium text-[#1F2937]">Ready</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-[#E5E7EB]">
        <div className="flex items-start space-x-4 mb-6">
          <div className={`w-12 h-12 rounded-full bg-[${accentStyles.light}] flex items-center justify-center flex-shrink-0`}>
            <Mail className={`text-[${accentStyles.primary}]`} size={22} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#1F2937]">Forward Your First Order Email</h3>
            <p className="text-[#6B7280] text-sm mb-3">
              To get started with the Truck Loading Helper, you'll need to forward an order email from your customer.
            </p>
            <div className={`bg-[${accentStyles.light}] p-3 rounded-md mb-4`}>
              <p className={`text-[${accentStyles.primary}] text-sm font-medium mb-1`}>Email Requirements:</p>
              <ul className={`list-disc list-inside text-[${accentStyles.primary}] text-xs space-y-1`}>
                <li>Must include CSV data and PDF attachments with order details</li>
                <li>Should contain customer information in the body or attachments</li>
                <li>Forward the complete email with all original attachments</li>
              </ul>
            </div>
            <div className="flex items-center p-3 border border-[#E5E7EB] rounded-md bg-white">
              <span className="font-medium mr-2 text-[#1F2937]">Forward to:</span>
              <code className={`text-[${accentStyles.primary}] bg-[${accentStyles.light}] px-2 py-1 rounded text-sm`}>orders@onusphere.com</code>
            </div>
          </div>
        </div>
        
        {!isProcessingEmail && !onboardingComplete && (
          <div className="flex justify-end items-center gap-4 mt-8">
            <p className="text-sm text-[#6B7280]">
              <span className="font-medium">Demo:</span> Click to simulate email forwarding
            </p>
            <button
              onClick={simulateEmailProcessing}
              className={styles.primaryButton}
            >
              Simulate Email Forwarding
            </button>
          </div>
        )}
        
        {isProcessingEmail && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 size={32} className={`text-[${accentStyles.primary}] animate-spin mb-3`} />
            <p className="text-[#6B7280]">Processing your email...</p>
            <p className="text-xs text-[#6B7280] mt-1">This usually takes less than 5 minutes</p>
          </div>
        )}
        
        {onboardingComplete && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#059669] flex items-center justify-center mb-3">
              <CheckCircle size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-medium text-[#1F2937]">Processing Complete!</h3>
            <p className="text-[#6B7280] text-center mb-6">
              Your customer and their order have been added to the system
            </p>
            <button
              onClick={completeOnboarding}
              className={styles.primaryButton}
            >
              View Customer
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E5E7EB]">
        <h3 className="text-base font-medium mb-3 text-[#1F2937]">What happens after forwarding the email?</h3>
        <ol className="space-y-3">
          <li className="flex items-start">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-[${accentStyles.light}] text-[${accentStyles.primary}] text-xs font-medium mr-2 mt-0.5 flex-shrink-0`}>1</span>
            <p className="text-sm text-[#6B7280]">Our system will automatically process the email and extract customer and order information.</p>
          </li>
          <li className="flex items-start">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-[${accentStyles.light}] text-[${accentStyles.primary}] text-xs font-medium mr-2 mt-0.5 flex-shrink-0`}>2</span>
            <p className="text-sm text-[#6B7280]">A new customer profile will be created with their order details.</p>
          </li>
          <li className="flex items-start">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-[${accentStyles.light}] text-[${accentStyles.primary}] text-xs font-medium mr-2 mt-0.5 flex-shrink-0`}>3</span>
            <p className="text-sm text-[#6B7280]">The customer and order will appear in your dashboard within 5 minutes.</p>
          </li>
          <li className="flex items-start">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-[${accentStyles.light}] text-[${accentStyles.primary}] text-xs font-medium mr-2 mt-0.5 flex-shrink-0`}>4</span>
            <p className="text-sm text-[#6B7280]">You can then manage the order and update its status as needed.</p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default OnboardingFlow;

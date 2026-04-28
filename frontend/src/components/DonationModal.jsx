import { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Phone, 
  Sparkles,
  Heart,
  ArrowLeft,
  RefreshCw,
  Shield,
  Clock,
  Zap
} from 'lucide-react';
import DonationForm from './DonationForm';
import { checkTransactionStatus } from '../services/api';

const DonationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('form');
  const [transactionData, setTransactionData] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('form');
        setTransactionData(null);
        setPollingCount(0);
      }, 300);
    }
  }, [isOpen]);

  const handleDonationSuccess = (data) => {
    setTransactionData(data);
    setStep('pending');
    setPollingCount(0);
    startPolling(data.transaction_id);
  };

  const handleDonationError = (error) => {
    setTransactionData({ error });
    setStep('error');
  };

  const startPolling = (transactionId) => {
    const interval = setInterval(async () => {
      try {
        setPollingCount(prev => prev + 1);
        const response = await checkTransactionStatus(transactionId);
        
        if (response.data.status === 'success') {
          clearInterval(interval);
          setStep('success');
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          setStep('error');
        } else if (response.data.status === 'cancelled') {
          clearInterval(interval);
          setStep('error');
        }
      } catch (error) {
        console.error('Polling failed:', error);
      }
    }, 5000);

    setPollingInterval(interval);
    
    setTimeout(() => {
      clearInterval(interval);
      if (step === 'pending') {
        setTransactionData({ error: 'Payment timed out. Please try again.' });
        setStep('error');
      }
    }, 120000);
  };

  if (!isOpen) return null;

  // Determine modal width based on step
  const getModalWidth = () => {
    switch (step) {
      case 'pending':
      case 'success':
      case 'error':
        return 'max-w-lg'; // Narrower for status screens
      default:
        return 'max-w-3xl'; // Wide for the form
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'pending':
        return (
          <div className="text-center py-6">
            <div className="relative flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute inset-0 w-24 h-24 bg-green-300 rounded-full opacity-10 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200">
                  <Phone className="w-12 h-12 text-white animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Loader className="w-6 h-6 text-green-600 animate-spin" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">Check Your Phone</h3>
            <p className="text-gray-500 mb-6 leading-relaxed px-4">
              An M-Pesa STK Push has been sent to your phone.
              Please enter your PIN to complete the payment.
            </p>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 mb-6 border border-green-100">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((dot) => (
                    <div
                      key={dot}
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${dot * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-green-700 font-medium">Waiting for payment confirmation</p>
              <p className="text-xs text-green-600 mt-1">Polling attempt {pollingCount + 1}/24</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Quick Tip</p>
                  <p className="text-xs text-gray-400">Check your phone notifications</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-xl">
                <Shield className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Secure</p>
                  <p className="text-xs text-gray-400">Your PIN is never shared</p>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Cancel Payment
            </button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-6">
            <div className="relative flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-ping"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-500 mb-2">Your support means the world</p>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 mb-6 border border-green-100">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-semibold">Payment Successful</p>
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-green-600">Your donation has been received successfully</p>
              {transactionData?.mpesa_receipt_number && (
                <p className="text-xs text-green-500 mt-2 font-mono">
                  Receipt: {transactionData.mpesa_receipt_number}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button onClick={onClose} className="w-full px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300/50 transform hover:-translate-y-0.5 transition-all duration-200">
                Close & Continue
              </button>
              <button onClick={() => { setStep('form'); setTransactionData(null); }} className="w-full px-6 py-3.5 bg-gray-50 text-gray-600 font-medium rounded-2xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2 text-green-600" />
                Make Another Donation
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-6">
            <div className="relative flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-200">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h3>
            <p className="text-gray-500 mb-6 px-4">
              {transactionData?.error || 'Something went wrong. Please try again.'}
            </p>

            <div className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-100">
              <p className="text-sm text-red-700">Common issues:</p>
              <ul className="text-xs text-red-600 mt-2 space-y-1 text-left">
                <li className="flex items-center"><span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>Wrong PIN entered</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>Insufficient funds</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>Transaction cancelled</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button onClick={() => { setStep('form'); setTransactionData(null); }} className="w-full px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 mr-2" />Try Again
              </button>
              <button onClick={onClose} className="w-full px-6 py-3.5 bg-gray-50 text-gray-600 font-medium rounded-2xl hover:bg-gray-100 transition-all duration-200">Cancel</button>
            </div>
          </div>
        );

      default:
        return (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg shadow-green-200">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Support My Work</h2>
              <p className="text-gray-500 text-sm">Every contribution helps me build and create</p>
            </div>

            <DonationForm 
              onSuccess={handleDonationSuccess}
              onError={handleDonationError}
            />

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                <div className="flex items-center"><Shield className="w-3.5 h-3.5 mr-1.5 text-green-400" />Secure Payment</div>
                <div className="w-px h-3 bg-gray-200"></div>
                <div className="flex items-center"><Zap className="w-3.5 h-3.5 mr-1.5 text-green-400" />Instant M-Pesa STK Push</div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>

        {/* Modal Container - DYNAMIC WIDTH */}
        <div className={`relative bg-white rounded-3xl shadow-2xl ${getModalWidth()} w-full z-10 overflow-hidden animate-fade-in`}>
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 z-20 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Back Button */}
          {step !== 'form' && (
            <button
              onClick={() => {
                if (step === 'success') {
                  onClose();
                } else {
                  setStep('form');
                  setTransactionData(null);
                }
              }}
              className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 z-20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Content */}
          <div className="p-8 md:p-10">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
'use client';

import { useState } from 'react';
import { X, Smartphone, CheckCircle, XCircle } from 'lucide-react';

export default function MpesaSimulation({ isOpen, onClose, amount, onSuccess, onFailure }) {
  const [step, setStep] = useState('phone'); // phone, pin, processing, success, failure
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setStep('pin');
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.length === 4) {
      setStep('processing');
      
      // Simulate processing delay
      setTimeout(() => {
        // 90% success rate simulation
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          setStep('success');
          const transactionId = `MPE${Date.now()}${Math.floor(Math.random() * 1000)}`;
          setTimeout(() => {
            onSuccess(transactionId, phoneNumber);
            handleClose();
          }, 2000);
        } else {
          setStep('failure');
          setTimeout(() => {
            onFailure('Transaction failed. Please try again.');
            handleClose();
          }, 2000);
        }
      }, 2000);
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setPin('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={step === 'processing'}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">M-Pesa Payment</h2>
          <p className="text-gray-600 mt-2">Amount: KES {amount.toLocaleString()}</p>
        </div>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="0712345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">Enter your Safaricom number</p>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300"
              disabled={phoneNumber.length !== 10}
            >
              Send STK Push
            </button>
          </form>
        )}

        {step === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800 text-center">
                STK Push sent to <strong>{phoneNumber}</strong>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter M-Pesa PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                maxLength={4}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300"
              disabled={pin.length !== 4}
            >
              Confirm Payment
            </button>
          </form>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing payment...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Your payment has been received</p>
          </div>
        )}

        {step === 'failure' && (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Failed</h3>
            <p className="text-gray-600">Please try again</p>
          </div>
        )}
      </div>
    </div>
  );
}

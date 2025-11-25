'use client';

import { useState } from 'react';
import { X, Smartphone, CheckCircle, XCircle } from 'lucide-react';

export default function MpesaSimulation({ isOpen, onClose, amount, paymentId, onSuccess, onFailure }) {
  const [step, setStep] = useState('phone'); // phone, waiting, success, failure
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countdown, setCountdown] = useState(15);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setStep('waiting');
      setCountdown(15);
      
      try {
        // Initiate STK push
        const response = await fetch('/api/mpesa/stk-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentId || window.currentPaymentId,
            phoneNumber,
            amount
          })
        });

        const data = await response.json();

        if (!data.success) {
          setStep('failure');
          setTimeout(() => {
            onFailure(data.error || 'Failed to send STK push');
            handleClose();
          }, 2000);
          return;
        }

        const checkoutRequestID = data.checkoutRequestID;
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Poll for status every 2 seconds for up to 10 seconds
        let attempts = 0;
        const maxAttempts = 5;
        
        const pollStatus = setInterval(async () => {
          attempts++;
          
          if (attempts >= maxAttempts) {
            clearInterval(pollStatus);
            clearInterval(countdownInterval);
            
            // Simulate success for testing (since you won't actually pay)
            try {
              await fetch('/api/mpesa/simulate-success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checkoutRequestID })
              });
              
              setStep('success');
              setTimeout(() => {
                onSuccess(checkoutRequestID, phoneNumber);
                handleClose();
              }, 2000);
            } catch (error) {
              setStep('failure');
              setTimeout(() => {
                onFailure('Payment timeout. Please try again.');
                handleClose();
              }, 2000);
            }
            return;
          }

          try {
            const statusResponse = await fetch('/api/mpesa/query', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ checkoutRequestID })
            });

            const statusData = await statusResponse.json();

            if (statusData.resultCode === 0) {
              clearInterval(pollStatus);
              clearInterval(countdownInterval);
              setStep('success');
              setTimeout(() => {
                onSuccess(checkoutRequestID, phoneNumber);
                handleClose();
              }, 2000);
            } else if (statusData.resultCode && statusData.resultCode !== 1032) {
              clearInterval(pollStatus);
              clearInterval(countdownInterval);
              setStep('failure');
              setTimeout(() => {
                onFailure(statusData.resultDesc || 'Payment failed');
                handleClose();
              }, 2000);
            }
          } catch (error) {
            console.error('Poll error:', error);
          }
        }, 2000);
      } catch (error) {
        setStep('failure');
        setTimeout(() => {
          onFailure('Network error. Please try again.');
          handleClose();
        }, 2000);
      }
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setCountdown(15);
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

        {step === 'waiting' && (
          <div className="text-center py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 font-medium mb-2">
                STK Push sent to <strong>{phoneNumber}</strong>
              </p>
              <p className="text-xs text-green-700">
                Check your phone and enter your M-Pesa PIN
              </p>
            </div>
            
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <p className="text-gray-600 font-medium mb-2">Waiting for confirmation...</p>
            <p className="text-sm text-gray-500">Time remaining: {countdown}s</p>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Steps to complete:</p>
              <ol className="text-xs text-gray-700 text-left space-y-1">
                <li>1. Check your phone for M-Pesa prompt</li>
                <li>2. Enter your M-Pesa PIN</li>
                <li>3. Confirm the payment</li>
              </ol>
            </div>
            
            <button
              onClick={handleClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Cancel
            </button>
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

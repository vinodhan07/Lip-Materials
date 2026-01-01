'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';
import { FaQrcode, FaCheckCircle, FaTimes, FaCopy, FaMobileAlt } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [upiId] = useState('lip.packaging@paytm');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | 'verifying'>('pending');
  const [transactionId, setTransactionId] = useState('');
  const [showQRCode, setShowQRCode] = useState(true);
  
  // Generate UPI payment string
  const upiPaymentString = order && orderId 
    ? `upi://pay?pa=${upiId}&am=${order.finalTotal.toFixed(2)}&cu=INR&tn=LIP Packaging Order ${orderId}`
    : '';

  useEffect(() => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.orderId === orderId);
    
    if (!foundOrder) {
      toast.error('Order not found');
      router.push('/cart');
      return;
    }

    setOrder(foundOrder);
  }, [orderId, router]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied to clipboard!');
  };

  const handleVerifyPayment = async () => {
    if (!order || !orderId) return;

    if (!transactionId.trim()) {
      toast.error('Please enter your transaction ID');
      return;
    }

    setPaymentStatus('verifying');
    toast.loading('Verifying payment...', { id: 'verifying' });

    try {
      // Call backend API to verify payment
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          transactionId: transactionId.trim(),
          upiId,
          amount: order.finalTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      if (data.verified) {
        // Update order status in localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = orders.map((o: Order) =>
          o.orderId === orderId
            ? {
                ...o,
                paymentStatus: 'completed',
                status: 'confirmed',
                transactionId: data.transactionId,
                updatedAt: new Date().toISOString(),
              }
            : o
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        setPaymentStatus('completed');
        toast.success('Payment verified successfully!', { id: 'verifying' });
        
        // Redirect to order confirmation after 2 seconds
        setTimeout(() => {
          router.push(`/order-confirmation?orderId=${orderId}`);
        }, 2000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      setPaymentStatus('pending');
      toast.error(
        error instanceof Error ? error.message : 'Payment verification failed. Please try again.',
        { id: 'verifying' }
      );
    }
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Payment</h1>

        {paymentStatus === 'pending' || paymentStatus === 'verifying' ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Order ID: {order.orderId}</h2>
              <p className="text-gray-600 text-lg">Amount to Pay: <span className="font-bold text-primary-600">{formatPrice(order.finalTotal)}</span></p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Important:</strong> Cash on Delivery (COD) is not available. Only prepaid orders are accepted.
              </p>
            </div>

            {/* UPI Payment Section */}
            <div className="mb-6">
              <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-center text-primary-800">
                  Pay via UPI
                </h3>

                {/* QR Code Section */}
                {showQRCode && upiPaymentString && (
                  <div className="mb-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-primary-300">
                        <QRCodeSVG
                          value={upiPaymentString}
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mb-2">
                      Scan QR Code with any UPI app
                    </p>
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="text-xs text-primary-600 hover:text-primary-700 mx-auto block"
                    >
                      Hide QR Code
                    </button>
                  </div>
                )}

                {!showQRCode && (
                  <button
                    onClick={() => setShowQRCode(true)}
                    className="w-full mb-4 text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center gap-2"
                  >
                    <FaQrcode /> Show QR Code
                  </button>
                )}

                {/* UPI ID Section */}
                <div className="bg-white rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 mb-2 text-center">Pay to UPI ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="font-mono font-semibold text-lg">{upiId}</p>
                    <button
                      onClick={handleCopyUPI}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy UPI ID"
                    >
                      <FaCopy className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800 text-center">
                    <FaMobileAlt className="inline mr-1" />
                    You can also open any UPI app and enter the UPI ID manually
                  </p>
                </div>

                {/* Transaction ID Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / UPI Reference Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID from your UPI app"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={paymentStatus === 'verifying'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    After making payment, enter the transaction ID shown in your UPI app
                  </p>
                </div>

                {/* Verify Payment Button */}
                <button
                  onClick={handleVerifyPayment}
                  disabled={paymentStatus === 'verifying' || !transactionId.trim()}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {paymentStatus === 'verifying' ? 'Verifying Payment...' : 'Verify Payment'}
                </button>
              </div>
            </div>
          </div>
        ) : paymentStatus === 'completed' ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your order {order.orderId} has been confirmed.
            </p>
            <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaTimes className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Please try again or contact support.
            </p>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


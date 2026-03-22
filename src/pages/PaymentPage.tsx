import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Landmark, ShieldCheck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  
  const [txnId] = useState(`TXN${Math.floor(100000 + Math.random() * 900000)}`);
  const [method, setMethod] = useState<'Card' | 'UPI' | 'NetBanking'>('Card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!booking) {
    navigate('/dashboard');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateCard = () => {
    if (method === 'Card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        setError('Please fill in all card details');
        return false;
      }
      if (cardDetails.number.length < 16) {
        setError('Invalid card number');
        return false;
      }
      if (cardDetails.cvv.length < 3) {
        setError('Invalid CVV');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handlePayment = async () => {
    if (!validateCard()) return;

    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(async () => {
      try {
        // Randomly simulate success (90%)
        const isSuccess = Math.random() < 0.9;

        if (!isSuccess) {
          setError('Payment Failed, Try Again');
          setLoading(false);
          return;
        }

        // Success Flow - Generate IDs as requested
        const fakeBookingId = `BOOK${Math.floor(10000 + Math.random() * 90000)}`;
        
        // Save in localStorage as requested:
        // { bookingId, transactionId, type: "flight" or "hotel", amount, date, paymentMethod, status: "confirmed" }
        const localBooking = {
          bookingId: fakeBookingId,
          transactionId: txnId,
          type: booking.type.toLowerCase(),
          amount: booking.amount,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          paymentMethod: method,
          status: "confirmed",
          // Keep original details for the success page display
          originalDetails: booking.details,
          itemType: booking.type
        };

        const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        localStorage.setItem('bookings', JSON.stringify([localBooking, ...existingBookings]));

        // Also save to transactions for the "Payments" section in Dashboard/Transactions
        const localTransaction = {
          _id: txnId,
          bookingId: fakeBookingId,
          paymentMethod: method,
          amount: booking.amount,
          transactionDate: new Date().toISOString(),
          status: 'Success',
          type: booking.type.toLowerCase(),
          name: booking.details.airline || booking.details.name
        };

        const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        localStorage.setItem('transactions', JSON.stringify([localTransaction, ...existingTransactions]));

        // Redirect to "Payment Success / Ticket Page"
        navigate(`/confirmation/${fakeBookingId}`, { 
          state: { 
            booking: localBooking, 
            transaction: localTransaction 
          } 
        });
      } catch (err: any) {
        setError('Payment failed. Please try again.');
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Payment Methods */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-black text-gray-900">Choose Payment Method</h2>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</p>
                <p className="text-sm font-black text-indigo-600">{txnId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <button 
                onClick={() => setMethod('Card')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'Card' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 hover:border-indigo-200 text-gray-400'}`}
              >
                <CreditCard className="w-8 h-8" />
                <span className="text-xs font-bold uppercase tracking-widest">Card</span>
              </button>
              <button 
                onClick={() => setMethod('UPI')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'UPI' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 hover:border-indigo-200 text-gray-400'}`}
              >
                <Smartphone className="w-8 h-8" />
                <span className="text-xs font-bold uppercase tracking-widest">UPI</span>
              </button>
              <button 
                onClick={() => setMethod('NetBanking')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'NetBanking' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 hover:border-indigo-200 text-gray-400'}`}
              >
                <Landmark className="w-8 h-8" />
                <span className="text-xs font-bold uppercase tracking-widest">Net Banking</span>
              </button>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {method === 'Card' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Card Number</label>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <input 
                      type="text" 
                      name="number"
                      value={cardDetails.number}
                      onChange={handleInputChange}
                      placeholder="XXXX XXXX XXXX XXXX" 
                      maxLength={16}
                      className="bg-transparent outline-none text-sm font-semibold w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Expiry Date</label>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <input 
                        type="text" 
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY" 
                        maxLength={5}
                        className="bg-transparent outline-none text-sm font-semibold w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">CVV</label>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <input 
                        type="password" 
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        placeholder="***" 
                        maxLength={3}
                        className="bg-transparent outline-none text-sm font-semibold w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {method === 'UPI' && (
              <div className="p-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                <Smartphone className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Scan QR code or enter UPI ID on the next screen</p>
              </div>
            )}

            {method === 'NetBanking' && (
              <div className="p-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                <Landmark className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Select your bank from the list on the next screen</p>
              </div>
            )}

            <div className="mt-12">
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <>Pay ₹{booking.amount.toLocaleString()} <ArrowRight className="w-6 h-6" /></>
                )}
              </button>
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure 256-bit SSL Encrypted Payment
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-black text-gray-900">{booking.type}</p>
                  <p className="text-xs font-bold text-gray-400">{booking.details.airline || booking.details.name}</p>
                </div>
                <p className="font-black text-gray-900">₹{booking.amount.toLocaleString()}</p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-sm font-bold text-gray-400 uppercase">Total</p>
                <p className="text-2xl font-black text-indigo-600">₹{booking.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-black text-indigo-900 mb-1">Free Cancellation</p>
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">Cancel within 24 hours for a full refund. No questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

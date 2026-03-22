import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Landmark, Calendar, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch from API
        const response = await axios.get('/api/transactions');
        const apiTransactions = response.data;

        // Fetch from localStorage
        const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');

        // Merge and sort by date
        const allTransactions = [...localTransactions, ...apiTransactions].sort((a, b) => {
          return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
        });

        setTransactions(allTransactions);
      } catch (err: any) {
        // If API fails, still show local transactions
        const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        setTransactions(localTransactions);
        setError(err.response?.data?.message || 'Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Card': return <CreditCard className="w-5 h-5" />;
      case 'UPI': return <Smartphone className="w-5 h-5" />;
      case 'NetBanking': return <Landmark className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Transaction <span className="text-indigo-600">History.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg font-medium">View all your payments and booking transactions in one place.</p>
        </div>
      </div>

      <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Method</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-400 max-w-xs mx-auto">Your payment history will appear here once you make a booking.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900">#{tx._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="font-bold text-gray-500">{new Date(tx.transactionDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                          {getMethodIcon(tx.paymentMethod)}
                        </div>
                        <p className="font-bold text-gray-900">{tx.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-lg font-black text-indigo-600">₹{tx.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${tx.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.status === 'Success' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {tx.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

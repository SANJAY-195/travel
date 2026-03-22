import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Bell, TrendingDown, TrendingUp, Trash2, ArrowRight, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface TrackedFlight {
  id: string;
  airline: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  date: string;
  status: string;
  originalPrice: number;
  lastUpdated: string;
  targetPrice?: number;
}

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<TrackedFlight[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const simulatePriceChange = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = watchlist.map(flight => {
        const changePercent = (Math.random() * 10 - 5) / 100; // -5% to +5%
        const newPrice = Math.round(flight.price * (1 + changePercent));
        
        // Mock alert if price drops below target
        if (flight.targetPrice && newPrice <= flight.targetPrice) {
          toast.success(`Price Alert: ${flight.airline} flight to ${flight.to} dropped!`, {
            description: `Current price ₹${newPrice.toLocaleString()} is below your target of ₹${flight.targetPrice.toLocaleString()}`,
            icon: <TrendingDown className="w-4 h-4 text-emerald-500" />
          });
        } else if (newPrice < flight.price) {
           // Random mock "Price dropped!" alert as requested
           if (Math.random() > 0.7) {
             toast.info(`Price dropped!`, {
               description: `${flight.airline} flight is now ₹${newPrice.toLocaleString()}`
             });
           }
        }

        return {
          ...flight,
          price: newPrice,
          lastUpdated: new Date().toISOString()
        };
      });

      setWatchlist(updated);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      setIsRefreshing(false);
      toast.success('Prices updated!');
    }, 1000);
  };

  const removeFromWatchlist = (id: string) => {
    const updated = watchlist.filter(f => f.id !== id);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
    toast.error('Removed from watchlist');
  };

  const setPriceAlert = (id: string) => {
    const target = prompt('Enter your target price (₹):');
    if (target && !isNaN(Number(target))) {
      const updated = watchlist.map(f => 
        f.id === id ? { ...f, targetPrice: Number(target) } : f
      );
      setWatchlist(updated);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      toast.success(`Price alert set at ₹${Number(target).toLocaleString()}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Flight <span className="text-indigo-600">Watchlist.</span>
          </motion.h1>
          <p className="text-gray-500 text-lg">Track prices and get notified when it's the best time to book.</p>
        </div>
        <button 
          onClick={simulatePriceChange}
          disabled={isRefreshing || watchlist.length === 0}
          className="flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Updating Prices...' : 'Refresh Prices'}
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your watchlist is empty</h3>
          <p className="text-gray-400 max-w-xs mx-auto mb-8">Start tracking flights to see price trends and get alerts on drops.</p>
          <button 
            onClick={() => window.location.href = '/flights'}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            Browse Flights
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {watchlist.map((flight, i) => {
              const priceDiff = flight.price - flight.originalPrice;
              const isLower = priceDiff < 0;
              const isHigher = priceDiff > 0;

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  key={flight.id}
                  className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-100/30 transition-all group relative overflow-hidden"
                >
                  {isLower && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
                      Price Dropped!
                    </div>
                  )}
                  
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                      <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center">
                        <Plane className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">{flight.airline}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{flight.from}</span>
                          <ArrowRight className="w-3 h-3 text-gray-300" />
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{flight.to}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-12 w-full">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Current Price</p>
                        <p className="text-3xl font-black text-gray-900">₹{flight.price.toLocaleString()}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Price Trend</p>
                        <div className={`flex items-center gap-1 font-black ${isLower ? 'text-emerald-500' : isHigher ? 'text-rose-500' : 'text-gray-400'}`}>
                          {isLower ? <TrendingDown className="w-4 h-4" /> : isHigher ? <TrendingUp className="w-4 h-4" /> : null}
                          <span>{isLower ? '-' : isHigher ? '+' : ''}₹{Math.abs(priceDiff).toLocaleString()}</span>
                        </div>
                      </div>

                      {flight.targetPrice && (
                        <div className="text-center px-6 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Target Price</p>
                          <p className="text-sm font-black text-indigo-900">₹{flight.targetPrice.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                      <button 
                        onClick={() => setPriceAlert(flight.id)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-all"
                      >
                        <Bell className="w-4 h-4" /> Set Alert
                      </button>
                      <button 
                        onClick={() => removeFromWatchlist(flight.id)}
                        className="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last updated: {new Date(flight.lastUpdated).toLocaleTimeString()}</span>
                      <span className="flex items-center gap-1 text-indigo-600"><AlertCircle className="w-3 h-3" /> Status: {flight.status}</span>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Travel Date: {flight.date}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

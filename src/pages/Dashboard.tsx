import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Plane, Hotel, Map, TrendingUp, DollarSign, Calendar, ArrowRight, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/trips/dashboard');
        const data = await res.json();
        
        // Fetch from localStorage
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setWatchlistCount(localWatchlist.length);
        
        // Merge bookings
        const allBookings = [...localBookings.map((b: any) => {
          const isExpired = b.status === 'reserved' && new Date() > new Date(b.expiry);
          return {
            type: b.type.charAt(0).toUpperCase() + b.type.slice(1),
            bookingDate: b.date,
            amount: b.amount,
            status: isExpired ? 'expired' : b.status,
            id: b.reservationId || b.bookingId,
            details: {
              to: b.originalDetails?.airline || b.originalDetails?.name || b.name,
              city: b.originalDetails?.from || b.name,
              hotelName: b.originalDetails?.name || b.name
            }
          };
        }), ...(data.recentBookings || [])].sort((a, b) => 
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );

        // Update stats
        const localTotalSpent = localBookings.reduce((sum: number, b: any) => sum + b.amount, 0);
        
        setStats({
          ...data,
          bookingsCount: (data.bookingsCount || 0) + localBookings.length,
          totalSpent: (data.totalSpent || 0) + localTotalSpent,
          recentBookings: allBookings.slice(0, 5)
        });
      } catch (err) {
        console.error(err);
        // Fallback to only local data if API fails
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localTotalSpent = localBookings.reduce((sum: number, b: any) => sum + b.amount, 0);
        setStats({
          tripsCount: 0,
          bookingsCount: localBookings.length,
          totalSpent: localTotalSpent,
          upcomingTrips: [],
          recentBookings: localBookings.map((b: any) => {
            const isExpired = b.status === 'reserved' && new Date() > new Date(b.expiry);
            return {
              type: b.type.charAt(0).toUpperCase() + b.type.slice(1),
              bookingDate: b.date,
              amount: b.amount,
              status: isExpired ? 'expired' : b.status,
              details: { to: b.originalDetails?.airline || b.originalDetails?.name || b.name }
            };
          })
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" /></div>;

  const chartData = [
    { name: 'Jan', spent: 400 },
    { name: 'Feb', spent: 300 },
    { name: 'Mar', spent: 600 },
    { name: 'Apr', spent: 800 },
    { name: 'May', spent: 500 },
    { name: 'Jun', spent: 900 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome back!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your travels.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Overview</button>
          <button className="text-gray-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">Analytics</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Trips', value: stats?.tripsCount || 0, icon: Map, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Bookings', value: stats?.bookingsCount || 0, icon: Plane, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Watchlist', value: watchlistCount, icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-8">Recent Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats?.recentBookings?.length > 0 ? (
              stats.recentBookings.map((booking: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${booking.type === 'Flight' ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
                    {booking.type === 'Flight' ? <Plane className="w-6 h-6 text-indigo-600" /> : <Hotel className="w-6 h-6 text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{booking.type} to {booking.details.to || booking.details.city || booking.details.hotelName}</p>
                    <p className="text-xs text-gray-400 font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'text-emerald-600' : 
                      booking.status === 'expired' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {booking.status || 'Confirmed'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">No recent bookings found.</p>
              </div>
            )}
          </div>
          <Link to="/watchlist" className="w-full mt-8 py-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            View Watchlist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

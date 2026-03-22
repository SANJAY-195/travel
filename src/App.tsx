import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Watchlist from './pages/Watchlist';
import Dashboard from './pages/Dashboard';
import TripPlanner from './pages/TripPlanner';
import Places from './pages/Places';
import BookingFlow from './pages/BookingFlow';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import Transactions from './pages/Transactions';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<TripPlanner />} />
          <Route path="/book/:type/:id" element={<BookingFlow />} />
          <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
        </Routes>
      </main>
    </div>
  );
}


import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackingPopup from '@/components/TrackingPopup';
import AnimatedServices from '@/components/AnimatedServices';
import Feedback from '@/components/Feedback';
import PaymentQR from '@/components/PaymentQR';
import AnimatedHeroSection from '@/components/AnimatedHeroSection';
import AnimatedContactSection from '@/components/AnimatedContactSection';
import PrintJobForm from '@/components/PrintJobForm';

const Index = () => {
  const [showTrackingPopup, setShowTrackingPopup] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleOrderSubmitted = (newTrackingId: string) => {
    setTrackingId(newTrackingId);
    setShowTrackingPopup(true);
  };

  const resetForm = () => {
    setShowTrackingPopup(false);
    setTrackingId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      <AnimatedHeroSection />
      <AnimatedContactSection />
      <PrintJobForm onOrderSubmitted={handleOrderSubmitted} />
      <AnimatedServices />
      <PaymentQR />
      <Feedback />
      <Footer />

      {showTrackingPopup && (
        <TrackingPopup
          trackingId={trackingId}
          onClose={() => setShowTrackingPopup(false)}
          onNewOrder={resetForm}
        />
      )}
    </div>
  );
};

export default Index;

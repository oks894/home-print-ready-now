
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';

const SimpleHeroSection = () => {
  const navigate = useNavigate();

  const handleStartPrinting = () => {
    navigate('/printing');
  };

  const handleViewGallery = () => {
    navigate('/services');
  };

  return (
    <section className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Simplified Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
          <Sparkles className="w-4 h-4" />
          Premium 3D Print Technology
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="text-blue-600">Future of</span>
          <br />
          <span className="text-purple-600">Printing</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          Experience revolutionary 3D printing with AI-powered optimization, 
          real-time tracking, and premium quality delivery.
        </p>

        {/* Simple Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleStartPrinting}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start Printing Now
            </span>
          </button>
          
          <button
            onClick={handleViewGallery}
            className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              View Gallery
            </span>
          </button>
        </div>

        {/* Simple Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { title: "AI Upload", desc: "Smart file processing" },
            { title: "Live Tracking", desc: "Real-time updates" },
            { title: "Premium Quality", desc: "Professional results" },
            { title: "Lightning Fast", desc: "Quick delivery" }
          ].map((feature, index) => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleHeroSection;

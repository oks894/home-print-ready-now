
import { Phone, MessageCircle } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-8 px-4 bg-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Need Help? Contact Us Now!
        </h2>
        <p className="text-blue-100 mb-6 text-lg">
          Quick support for all your printing needs
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="tel:+917005498122" 
            className="flex items-center gap-3 bg-white text-blue-600 px-6 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg min-w-[200px] justify-center"
          >
            <Phone className="w-5 h-5" />
            Call +91 7005498122
          </a>
          
          <a 
            href="https://wa.me/917005498122" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg min-w-[200px] justify-center"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
        
        <p className="text-blue-100 mt-4 text-sm">
          Available Mon-Sat: 9AM-5PM | 24/7 WhatsApp Support
        </p>
      </div>
    </section>
  );
};

export default ContactSection;

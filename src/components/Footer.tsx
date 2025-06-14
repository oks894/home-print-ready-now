
import { Link } from 'react-router-dom';
import { Printer, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Stats from './Stats';

const Footer = () => {
  return (
    <>
      <Stats />
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                PrintReady
              </div>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Professional printing services delivered to your doorstep. Quality prints, convenient pickup.
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Powered by DYNAMIC EDU
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Admin Panel
                  </Link>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-400">
                <li className="text-xs sm:text-sm">Document Printing - ₹3.5/page</li>
                <li className="text-xs sm:text-sm">Color Printing - ₹5/page</li>
                <li className="text-xs sm:text-sm">Bulk Printing - ₹2.5/page (50+)</li>
                <li className="text-xs sm:text-sm">Doorstep Delivery</li>
                <li className="text-xs sm:text-sm">Binding Services</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm break-all">+91 7005498122</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Viewland Zone II / Opposite Warm delights</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Powered by DROPEE</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Mon-Sat: 9AM-6PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">&copy; 2024 PrintReady by DYNAMIC EDU. All rights reserved. Developed by Jihal Shimray</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

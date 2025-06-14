
import { Link } from 'react-router-dom';
import { Printer, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Stats from './Stats';

const Footer = () => {
  return (
    <>
      <Stats />
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 text-xl font-bold mb-4">
                <Printer className="w-6 h-6 text-blue-400" />
                PrintReady
              </div>
              <p className="text-gray-400 mb-4">
                Professional printing services delivered to your doorstep. Quality prints, convenient pickup.
              </p>
              <p className="text-sm text-gray-500">
                Powered by DYNAMIC EDU
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="text-gray-400 hover:text-white transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                    Admin Panel
                  </Link>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Document Printing - ₹3.5/page</li>
                <li>Color Printing - ₹5/page</li>
                <li>Bulk Printing - ₹2.5/page (50+)</li>
                <li>Doorstep Delivery</li>
                <li>Binding Services</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 7005498122</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>Viewland Zone II / Opposite Warm delights</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Powered by DROPEE</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Sat: 9AM-6PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PrintReady by DYNAMIC EDU. All rights reserved. Developed by Jihal Shimray</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

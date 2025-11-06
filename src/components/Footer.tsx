
import { Link } from 'react-router-dom';
import { Printer, Phone, Mail, MapPin, Clock, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import Stats from './Stats';
import { useExternalLinks } from '@/hooks/useExternalLinks';

const Footer = () => {
  const { links } = useExternalLinks();
  return (
    <>
      <Stats />
      <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full"
              style={{
                top: `${30 + i * 20}%`,
                left: `${10 + i * 30}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {/* Brand */}
            <motion.div 
              className="sm:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ellio
                </span>
              </div>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                Your ideas, perfectly printed. Premium quality printing with smart technology and seamless delivery.
              </p>
              <motion.p 
                className="text-xs sm:text-sm text-gray-400"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Powered by DYNAMIC EDU
              </motion.p>
            </motion.div>

            {/* Quick Links */}
          {/* Printing Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-blue-300">Printing Services</h3>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { name: 'Start Printing', path: '/ellio-prints' },
                { name: 'Pricing', path: '/ellio-prints#pricing' },
                { name: 'Track Order', path: '/track' },
                { name: 'Services', path: '/ellio-prints#services' },
                { name: 'Resume Templates', path: '/ellio-prints#templates' }
              ].map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base group relative"
                  >
                    {link.name}
                    <span className="absolute inset-x-0 w-full h-0.5 bg-blue-400 bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Notes Platform */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-green-300">Notes Platform</h3>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { name: 'Browse Notes', path: '/ellio-notes/browse' },
                { name: 'Upload Notes', path: '/ellio-notes/upload' },
                { name: 'Request Notes', path: '/ellio-notes/request' },
                { name: 'Leaderboard', path: '/ellio-notes/leaderboard' },
                { name: 'Top Contributors', path: '/ellio-notes/leaderboard' }
              ].map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm sm:text-base group relative"
                  >
                    {link.name}
                    <span className="absolute inset-x-0 w-full h-0.5 bg-green-400 bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Assignment Help */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-purple-300">Assignment Help</h3>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { name: 'Upload Assignment', path: '/ellio-notes/assignment-help/upload' },
                { name: 'Type Question', path: '/ellio-notes/assignment-help/type' },
                { name: 'My Requests', path: '/ellio-notes/assignment-help/my-requests' },
                { name: 'Become Solver', path: '/ellio-notes/assignment-help/solver/register' },
                { name: 'How It Works', path: '/ellio-notes/assignment-help' }
              ].map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-purple-400 transition-colors text-sm sm:text-base group relative"
                  >
                    {link.name}
                    <span className="absolute inset-x-0 w-full h-0.5 bg-purple-400 bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-green-300">Contact Us</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { icon: Phone, text: '+91 7005498122', type: 'phone' },
                  { icon: Mail, text: 'Viewland Zone II / Opposite Warm delights', type: 'address' },
                  { icon: MapPin, text: 'Powered by DROPEE', type: 'info' },
                  { icon: Clock, text: 'Mon-Sat: 9AM-6PM', type: 'hours' }
                ].map((item, index) => (
                  <motion.li
                    key={item.text}
                    className="flex items-start gap-2 text-gray-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={item.type === 'phone' ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <item.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                    </motion.div>
                    <span className="text-xs sm:text-sm">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-xs sm:text-sm">
              &copy; 2024 ellio by DYNAMIC EDU. All rights reserved.
              <motion.span
                className="inline-block ml-2 text-blue-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Developed by Jihal Shimray
              </motion.span>
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

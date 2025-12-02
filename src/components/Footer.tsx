import { Link } from 'react-router-dom';
import { Printer, Phone, Mail, MapPin, Clock, BookOpen, GraduationCap, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Printing Services',
      color: 'text-blue-400',
      hoverColor: 'hover:text-blue-300',
      links: [
        { name: 'Start Printing', path: '/ellio-prints' },
        { name: 'Track Order', path: '/track' },
        { name: 'Pricing', path: '/ellio-prints#pricing' },
      ],
    },
    {
      title: 'Notes Platform',
      color: 'text-green-400',
      hoverColor: 'hover:text-green-300',
      links: [
        { name: 'Browse Notes', path: '/ellio-notes/browse' },
        { name: 'Upload Notes', path: '/ellio-notes/upload' },
        { name: 'Request Notes', path: '/ellio-notes/request' },
      ],
    },
    {
      title: 'Assignment Help',
      color: 'text-purple-400',
      hoverColor: 'hover:text-purple-300',
      links: [
        { name: 'Upload Assignment', path: '/ellio-notes/assignment-help/upload' },
        { name: 'My Requests', path: '/ellio-notes/assignment-help/my-requests' },
        { name: 'Become Solver', path: '/ellio-notes/assignment-help/solver/register' },
      ],
    },
    {
      title: 'Resume Lab',
      color: 'text-pink-400',
      hoverColor: 'hover:text-pink-300',
      links: [
        { name: 'Browse Templates', path: '/resume-lab' },
        { name: 'Build Resume', path: '/resume-lab' },
      ],
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Ellio
                </span>
              </div>
              
              <p className="text-slate-400 text-sm mb-4 max-w-xs">
                Your complete student services platform. Print, learn, and succeed with Ellio.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+91 7005498122</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Viewland Zone II</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Mon-Sat: 9AM-6PM</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Link Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className={`font-semibold mb-4 text-sm ${section.color}`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`text-slate-400 text-sm ${section.hoverColor} transition-colors duration-200`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              &copy; {currentYear} Ellio. All rights reserved.
            </p>
            
            <p className="text-slate-400 text-sm font-medium text-center">
              Powered by <span className="text-blue-400">Dynamic Edu</span> — Learn, Print, Progress.
            </p>

            <p className="text-slate-500 text-xs text-center md:text-right">
              Developed by Jihal Shimray
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Ribbon */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2">
        <p className="text-center text-white text-xs font-medium">
          🎉 Ellio Corporate Edition — December 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;

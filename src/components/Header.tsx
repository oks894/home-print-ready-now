
import { Link } from 'react-router-dom';
import { Printer, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TouchButton } from '@/components/mobile/TouchButton';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const ButtonComponent = isMobile ? TouchButton : Button;

  return (
    <motion.header 
      className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`max-w-6xl mx-auto safe-area-inset ${isMobile ? 'px-3 py-2' : 'px-3 sm:px-4 py-2 sm:py-3'}`}>
        {/* Mobile-First Header */}
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className={`flex items-center gap-2 font-bold text-blue-600 ${
              isMobile ? 'text-lg' : 'text-lg sm:text-xl'
            }`}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Printer className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PrintReady
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            {['Home', 'Services', 'Pricing', 'Track', 'Contact'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                  className="relative text-gray-600 hover:text-blue-600 transition-colors font-medium group"
                >
                  {item}
                  <span className="absolute inset-x-0 w-full h-0.5 bg-blue-600 bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/admin" className="hidden sm:block">
                <ButtonComponent 
                  variant="outline" 
                  size="sm" 
                  className={`hover:bg-blue-50 border-blue-200 ${
                    isMobile ? 'text-xs p-2' : 'text-xs sm:text-sm'
                  }`}
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Admin
                </ButtonComponent>
              </Link>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <ButtonComponent 
                variant="ghost" 
                size="sm" 
                className="lg:hidden hover:bg-blue-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ButtonComponent>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-3 pb-3 border-t pt-3 bg-white/90 backdrop-blur-sm rounded-lg"
            >
              <div className="flex flex-col space-y-1">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Services', path: '/services' },
                  { name: 'Pricing', path: '/pricing' },
                  { name: 'Track', path: '/track' },
                  { name: 'Contact', path: '/contact' }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link 
                      to={item.path}
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50 text-base block min-h-[48px] flex items-center touch-manipulation"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="sm:hidden mt-2 px-4"
                >
                  <Link 
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <TouchButton 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-base border-blue-200 hover:bg-blue-50 min-h-[48px]"
                    >
                      <User className="w-5 h-5 mr-3" />
                      Admin Panel
                    </TouchButton>
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;

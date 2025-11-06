
import { Link } from 'react-router-dom';
import { Printer, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TouchButton } from '@/components/mobile/TouchButton';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
                ellio
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                to="/" 
                className="relative text-gray-600 hover:text-blue-600 transition-colors font-medium group"
              >
                Home
                <span className="absolute inset-x-0 w-full h-0.5 bg-blue-600 bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>

            {/* Ellio Prints Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors font-medium outline-none">
                Ellio Prints 🖨️ <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem asChild>
                  <Link to="/ellio-prints" className="w-full cursor-pointer">📄 Start Printing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-prints#pricing" className="w-full cursor-pointer">💰 Pricing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/track" className="w-full cursor-pointer">📦 Track Order</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Ellio Notes Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors font-medium outline-none">
                Ellio Notes 📘 <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/browse" className="w-full cursor-pointer">📚 Browse Notes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/upload" className="w-full cursor-pointer">⬆️ Upload Notes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/request" className="w-full cursor-pointer">🙋 Request Notes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/leaderboard" className="w-full cursor-pointer">🏆 Leaderboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Assignment Help Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors font-medium outline-none">
                Assignment Help ✍️ <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/assignment-help/upload" className="w-full cursor-pointer">⬆️ Upload Assignment</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/assignment-help/type" className="w-full cursor-pointer">✏️ Type Question</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/assignment-help/my-requests" className="w-full cursor-pointer">📋 My Requests</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/assignment-help/solver/register" className="w-full cursor-pointer">💼 Become a Solver</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ellio-notes/assignment-help/solver/dashboard" className="w-full cursor-pointer">📊 Solver Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                to="/track" 
                className="relative text-gray-600 hover:text-blue-600 transition-colors font-medium group"
              >
                Track
                <span className="absolute inset-x-0 w-full h-0.5 bg-blue-600 bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link 
                to="/contact" 
                className="relative text-gray-600 hover:text-blue-600 transition-colors font-medium group"
              >
                Contact
                <span className="absolute inset-x-0 w-full h-0.5 bg-blue-600 bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>
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
                  { name: 'Ellio Prints 🖨️', path: '/ellio-prints' },
                  { name: 'Ellio Notes 📘', path: '/ellio-notes' },
                  { name: 'Track Order', path: '/track' },
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

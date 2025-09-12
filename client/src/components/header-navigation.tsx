import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import GitHubEssayButton from "@/components/ui/button-github-essay";
import GitHubMcqButton from "@/components/ui/button-github-mcq";
import { motion, AnimatePresence } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const [location] = useLocation();
  const isActive = location === href || (href === "/" && location === "/overall");

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-gray-900 dark:text-white' : 'text-slate-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
      }`}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
          style={{
            boxShadow: "0px 0px 8px 0px #3b82f6",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      )}
    </Link>
  );
};

export function HeaderNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const preloadRoutes = () => {
      const routes = [
        import("@/pages/dashboard"),
        import("@/pages/compare-page"),
        import("@/pages/overall")
      ];
      Promise.all(routes).then(() => {
      });
    };
    
    preloadRoutes();
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
            <img src="/logo.png" alt="CFA Arena Logo" className="w-11 h-10" />
          </Link>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <NavLink href="/">Overall</NavLink>
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/methodology">Methodology</NavLink>
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <div className="hidden sm:flex items-center space-x-2">
                <GitHubEssayButton />
                <GitHubMcqButton />
              </div>
              
              {/* Mobile Hamburger Menu */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/20 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden absolute top-full left-0 right-0 mt-2 mx-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <Link 
                  href="/" 
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  Overall
                </Link>
                <Link 
                  href="/compare" 
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  Compare
                </Link>
                <Link 
                  href="/methodology" 
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  Methodology
                </Link>
                <Link 
                  href="/dashboard" 
                  onClick={closeMobileMenu}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  Dashboard
                </Link>
                
                {/* Mobile GitHub Buttons */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2 sm:hidden">
                  <div className="flex justify-center space-x-2">
                    <GitHubEssayButton />
                    <GitHubMcqButton />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
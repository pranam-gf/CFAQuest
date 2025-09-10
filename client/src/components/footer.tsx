import React from 'react';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-inverse bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800/50 pt-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CFA Bench, Inc.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Backed by <a href="https://www.goodfin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 dark:hover:text-gray-200 underline">Goodfin Research</a>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://www.linkedin.com/company/getgoodfin/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 dark:text-gray-400 hover:dark:text-gray-200">
              <Linkedin size={16} />
            </a>
            <a href="https://twitter.com/goodfinco" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 dark:text-gray-400 hover:dark:text-gray-200">
              <Twitter size={16} />
            </a>
            <a href="https://www.youtube.com/channel/UCho6XzwGlKuafPoKtoJKmgA" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 dark:text-gray-400 hover:dark:text-gray-200">
              <Youtube size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

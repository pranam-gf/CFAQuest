import React from 'react';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Fin-Arena, Inc.
            </p>
            <p className="text-xs text-gray-500">
              Backed by <a href="https://www.goodfin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 underline">Goodfin Research</a>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://www.linkedin.com/company/getgoodfin/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <Linkedin size={16} />
            </a>
            <a href="https://twitter.com/goodfinco" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <Twitter size={16} />
            </a>
            <a href="https://www.youtube.com/channel/UCho6XzwGlKuafPoKtoJKmgA" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <Youtube size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

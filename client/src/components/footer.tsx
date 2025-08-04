import React from 'react';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              CFAQuest, Inc. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Funded and backed by Goodfin Research &copy; {new Date().getFullYear()} 
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://blog.goodfin.com/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-300">
              Insights
            </a>
            <a href="https://www.goodfin.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-300">
              Privacy
            </a>
            <a href="https://www.goodfin.com/terms" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-300">
              Terms
            </a>
            <a href="https://www.linkedin.com/company/getgoodfin/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <Linkedin size={20} />
            </a>
            <a href="https://twitter.com/goodfinco" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <Twitter size={20} />
            </a>
            <a href="https://www.youtube.com/channel/UCho6XzwGlKuafPoKtoJKmgA" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

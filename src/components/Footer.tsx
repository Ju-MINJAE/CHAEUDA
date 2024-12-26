import { Github } from 'lucide-react';
import { COMPANY_NAME, CEO_NAME, COMPANY_ADDRESS, GITHUB_URL } from '@/constants/constants';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">{COMPANY_NAME}</h2>
            <p className="text-sm text-gray-600">(주)채우다 대표: {CEO_NAME}</p>
            <p className="text-sm text-gray-600">{COMPANY_ADDRESS}</p>
          </div>
          <div className="flex space-x-4">
            <a href={GITHUB_URL} className="text-gray-600 hover:text-gray-800 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

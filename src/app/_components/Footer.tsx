import Image from 'next/image';
import Link from 'next/link';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-red-600 dark:bg-red-800 text-white z-[1003]">
      <div className="max-w-7xl mx-auto w-full p-4 py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="text-red-100 text-sm mb-4 max-w-xs">
              Connecting blood donors with those in need. Your contribution can
              save lives.
            </p>
            <div className="flex space-x-4">
              <div className="bg-red-500 p-2 rounded-lg">
                <span className="text-sm font-semibold">24/7</span>
              </div>
              <div className="bg-red-500 p-2 rounded-lg">
                <span className="text-sm font-semibold">Emergency</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-red-500 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/donors"
                  className="text-red-100 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Find Donors
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-red-100 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-red-100 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-red-500 pb-2">
              Contact
            </h3>
            <ul className="space-y-3 text-red-100">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>123 Health Street, Medical City</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Emergency: (555) 123-HELP</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>help@bloodbank.org</span>
              </li>
            </ul>
          </div>

          {/* Blood Facts */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-red-500 pb-2">
              Blood Facts
            </h3>
            <div className="bg-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-100 mb-2">
                💪 One donation can save up to 3 lives
              </p>
              <p className="text-sm text-red-100 mb-2">
                ⏱️ Donation takes only 45-60 minutes
              </p>
              <p className="text-sm text-red-100">
                🩺 Regular donations improve donor health
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-500 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-red-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Blood Bank. Saving lives together.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

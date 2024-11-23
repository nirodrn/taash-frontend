import React from 'react';
import { FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">TAASH</h3>
            <p className="text-gray-400">
              Elevate your style with our premium clothing collection.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Shipping
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Whatsapp: +94 70 308 1617</li>
              <li>Email: clothingtaash@gmail.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/clothingtaash/profilecard/?igsh=YmpuMDBldHZqdml3" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://www.tiktok.com/@taash.clothing?_t=8r0AY8y55eu&_r=1" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="h-6 w-6" />
              </a>
              <a href="https://wa.me/94703081617" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="h-6 w-6" />
              </a>
              <a href="mailto:clothingtaash@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TAASH Clothing. All rights reserved.</p>
          <p>
            Web solution by{' '}
            <a href="https://detzglobal.web.app/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
              DETZ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

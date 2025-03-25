import React from 'react';

const Footer = () => {
  return (
    <footer className="backdrop-blur-2xl bg-black/80 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Section 1: About */}
        <div>
          <h2 className="text-lg font-bold mb-4">About Us</h2>
          <p className="text-sm">
            We are a leading provider of high-quality groceries at affordable prices, dedicated to serving our community.
          </p>
        </div>

        {/* Section 2: Links */}
        <div>
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/" className="text-sm hover:text-gray-400">Home</a></li>
            <li><a href="/shop" className="text-sm hover:text-gray-400">Shop</a></li>
            <li><a href="/about" className="text-sm hover:text-gray-400">About Us</a></li>
            <li><a href="/contact" className="text-sm hover:text-gray-400">Contact</a></li>
          </ul>
        </div>

        {/* Section 3: Contact */}
        <div>
          <h2 className="text-lg font-bold mb-4">Contact Us</h2>
          <p className="text-sm">
            123 Grocery Lane, Market Town, USA
          </p>
          <p className="text-sm">Email: info@grocery.com</p>
          <p className="text-sm">Phone: +123 456 7890</p>

          {/* Social Media Icons */}
          <div className="mt-4 flex space-x-4">
            <a href="#" className="hover:text-gray-400">Facebook</a>
            <a href="#" className="hover:text-gray-400">Twitter</a>
            <a href="#" className="hover:text-gray-400">Instagram</a>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
        <p>&copy; 2024 Grocery, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

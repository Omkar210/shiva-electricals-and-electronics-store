import { Droplet, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 to-white border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AquaPure Shop
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Your trusted partner for premium water purification solutions. Clean water, healthy life.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Products</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Services</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">Installation</li>
              <li className="text-gray-600 text-sm">Maintenance</li>
              <li className="text-gray-600 text-sm">Repair</li>
              <li className="text-gray-600 text-sm">AMC Plans</li>
              <li className="text-gray-600 text-sm">Water Testing</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>123 Water Street, Clean City, CC 12345</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>info@aquapureshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-100 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} AquaPure Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

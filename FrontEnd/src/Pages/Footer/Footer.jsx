import React from 'react'
import '../../App.css'
import { 
  MapPin, 
  Mail, 
  Clock, 
  Phone, 
  Send, 
  ChevronRight, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MessageCircle,
  Headphones,
  Shield,
  Truck
} from 'lucide-react';
const Footer = () => {
  return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-6">ElectricStore</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your premier destination for digital watches, mobile accessories, wireless earbuds, and cutting-edge electronics.
              </p>
              <div>
                <h4 className="font-medium mb-3">Connect With Us</h4>
                <div className="flex space-x-3">
                  {[Facebook, Instagram, Twitter, Youtube].map((Social, idx) => (
                    <button key={idx} className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition-colors">
                      <Social className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="text-lg font-bold mb-6">Shop</h4>
              <ul className="space-y-3">
                {['Digital Watches', 'Wireless Earbuds', 'Mobile Accessories', 'Phone Cases', 'Chargers & Cables', 'Sale Items'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">→ {item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Order Status', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'Contact Us'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">→ {item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-bold mb-6">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div className="text-gray-400">
                    <p>1847 Electronics Boulevard</p>
                    <p>Tech District, NY 10018</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-gray-400">hello@electricstore.com</span>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                  <div className="text-gray-400">
                    <p>Monday-Friday: 9am-8pm</p>
                    <p>Saturday-Sunday: 10am-6pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © Copyright <span className="font-medium">ElectricStore</span>. All Rights Reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer

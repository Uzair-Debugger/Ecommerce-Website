// /src/Pages/Body/ContactUs.jsx

import React, { useState } from 'react';
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

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    // Reset form
    setFormData({
      firstName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Address",
      details: [
        "1847 Electronics Boulevard,",
        "Tech District, New York 10018"
      ]
    },
    {
      icon: Mail,
      title: "Email Address",
      details: [
        "info@electricstore.com",
        "support@electricstore.com"
      ]
    },
    {
      icon: Clock,
      title: "Hours of Operation",
      details: [
        "Monday-Friday: 9 AM - 8 PM",
        "Saturday-Sunday: 10 AM - 6 PM"
      ]
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Get instant help with our 24/7 live chat support for technical questions.",
      action: "Start Chat"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Expert assistance with product setup, troubleshooting, and warranties.",
      action: "Get Help"
    },
    {
      icon: Shield,
      title: "Warranty Claims",
      description: "Easy warranty registration and claims for all your electronic purchases.",
      action: "Register Product"
    },
    {
      icon: Truck,
      title: "Order Tracking",
      description: "Track your shipment and get real-time updates on your electronics delivery.",
      action: "Track Order"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ElectricStore</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                Need help? Call us: +1 (234) 567-890
              </div>
              <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                20% off on your first order
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-blue-600 font-medium">Contact</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our electronics? Need technical support? We're here to help you with all your digital watch, mobile accessory, and audio device needs.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{info.title}</h3>
                <div className="text-gray-600">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className={idx === 0 ? "font-medium" : ""}>{detail}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map and Contact Form Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Interactive Map Placeholder */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 relative">
              {/* Map placeholder with location marker */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">ElectricStore Location</h3>
                  <p className="text-gray-600">1847 Electronics Boulevard</p>
                  <p className="text-gray-600">Tech District, New York 10018</p>
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
              {/* Mock map elements */}
              <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
                <div className="text-xs text-gray-600">Electronics District</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow text-xs text-gray-600">
                © 2025 ElectricStore Maps
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Get in Touch</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Write Message..."
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                SEND MESSAGE
              </button>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Need Immediate Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the support option that works best for you. Our electronics experts are ready to assist.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow group">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors group-hover:underline">
                    {option.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ContactUs;
import React from 'react';
import { Shield, Zap, Award, ChevronRight } from 'lucide-react';
import { allFeatures, stats } from '../../data/products';
import Bg_main from '../../assets/aboutus/bg_main.png';
import Aboutus from '../../assets/aboutus/aboutus.jpg';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.67), rgba(0, 0, 0, 0.67)), url(${Bg_main})`,
        }}
        className="text-white py-16 bg-cover bg-center bg-fixed"
      >
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">About Tech-Tronics</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Your premier destination for cutting-edge electronics, digital watches,
              mobile accessories, and premium audio devices.
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {/* <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-blue-600 font-medium">About</span>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Company Story Section */}
        <div className="my-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ABOUT OUR COMPANY
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center my-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Powering Your Digital Lifestyle with Premium Electronics
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded with a passion for technology and innovation, ElectricStore
                has been at the forefront of bringing cutting-edge electronics to tech
                enthusiasts worldwide. We specialize in premium digital watches,
                high-quality mobile accessories, wireless earbuds, and the latest
                audio technology.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our commitment goes beyond just selling products – we're dedicated to
                enhancing your digital experience with carefully curated electronics
                that combine style, functionality, and reliability.
              </p>
            </div>
            <div className="relative">
              <img
                src={Aboutus}
                alt="Electronics showcase"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-cyan-900 text-white p-4 rounded-lg shadow-lg">
                <Zap className="w-8 h-8 mb-2" />
                <p className="font-bold">Innovation First</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 my-22 ">
          {allFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center">
                  {feature.link}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-lg font-medium text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">{stat.subtitle}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Mission & Vision</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                We believe technology should enhance and simplify your life. Our
                mission is to provide premium electronics that seamlessly integrate
                into your daily routine, from smartwatches that keep you connected to
                wireless earbuds that deliver crystal-clear audio experiences.
              </p>
              <p className="text-gray-300 leading-relaxed mb-8">
                Every product in our collection is tested for quality, performance,
                and durability. We partner with leading manufacturers to ensure you
                receive authentic, warranty-backed electronics with exceptional
                customer service support.
              </p>

              {/* Founder Quote */}
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <img
                    src="/api/placeholder/60/60"
                    alt="Alex Johnson"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-gray-200 italic mb-2">
                      "We're not just selling electronics – we're empowering people
                      to embrace the future of technology with confidence and style."
                    </p>
                    <div className="text-sm">
                      <p className="font-bold">Alex Johnson</p>
                      <p className="text-gray-400">Founder & CEO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/500/400"
                alt="Team collaboration"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-12">
            Why Choose ElectricStore?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                Authentic Products
              </h4>
              <p className="text-gray-600">
                100% genuine electronics with manufacturer warranties and quality
                guarantees.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                Latest Technology
              </h4>
              <p className="text-gray-600">
                Stay ahead with the newest digital watches, wireless earbuds, and
                mobile accessories.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                Expert Service
              </h4>
              <p className="text-gray-600">
                Knowledgeable support team ready to help you find the perfect tech
                solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Upgrade Your Tech?
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover our premium collection of digital watches, wireless earbuds,
            mobile accessories, and more.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

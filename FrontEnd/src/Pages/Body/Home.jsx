// src/pages/Home.jsx

import React, { useEffect, useRef, useState } from "react";
import { easeInOut, motion, useAnimation } from "framer-motion";
import { features, accessories, categories } from "../../data/products.jsx";
import { useNavigate } from "react-router-dom";
import "../../index.css";

const Home = () => {
  const sectionRef = useRef(null);
  const controls = useAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const numSlides = accessories.length;
  const extendedAccessories = [...accessories, accessories[0]];

  useEffect(() => {
    let isMounted = true;

    async function cycle() {
      while (isMounted) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const nextIndex = currentIndex + 1;

        if (nextIndex < numSlides) {
          setCurrentIndex(nextIndex);
          await controls.start({
            x: `-${nextIndex * 100}%`,
            transition: { duration: 0.8, ease: easeInOut },
          });
        } else {
          await controls.start({
            x: `-${numSlides * 100}%`,
            transition: { duration: 0.8, ease: easeInOut },
          });
          controls.set({ x: "0%" });
          setCurrentIndex(0);
        }
      }
    }

    cycle();
    return () => {
      isMounted = false;
    };
  }, [currentIndex, controls, numSlides]);

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="w-full overflow-hidden">
      {/* Hero carousel - UNCHANGED */}
      <div className="flex flex-col w-full">
        <div className="overflow-hidden flex flex-col items-center relative h-[600px]">
          <div className="max-w-[1300px] w-full h-full relative">
            <div className="absolute inset-0 w-full overflow-hidden">
              <motion.div className="flex h-full" animate={controls}>
                {extendedAccessories.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex-shrink-0 w-full h-dvh flex justify-center items-center"
                  >
                    <motion.img
                      src={item.src}
                      alt={item.alt}
                      className="object-cover lg:object-center object-right h-full rounded-lg"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="absolute top-30 sm:left-10 mx-3 p-5 rounded-md bg-gradient-to-r from-neutral-50 to-transparent">
        <span className="p-1 bg-red-600">Best Prices</span>
        <h1 className="md:text-6xl text-3xl font-medium leading-snug">
          Incredible Prices <br /> on All Your Favorite <br /> Items
        </h1>
        <p className="text-lg my-2">Get more for less on selected brand</p>
        <button
          className="py-3 px-5 rounded-3xl bg-cyan-700 text-white mt-3"
          onClick={() => navigate("/shop")}
        >
          Shop Now
        </button>
      </div>

      {/* Trust Badge Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-cyan-50 to-blue-50 py-6 px-4 mt-10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-cyan-700">10K+</p>
            <p className="text-sm text-gray-600 font-medium">Happy Customers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-cyan-700">500+</p>
            <p className="text-sm text-gray-600 font-medium">Premium Products</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-cyan-700">50+</p>
            <p className="text-sm text-gray-600 font-medium">Top Brands</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-cyan-700">24/7</p>
            <p className="text-sm text-gray-600 font-medium">Customer Support</p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Categories Section */}
      <div className="flex justify-center mb-14 px-4 sm:px-10 py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="w-full max-w-screen-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full font-semibold text-sm mb-4"
            >
              SHOP BY CATEGORY
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 to-cyan-700 bg-clip-text text-transparent">
              Explore Our Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover premium quality products across all categories
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative rounded-2xl shadow-xl cursor-pointer overflow-hidden bg-white hover:shadow-2xl transition-all duration-500"
                onClick={() => handleCategoryClick(item.category)}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-80">
                  <motion.img
                    src={item.image}
                    alt={item.category}
                    className="object-center object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Hover Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-800 shadow-lg flex items-center gap-1"
                  >
                    View All
                    <span className="text-cyan-600">→</span>
                  </motion.div>

                  {/* Category Label on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-2xl drop-shadow-lg">
                      {item.category}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 bg-gradient-to-br from-white to-gray-50">
                  <motion.div
                    className="flex items-center justify-between"
                    whileHover={{ x: 5 }}
                  >
                    <p className="text-gray-700 font-semibold">Shop Now</p>
                    <span className="text-cyan-600 group-hover:text-cyan-700 transition-colors">
                      →
                    </span>
                  </motion.div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto my-16 px-4"
      >
        <div className="relative bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-600 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
          </div>

          <div className="relative z-10 text-center text-white">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl font-semibold mb-3"
            >
              🎉 Special Offer
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-extrabold mb-4"
            >
              Get Up to 50% OFF
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg mb-6 opacity-90"
            >
              On selected items • Limited time only
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-cyan-700 font-bold rounded-full shadow-xl hover:bg-gray-50 transition-all duration-300"
              onClick={() => navigate("/shop")}
            >
              Shop Sale Items
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Features Section */}
      <div className="p-8 md:p-12 my-10 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full font-semibold text-sm mb-4"
            >
              OUR BENEFITS
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-700 to-blue-600 bg-clip-text text-transparent">
              Why Shop With Us?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience hassle-free shopping with premium service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl rounded-2xl p-8 border border-gray-100 transition-all duration-300 overflow-hidden">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center justify-center bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-2xl p-5 mb-6 group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300 shadow-md"
                    >
                      <feature.icon
                        className="w-10 h-10 text-cyan-700 group-hover:text-white transition-colors duration-300"
                        strokeWidth={2.5}
                      />
                    </motion.div>

                    {/* Text */}
                    <p className="text-lg font-bold text-gray-800 group-hover:text-cyan-700 transition-colors duration-300 mb-3">
                      {feature.text}
                    </p>

                    {/* Animated Underline */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      className="h-1 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                    />
                  </div>

                  {/* Corner Decoration */}
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-tl-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto my-20 px-4"
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block text-5xl mb-4"
          >
            📧
          </motion.div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-300 text-lg mb-6">
            Subscribe to get special offers, free giveaways, and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
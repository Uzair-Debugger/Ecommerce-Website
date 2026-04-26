// data.jsx
import { ShoppingBag, Truck, DollarSign, Clock, Users, Star, ChevronLeft, Award } from "lucide-react";
import watch from "../assets/main/watch.png";
import mobile from "../assets/main/mobile.png";
import laptop from "../assets/main/laptop.png";

import watchcategory from "../assets/categories/smartwatch.jpg"
import mobilecovercategory from "../assets/categories/mobilecover.jpg"
import laptopcategory from "../assets/categories/laptop.jpg"
import airpodscategory from "../assets/categories/airpods.jpg"



import Img1 from '../assets/aboutus/Img1.avif'
import Img2 from '../assets/aboutus/Img2.avif'
import Img3 from '../assets/aboutus/Img3.jpg'

// Features section data
export const features = [
  {
    icon: Truck,
    text: "Curb-side pickup",
  },
  {
    icon: ShoppingBag,
    text: "Free shipping on orders over $50",
  },
  {
    icon: DollarSign,
    text: "Low prices guaranteed",
  },
  {
    icon: Clock,
    text: "Available to you 24/7",
  },
];

// Accessories carousel data
export const accessories = [
  { id: 1, src: watch, alt: "watch" },
  { id: 2, src: mobile, alt: "mobile" },
  { id: 3, src: laptop, alt: "laptop" },
];

export const categories = [
  { id: 1, category: "Laptop", image: laptopcategory },
  { id: 2, category: "Watches", image: watchcategory },
  { id: 3, category: "Earbuds", image: airpodscategory },
  { id: 4, category: "Mobile Accessories", image: mobilecovercategory },

]

export const stats = [
  { number: "50K+", label: "Happy Customers", subtitle: "worldwide satisfaction", icon: Users },
  { number: "1.2M+", label: "Products Sold", subtitle: "quality electronics delivered", icon: Award },
  { number: "24/7", label: "Customer Support", subtitle: "always here to help", icon: Clock },
  { number: "98%", label: "Customer Rating", subtitle: "excellent service record", icon: Star }
];

export const allFeatures = [
  {
    title: "Premium Quality Electronics",
    description: "We source only the highest quality digital watches, mobile accessories, and audio devices from trusted manufacturers worldwide.",
    image: Img1,
    link: "Explore Products"
  },
  {
    title: "Expert Technical Support",
    description: "Our team of electronics specialists provides comprehensive support and guidance to help you choose the perfect tech accessories.",
    image: Img2,
    link: "Get Support"
  },
  {
    title: "Fast & Secure Delivery",
    description: "Experience lightning-fast shipping with secure packaging, ensuring your electronics arrive in perfect condition every time.",
    image: Img3,
    link: "Shipping Info"
  }
];
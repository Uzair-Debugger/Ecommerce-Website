import Nav from './Pages/Header/Nav'
import Home from './Pages/Body/Home'
import ContactUs from './Pages/Body/ContactUs'
import Categories from './Pages/Body/Categories'
import Shop from './Pages/Body/Shop'
import AboutUs from './Pages/Body/AboutUs'
import Footer from './Pages/Footer/Footer'
import AddToCart from './Pages/Body/Cart'
import SalesOrder from './Pages/Body/Sales_order'
import { CartProvider } from './Pages/Context/CartContext' 
import Login from './Pages/Auth/Login'
import Signup from './Pages/Auth/Signup'
import OrderSummary from './Pages/Body/OrderSummary'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import './App.css'

function App() {

  return (
    <>
      <CartProvider> {/* Wrapped the app with CartProvider */}
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/aboutus' element={<AboutUs />} /> 
          <Route path='/salesorder' element={<SalesOrder />} /> 
          <Route path='/ordersummary' element={<OrderSummary />} />
          <Route path='/addtocart' element={<AddToCart />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
        </Routes>
        <Footer />
      </CartProvider>
      <ToastContainer/>
    </>
  )
}

export default App

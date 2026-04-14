import React, { useState } from "react";
import { useCart } from '../Pages/Context/CartContext';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Card = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate()

  
  const addToDB = async () => {
    const currentUser = localStorage.getItem('token')
    console.log(currentUser)

    if (currentUser) {

      try {
        const res = await fetch("http://127.0.0.1:5000/order", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser   
          },
          body: JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
          }),
        });

        if (!res.ok) {
          
          toast.error("Please login First")
          navigate('/login')
          return;
        }

        const data = await res.json();
        

      } catch (error) {
        console.error("Error!", error);
      }
    }

    else {
      toast.warning("Please login first")
      navigate('/login')
    }
  };


  return (
    <div className="shadow-sm rounded-lg">
      <img
        className="rounded-lg h-40 w-full object-cover"
        src={product.image}
        alt={product.name}
      />
      <div className="p-3">
        <h3 className="font-semibold text-xl">{product.name}</h3>
        <p>{product.category}</p>
        <p className="text-blue-600 text-lg font-semibold">${product.price}</p>

        <button
          className="px-2 py-1 rounded-md bg-green-500 text-white"
          onClick={() => {
            addToDB();
            // addToCart({ product });
          }}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default Card;

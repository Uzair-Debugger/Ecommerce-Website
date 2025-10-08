// import { HeartIcon } from "lucide-react";
import React, { useState } from 'react';

// import SeekhKabab from '../../assets/Pizza/1_seekhKabab.jpg';
// import Fajita from '../../assets/Pizza/2_Fajita.jpg';
// import PeriPeri from '../../assets/Pizza/3_Periperi.jpg';
// import CreamyTikka from '../../assets/Pizza/4_creamyTikka.jpg';
// import Arabian from '../../assets/Pizza/5_Arabian.jpg';

// const pizzas = [
//   {
//     id: 1,
//     image: SeekhKabab,
//     header: "Super Loaded Seekh Kebab",
//     text: "50% More Cheese and 50% More Chicken seekh kebab chunks, onions, and green chilies with pizza base sauce topped with ranch sauce.",
//     price: 470
//   },
//   {
//     id: 2,
//     image: Fajita,
//     header: "Super Loaded Fajita",
//     text: "50% More Cheese and 50% More Chicken with onions, green peppers, jalapeños, black olives, and oregano.",
//     price: 470
//   },
//   {
//     id: 3,
//     image: PeriPeri,
//     header: "Super Loaded Peri Peri",
//     text: "50% More Cheese and 50% More Chicken with onions, and green peppers topped with Peri Peri Sauce.",
//     price: 470
//   },
//   {
//     id: 4,
//     image: CreamyTikka,
//     header: "Super Loaded Creamy Tikka",
//     text: "50% More Cheese and 50% More Chicken with onions and jalapeños with cheesy mayo base sauce.",
//     price: 470
//   },
//   {
//     id: 5,
//     image: Arabian,
//     header: "Super Loaded Arabian Pizza",
//     text: "50% More Cheese and 50% More Chicken with onions, green peppers, jalapeños, black olives, and oregano.",
//     price: 470
//   }
// ];

// const PizzaCard = ({ pizza, quantity, increaseQty, decreaseQty }) => (
//   <div className='w-50 max-w-full shadow-lg bg-white m-2 rounded-xl'>
//     <img className='rounded-t-xl' src={pizza.image} alt={pizza.header} />
//     <div className='p-3'>
//       <h2 className='font-semibold my-1'>{pizza.header}</h2>
//       <p className='text-sm w-full truncate'>{pizza.text}</p>
//       <p className='text-blue-500 font-semibold mt-3'>Rs {pizza.price}</p>
//       <HeartIcon className='cursor-pointer stroke-red-500 hover:fill-red-500' />
//       <button className='p-1.5 cursor-pointer rounded-md text-green-600 hover:bg-green-600 hover:text-white'>
//         Add to cart
//       </button>
//       <div className='border p-1 w-max rounded-md mt-2'>
//         <button onClick={decreaseQty}>-</button> {quantity} <button onClick={increaseQty}>+</button>
//       </div>
//     </div>
//   </div>
// );

const Categories = () => {
  //   const [quantities, setQuantities] = useState({});

  //   const handleIncrease = (id) => {
  //     setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  //   };

  //   const handleDecrease = (id) => {
  //     setQuantities(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  //   };

  //   const testBackend = async () => {
  //     const response = await fetch('http://127.0.0.1:5001/');
  //     const data = await response.json();
  //     console.log(data.message);
  //   };

  return (
    <div>
      {/* //       <button onClick={testBackend} className='bg-red-600 p-2 rounded-md'>
//         Test Backend Connection
//       </button> */}


      {/* {["Pizza", "Burgers", "Drinks"].map((category) => (
        <div className='m-3' key={category}>
          <h1 className='py-2 my-2 border-b-3 border-gray-300'>{category}</h1>
          <div className='rounded-md flex flex-wrap justify-between'>
            {pizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                quantity={quantities[pizza.id] || 0}
                increaseQty={() => handleIncrease(pizza.id)}
                decreaseQty={() => handleDecrease(pizza.id)}
              />
            ))}
           </div>
         </div>
      ))} */}
    </div>
  );
};

export default Categories;


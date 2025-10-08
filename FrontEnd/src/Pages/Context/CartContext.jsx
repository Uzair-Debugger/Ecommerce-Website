
import React, {createContext, useContext, useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";
const cartContext = createContext();



export const CartProvider = ({children}) =>{

  const [cart, setCart] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [totalItems, setTotalItems] = useState(1)
  const token = localStorage.getItem('token')
  
  
  const addToCart = (product) =>{
    setCart(prev=>[...prev, product])
  }
  const removeFromCart = (id) =>{

    setCart(prev=>prev.filter(item=>id!==item.id))
  }

  useEffect(()=>{
     if(!token){
    setCart([])
    return
  }
  else{

    const decodeToken = jwtDecode(token)
    const curDate = Date.now()
    if(curDate>decodeToken.exp)
      setCart([])
  }
  },[])

  return(
    <cartContext.Provider value={{cart,setCart, addToCart, removeFromCart, totalItems, setTotalItems}}>
      {children}
    </cartContext.Provider>
  )
}

export const useCart = () => useContext(cartContext)

// =================================================================================================

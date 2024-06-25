import React, { createContext, useContext, useEffect, useReducer, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter(item => item._id !== action.payload.id);
    case 'SET_CART':
      return action.payload;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [user,setUser] = useState(auth ? auth.user : null)
  const [token, setToken] = useState(() => (auth ? auth.token : null));
  const [port] = useState("https://jewel-e-comm.onrender.com/api/v1");

  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const existingCartItems = localStorage.getItem('cart');
    return existingCartItems ? JSON.parse(existingCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product._id });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId  });
  };

  const value = useMemo(() => ({
    user,
    setUser,
    port,
    token,
    setToken,
    cart,
    addToCart,
    removeFromCart,
  }), [user, token, cart]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

import axios from "axios";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../types/cartTypes";

// add to cart
export const addToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data._id,
      name: data.name,
      price: data.price,
      image: data.images[0].url,
      stock: data.stock,
      quantity,
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// remove to cart
export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

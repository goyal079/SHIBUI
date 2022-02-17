import {
  ADD_TO_CART,
  CLEAR_ERRORS,
  REMOVE_FROM_CART,
} from "../types/cartTypes";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const itemExists = state.cartItems.find((i) => i.product == item.product);
      if (itemExists) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === item.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

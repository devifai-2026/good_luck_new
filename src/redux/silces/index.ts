import { combineReducers } from "@reduxjs/toolkit";

// import {cartReducer} from './cart.slice';
import { orderReducer } from "./order.slice";
import { authReducer } from "./auth.silce";
import { productReducer } from "./product.slice";

export const rootReducer = combineReducers({
  // cart: cartReducer,
  order: orderReducer,
  auth: authReducer,
  product: productReducer,
});

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { orderInitialState, IOrderState } from "../redux.constants";

// Redux Toolkit slice
export const orderSlice = createSlice({
  name: "order",
  initialState: orderInitialState,

  reducers: {
    setCurrentOrder: (state: IOrderState, action: PayloadAction<any>) => {
      return {
        ...state,
        currentOrderDetails: {
          ...state.currentOrderDetails,
          ...action.payload,
        },
      };
    },

    clearOrder: () => {
      return {
        ...orderInitialState,
      };
    },

    setButtonState: (state: IOrderState, action: PayloadAction<boolean>) => {
      return {
        ...state,
        disableButton: action.payload,
      };
    },
  },
});
export const { setCurrentOrder, setButtonState, clearOrder } =
  orderSlice.actions;

export const orderReducer = orderSlice.reducer;

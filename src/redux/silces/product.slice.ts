import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IProductState, productInitialState } from "../redux.constants";

export const productSLice = createSlice({
  name: "product",
  initialState: productInitialState,

  reducers: {
    setCurrentProductDetails: (
      state: IProductState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        productDetails: action.payload,
      };
    },

    clearProductS: () => {
      return {
        ...productInitialState,
      };
    },
  },
});
export const { setCurrentProductDetails, clearProductS } = productSLice.actions;

export const productReducer = productSLice.reducer;

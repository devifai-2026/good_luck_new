import React from "react";
import { addMoneyInWalletById } from "../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux";
import { notifyMessage } from "./useDivineShopServices";
import { useNavigation } from "@react-navigation/native";
import {
  updateTransactionHistory,
  updateWallet,
} from "../redux/silces/auth.silce";

const useCommonFunctionalities = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID ?? ""
  );

  const dispatch = useDispatch();
  const rechargeWallet = async (
    transactionid: string,
    description: string,
    amount: number,
    callback: any
  ) => {
    try {
      const response = await addMoneyInWalletById(userId, {
        amount,
        description,
        transactionId: transactionid,
      });
      //response?.data, "after rechargig");
      dispatch(updateWallet({ balance: response?.data?.updatedBalance }));

      dispatch(
        updateTransactionHistory(response?.data?.transactionHistory?.reverse())
      );
      notifyMessage(response?.data?.message);

      callback();
    } catch (error: any) {
      console.error("Error adding money to wallet:", error);
      notifyMessage(error?.message);
    }
  };
  return {
    rechargeWallet,
  };
};

export default useCommonFunctionalities;

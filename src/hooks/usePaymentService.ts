import React from "react";
import { createRazorPayOrder } from "../services";
import { paymentCredentials } from "../constants";
import { styleConstants } from "../styles/constants";
import RazorpayCheckout from "react-native-razorpay";
import { delay } from "redux-saga/effects";
import { useSelector } from "react-redux";
import { RootState } from "../redux";

export interface RazorpayPaymentData {
  paymentId: string;
  orderId: string;
  signature: string;
}

const usePaymentService = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );
  const email = useSelector(
    (state: RootState) => state.auth.userDetails?.email
  );
  const handlePayment = async (
    amount: number,
    callback: (data: RazorpayPaymentData) => Promise<void>
  ): Promise<{ success: boolean; cancelled: boolean; error?: string }> => {
    try {
      const razorPayOrderResponse = await createRazorPayOrder({ amount });
      const orderData = razorPayOrderResponse?.data?.data;

      if (orderData?.id && orderData?.amount_paid === 0) {
        const options = {
          description: paymentCredentials.description,
          currency: paymentCredentials.currency,
          key: paymentCredentials.razorpayKey,
          amount: amount * 100,
          name: paymentCredentials.name,
          order_id: orderData?.id,
          prefill: {
            email: email || "example@domain.com",
            name: userId || "Guest User",
          },
          theme: { color: styleConstants.color.primaryColor },
        };

        try {
          const razorpayResult = await RazorpayCheckout.open(options);

          if (razorpayResult?.razorpay_payment_id) {
            await callback({
              paymentId: razorpayResult.razorpay_payment_id,
              orderId: razorpayResult.razorpay_order_id,
              signature: razorpayResult.razorpay_signature,
            });
            return { success: true, cancelled: false };
          }
          return { success: false, cancelled: false };
        } catch (error: any) {
          // code 0 means user dismissed/cancelled the Razorpay sheet
          if (error?.code === 0) {
            return { success: false, cancelled: true };
          }
          return { success: false, cancelled: false, error: error?.description ?? "Payment failed" };
        }
      }
      return { success: false, cancelled: false, error: "Failed to create order" };
    } catch (error: any) {
      return { success: false, cancelled: false, error: error?.message ?? "Payment failed" };
    }
  };
  return { handlePayment };
};

export default usePaymentService;

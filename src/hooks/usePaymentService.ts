import React from "react";
import { createRazorPayOrder } from "../services";
import { paymentCredentials } from "../constants";
import { styleConstants } from "../styles/constants";
import RazorpayCheckout from "react-native-razorpay";
import { delay } from "redux-saga/effects";
import { useSelector } from "react-redux";
import { RootState } from "../redux";

const usePaymentService = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );
  const email = useSelector(
    (state: RootState) => state.auth.userDetails?.email
  );
  const handlePayment = async (
    amount: number,
    callback: (id: string) => Promise<void>
  ) => {
    try {
      const razorPayOrderResponse = await createRazorPayOrder({
        amount: amount,
      });
      const data = razorPayOrderResponse?.data?.data;

      if (data?.id && data?.amount_paid === 0) {
        const options = {
          description: paymentCredentials.description,

          currency: paymentCredentials.currency,
          key: paymentCredentials.razorpayKey, // Replace with your actual Razorpay API key
          amount: amount * 100, // Convert amount to paise
          name: paymentCredentials.name,
          order_id: data?.id, // Replace with an order_id created using Razorpay's Orders API
          prefill: {
            email: email || "example@domain.com",
            //  contact: mobileNumber,
            name: userId || "Guest User",
          },
          theme: { color: styleConstants.color.primaryColor },
        };

        try {
          const data = await RazorpayCheckout.open(options);

          if (data?.razorpay_payment_id) {
            // Update payment status in your backend

            delay(3000);

            console.log(data?.razorpay_payment_id);
            callback(data?.razorpay_payment_id);
          }
        } catch (error) {
          console.error("Payment Failed:", error);
        }
      }
    } catch (error) {
      console.error("Payment Failed:", error);
    }
  };
  return { handlePayment };
};

export default usePaymentService;

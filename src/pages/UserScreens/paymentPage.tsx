import React, { useState } from "react";
import { View } from "react-native";

import { useDispatch } from "react-redux";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { styleConstants } from "../../styles/constants";

import usePaymentService, { RazorpayPaymentData } from "../../hooks/usePaymentService";
import { notifyMessage } from "../../hooks/useDivineShopServices";

import { paymentPage as styles } from "../../styles";

// Define the PaymentPage component

export enum PaymentType {
  independent,
  wallet,
}

const PaymentPage = (props: {
  paymentType: PaymentType;
  mobileNumber: string;
  amount: number;
  callback: (data: RazorpayPaymentData) => Promise<void>;
  buttonState: boolean;
  buttonText?: string;
}) => {
  const { amount, callback, buttonText, buttonState, paymentType } = props;

  const { handlePayment } = usePaymentService();

  const [loading, setloading] = useState(false);

  const payNow = async () => {
    setloading(true);
    try {
      if (paymentType === PaymentType.independent) {
        const result = await handlePayment(amount, callback);
        if (result.cancelled) {
          notifyMessage("Payment cancelled.");
        } else if (!result.success) {
          notifyMessage(result.error ?? "Payment failed. Please try again.");
        }
      } else {
        await callback({
          paymentId: `wallet-${Math.random().toString(36).substring(2)}-${Date.now()}`,
          orderId: "",
          signature: "",
        });
      }
    } catch (error: any) {
      notifyMessage(error?.message ?? "Payment failed. Please try again.");
    } finally {
      setloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={payNow}
        style={[
          styles.footerButton,
          !buttonState
            ? {}
            : { backgroundColor: styleConstants.color.backgroundGrayColor },
        ]}
        disabled={buttonState || loading}
      >
        <Text
          style={[
            styles.buttonText,
            !buttonState ? {} : { color: styleConstants.color.textBlackColor },
          ]}
        >
          {loading ? (
            <ActivityIndicator
              size={"small"}
              color={styleConstants.color.backgroundWhiteColor}
            />
          ) : (
            buttonText ?? `Pay ₹${amount} online`
          )}
        </Text>
      </Button>
    </View>
  );
};

export default PaymentPage;

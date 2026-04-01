import React, { useState } from "react";
import { View } from "react-native";

import { useDispatch } from "react-redux";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { styleConstants } from "../../styles/constants";

import usePaymentService from "../../hooks/usePaymentService";

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
  callback: (id: string) => Promise<void>;
  buttonState: boolean;
  buttonText?: string;
}) => {
  const { amount, callback, buttonText, buttonState, paymentType } = props;

  const { handlePayment } = usePaymentService();

  const [loading, setloading] = useState(false);

  // Access user details from Redux

  // const buttonState = useSelector(
  //   (state: RootState) => state.order.disableButton
  // );

  // Handle payment logic

  const payNow = async () => {
    setloading(true);
    try {
      if (paymentType === PaymentType.independent)
        await handlePayment(amount, callback);
      else
        await callback(
          `wallet-${Math.random().toString(36).substring(2)}-${Date.now()}`
        );
    } catch (error) {
      console.error(error);
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

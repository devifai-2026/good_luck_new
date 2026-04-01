// CartLayout.tsx
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Avatar, IconButton, Button } from "react-native-paper";
import { cartLayoutStyle as styles } from "../../styles/cart.styles";
import { useNavigation } from "@react-navigation/native";
import useDivineShopServices, {
  notifyMessage,
} from "../../hooks/useDivineShopServices";

import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import PaymentPage, { PaymentType } from "../../pages/UserScreens/paymentPage";
import { dummyImageURL } from "../../constants";
import { UserRoleEnum } from "../../redux/redux.constants";

const CartLayout: React.FC<{
  children: React.ReactNode;
  buttonText?: string;
  navigation?: any;
}> = ({ children, buttonText }) => {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation<any>();
  const orderDetails = useSelector(
    (state: RootState) => state.order.currentOrderDetails
  );

  const disableButton = useSelector(
    (state: RootState) => state.order.disableButton
  );
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);

  const astrologerDetails = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerDetails
  );

  const role = useSelector((state: RootState) => state.auth.userDetails?.role);

  const { addOrder } = useDivineShopServices();

  const handleAddOrder = async (transactionId: string) => {
    try {
      await addOrder(transactionId);
    } catch (error) {
      console.error(error);
    }
  };

  const imageURl =
    (astrologerDetails?.profile_picture
      ? astrologerDetails?.profile_picture
      : userDetails?.profilePicture) ?? dummyImageURL;

  const name =
    (astrologerDetails?.Fname
      ? astrologerDetails?.Fname
      : userDetails?.fullName) ?? "User";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Image
            size={width * 0.1}
            source={{ uri: imageURl ?? dummyImageURL }}
          />
          <Text style={styles.welcomeText}>Welcome {name}</Text>
        </View>
        {/* <View style={styles.headerRight}>
          <IconButton
            icon="bell"
            size={width * 0.06}
            onPress={() => {
              navigation.goBack();
            }}
            iconColor="white"
          />
          <IconButton
            icon="wallet"
            size={width * 0.06}
            onPress={() => {}}
            iconColor="white"
          />
        </View> */}
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          {buttonText === "Place order" ? (
            <PaymentPage
              paymentType={PaymentType.independent}
              amount={orderDetails?.totalPrice ?? 100}
              mobileNumber={userDetails?.phoneNumber ?? ""}
              callback={handleAddOrder}
              buttonState={disableButton}
            />
          ) : (
            <Button
              style={styles.footerButton}
              onPress={() => {
                if (role === UserRoleEnum.user) navigation.navigate("checkout");
              }}
            >
              <Text style={styles.buttonText}>
                {role === UserRoleEnum.affiliateMarketer ||
                role === UserRoleEnum.astrologer
                  ? "Share Product "
                  : buttonText}
              </Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default CartLayout;

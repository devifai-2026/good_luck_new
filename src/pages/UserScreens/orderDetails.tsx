import { View, Text, StyleSheet, BackHandler } from "react-native";
import React from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import { styleConstants } from "../../styles/constants";

import OrderDetails from "../../components/User/orderDetails";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const OrderDetailsPage = () => {
  const navigation = useNavigation<any>();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("orderListing");
        return true; // Prevent default behavior (exit app)
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );
  return (
    <View style={{ height: "100%" }}>
      <HomeScreenLayout hideFooter>
        <OrderDetails />
      </HomeScreenLayout>
    </View>
  );
};

export default OrderDetailsPage;

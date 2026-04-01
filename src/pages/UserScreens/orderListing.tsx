import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import useDivineShopServices from "../../hooks/useDivineShopServices"; // Fetching orders from an API
import moment from "moment"; // Import moment.js for date formatting
import { styleConstants } from "../../styles/constants";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";

import { orderListingStyles as styles } from "../../styles";
import NoDataComponent from "../../components/User/noDataComponent";

const OrderListingPage = ({ navigation }: { navigation: any }) => {
  const {
    orderList,
    loadingOrderList,
    getOrderListByUserId,
    getOrderDetailsByOrderId,
  } = useDivineShopServices(); // Fetching orders from an API

  const handleItemClick = (id: string) => {
    getOrderDetailsByOrderId(id);
    navigation.navigate("orderdetails", { orderId: id });
  };

  useEffect(() => {
    getOrderListByUserId(); // Fetch orders when component mounts
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => {
        handleItemClick(item?.id);
      }}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderDetails}>
          <Text style={styles.orderNumber}>Order #{item?.id}</Text>
          <Text style={styles.orderTitle}>{item.title}</Text>
          <Text style={styles.orderDate}>
            Delivery Date: {moment(item.deliveryDate).format("DD MMM YYYY")}
          </Text>
          <Text style={styles.orderTotal}>Total: ₹{item?.total}</Text>
        </View>

        {item?.source && (
          <Image
            source={{ uri: item?.source?.uri }} // Correctly format the image source
            style={styles.orderImage} // Apply styles to the image
            resizeMode="contain" // Adjust the image size as needed
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <HomeScreenLayout hideFooter>
      {loadingOrderList ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size={"large"}
          color={styleConstants.color.primaryColor}
        />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Orders</Text>
          </View>
          {orderList?.length === 0 ? (
            <NoDataComponent message="No orders avilable" />
          ) : (
            <FlatList
              data={orderList} // List of orders
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
            />
          )}
        </>
      )}
    </HomeScreenLayout>
  );
};

export default OrderListingPage;

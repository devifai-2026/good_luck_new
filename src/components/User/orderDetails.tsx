import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { OrderDetailStyles as styles } from "../../styles/cart.styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import useDivineShopServices from "../../hooks/useDivineShopServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ActivityIndicator } from "react-native";
import { styleConstants } from "../../styles/constants";
import { useNavigation } from "@react-navigation/native";

const OrderDetails: React.FC<{
  closeModal?: any;
}> = ({
  closeModal,
  // order details depending on current purchase or previous all orders.
}) => {
  const orderDetails = useSelector(
    (state: RootState) => state.order.currentOrderDetails
  );
  const productDetails = useSelector(
    (state: RootState) => state.product.productDetails
  );

  const navigation = useNavigation<any>();

  const { loadingOrderList } = useDivineShopServices();

  console.log(orderDetails, "in page");

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={closeModal}>
          <Icon
            onPress={() => {
              navigation.navigate("orderListing");
            }}
            name="arrow-back"
            size={24}
            color="black"
            style={{ top: -2, zIndex: 10000000000000 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
      </View>
      <>
        {loadingOrderList || orderDetails === null ? (
          <ActivityIndicator
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            size={"large"}
            color={styleConstants.color.primaryColor}
          />
        ) : (
          <>
            <View style={styles.orderDetailsContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={orderDetails.source ?? productDetails?.source}
                  style={styles.image}
                />
              </View>
              <View style={styles.details}>
                <Text style={styles.name}>{orderDetails.title}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.discountedPrice}>
                    ₹ {orderDetails.discountedPrice * orderDetails.count}
                  </Text>
                  <Text style={styles.originalPrice}>
                    ₹ {orderDetails.originalPrice * orderDetails.count}
                  </Text>
                </View>
                <View style={styles.count}>
                  <Text style={styles.countText}>Quantity :</Text>
                  <Text style={styles.countText}>{orderDetails.count}</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.orderDetails}>
              <View style={styles.orderDetailCategory}>
                <Text style={styles.categoryName}>Name:</Text>
                <Text style={styles.categoryValue}>{orderDetails.name}</Text>
              </View>
              <View style={styles.orderDetailCategory}>
                <Text style={styles.categoryName}>City:</Text>
                <Text style={styles.categoryValue}>{orderDetails.city}</Text>
              </View>
              <View style={styles.orderDetailCategory}>
                <Text style={styles.categoryName}>State:</Text>
                <Text style={styles.categoryValue}>{orderDetails.state}</Text>
              </View>
              <View style={styles.orderDetailCategory}>
                <Text style={styles.categoryName}>Phone Number:</Text>
                <Text style={styles.categoryValue}>{orderDetails.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderDetails}>
              <View style={styles.orderDetailCategory}>
                <Text style={styles.categoryName}>Order Date</Text>
                <Text style={styles.categoryValue}>
                  {orderDetails?.createDate}
                </Text>
              </View>
              <View style={styles.orderDetailCategory}>
                <Text style={styles.categoryName}>Delivery Date</Text>
                <Text style={styles.categoryValue}>
                  {orderDetails?.deliveryDate}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.total}>
                <Text style={styles.totalText}>Subtotal</Text>
                <Text style={styles.totalAmount}>₹{orderDetails.subTotal}</Text>
              </View>
              {(orderDetails?.isSuperNoteApplied ||
                orderDetails?.isPromoCodeApplied) && (
                <View style={styles.total}>
                  <Text style={styles.totalText}>Discounted price</Text>
                  <Text style={styles.totalAmount}>
                    ₹{orderDetails.discountedTotalPrice}
                  </Text>
                </View>
              )}

              <View style={styles.total}>
                <Text style={styles.totalText}>GST</Text>
                <Text style={styles.totalAmount}>₹{orderDetails.tax}</Text>
              </View>
              <View style={styles.total}>
                <Text style={styles.totalText}>Shipping</Text>
                <Text style={styles.totalAmount}>₹{orderDetails.shipping}</Text>
              </View>
              <View style={styles.total}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>₹{orderDetails.total}</Text>
              </View>

              <View style={styles.divider} />
              <View style={styles.total}>
                <Text style={styles.totalText}>Payment status</Text>
                <Text style={styles.totalAmount}>
                  {orderDetails.isPaid ? "Success" : "Failed"}
                </Text>
              </View>
            </View>
          </>
        )}
      </>
    </View>
  );
};

export default OrderDetails;

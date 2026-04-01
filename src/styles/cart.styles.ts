import { styleConstants } from "./constants";
import { Dimensions, StyleSheet } from "react-native";

export const cartLayoutStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
  },
  headerRight: {
    flexDirection: "row",
  },
  content: {
    flex: 1, // Ensure content takes up available space
    padding: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 3,
    height: 80, // Set a fixed height for the footer
    position: "relative",
  },
  footerButton: {
    backgroundColor: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
    borderRadius: 25,
    marginTop: 5,
    height: 50,
    justifyContent: "center",
    width: 310, //try to get screen-width
    textAlign: "center",
  },
  buttonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    // fontWeight: "700",
  },
});

export const productDetailStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 15,
  },
  imageWrapper: {
    width: "95%",
    backgroundColor: styleConstants.color.backgroundGrayColor,
    alignItems: "center",
    marginLeft: 7, //change may needed according to device
    borderRadius: 16, // figma layout value
  },
  image: {
    alignItems: "center",
    margin: 40,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 10,
    marginTop: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    justifyContent: "flex-start",
  },
  originalPrice: {
    fontSize: 14,
    color: styleConstants.color.textGrayColor,
    textDecorationLine: "line-through", // Strikethrough effect

    fontFamily: styleConstants.fontFamily,
  },
  discountedPrice: {
    fontSize: 24,

    color: styleConstants.color.textBlackColor, // You can adjust this color based on your design
    fontFamily: styleConstants.fontFamily,
  },
  descriptionContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    color: styleConstants.color.textGrayColor,
  },
  description: {
    marginBottom: 0,
    paddingBottom: 0,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  moreButton: {
    fontSize: 16,
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },
});

export const paymentDetailStyles = StyleSheet.create({
  puschaseDetailsContainer: {
    flexDirection: "row",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 15,
  },
  imageContainer: {
    backgroundColor: styleConstants.color.backgroundGrayColor,
    padding: 10,
    width: 100,
    borderRadius: 16,
    margin: 10,
  },
  image: {
    width: 80,
    height: 80,
  },
  details: {
    padding: 5,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "800", //600 in figma but 800 suites as per visuals. might be needed to change at titles also.
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  priceContainer: {
    flexDirection: "row",
    top: 2,
  },
  originalPrice: {
    fontSize: 18,
    color: styleConstants.color.textGrayColor,
    textDecorationLine: "line-through", // Strikethrough effect
    marginLeft: 10,
    fontFamily: styleConstants.fontFamily,
  },
  discountedPrice: {
    fontSize: 18,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
    left: -8,
  },
  countButton: {
    height: 24, //36 in figma but 800 suites as per visuals. might be needed to change at titles also.
    width: 24,
    backgroundColor: styleConstants.color.backgroundGrayColor,
    borderRadius: 18,
  },
  countText: {
    marginHorizontal: 5,
    fontFamily: styleConstants.fontFamily,
    fontSize: 18,
    fontWeight: "600",
    color: styleConstants.color.textBlackColor,
  },
  addressDetailsContainer: {
    marginTop: 8,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 8,
    justifyContent: "center",
    marginTop: 15,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 46,
    marginBottom: 10,
    color: styleConstants.color.textBlackColor,
    fontSize: 16,
    textAlignVertical: "center",
    fontFamily: styleConstants.fontFamily,
  },
  paymentMethodContainer: {
    marginTop: 8,
  },
  paymentMethods: {
    flexDirection: "row",
    margin: 7,
    marginVertical: 10,
  },
  paymentOption: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentImageContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: styleConstants.color.textGrayColor,
    marginHorizontal: 8,
    borderRadius: 16,
  },
  paymentMethodImage: {
    height: 32,
    width: 32,
    backgroundColor: "transparent",
  },
  paymentMethodText: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    fontWeight: "300",
    margin: 4,
    color: styleConstants.color.textBlackColor,
  },
  divider: {
    margin: 10,
    height: 1,
    backgroundColor: styleConstants.color.textGrayColor,
  },
  deliveryDetails: {
    margin: 15,
  },
  deliveryDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    marginVertical: 2,
  },
  dateText: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    fontWeight: "300",
    color: styleConstants.color.textBlackColor,
  },
  date: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,

    color: styleConstants.color.textBlackColor,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    marginVertical: 2,
  },
  totalText: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    fontWeight: "300",
    color: styleConstants.color.textBlackColor,
  },
  totalAmount: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 18,

    color: styleConstants.color.textBlackColor,
  },

  textInput: {
    flex: 1, // Allow the TextInput to take up available space
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginRight: 8, // Space between TextInput and Button
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    color: styleConstants.color.textBlackColor,
  },
  button: {
    marginTop: 10,
    backgroundColor: styleConstants.color.primaryColor,
    height: 50,
    justifyContent: "center",
    borderRadius: 8,
    width: "30%",
    alignSelf: "center",
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
});

export const OrderDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    height: "85%",
    paddingTop: 15,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    // fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 15,
  },
  orderDetailsContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    backgroundColor: styleConstants.color.backgroundGrayColor,
    padding: 10,
    width: 100,
    borderRadius: 16,
    margin: 10,
  },
  image: {
    width: 80,
    height: 80,
  },
  details: {
    padding: 5,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    // fontWeight: "800", //600 in figma but 800 suites as per visuals. might be needed to change at titles also.
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  priceContainer: {
    flexDirection: "row",
    top: 2,
  },
  originalPrice: {
    fontSize: 18,
    color: styleConstants.color.textGrayColor,
    textDecorationLine: "line-through", // Strikethrough effect
    marginLeft: 10,
    fontFamily: styleConstants.fontFamily,
  },
  discountedPrice: {
    fontSize: 18,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
    left: -8,
    textAlign: "center",
  },
  countText: {
    marginHorizontal: 5,
    fontFamily: styleConstants.fontFamily,
    fontSize: 18,
    // fontWeight: "600",
    color: styleConstants.color.textBlackColor,
  },
  divider: {
    margin: 10,
    height: 1,
    backgroundColor: styleConstants.color.textGrayColor,
  },
  orderDetails: {
    margin: 15,
  },
  orderDetailCategory: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    marginVertical: 2,
  },
  categoryName: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    // fontWeight: "300",
    color: styleConstants.color.textBlackColor,
  },
  categoryValue: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    // fontWeight: "700",
    color: styleConstants.color.textBlackColor,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    marginVertical: 2,
  },
  totalText: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    // fontWeight: "300",
    color: styleConstants.color.textBlackColor,
  },
  totalAmount: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 18,
    // fontWeight: "700",
    color: styleConstants.color.textBlackColor,
  },
});

export const orderListingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.transparent,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    marginLeft: 16,
    color: styleConstants.color.textBlackColor,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align items vertically centered
  },
  orderDetails: {
    flex: 1, // Allow the text section to take remaining space
  },
  orderNumber: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    fontWeight: "600",
    color: styleConstants.color.textBlackColor,
    marginBottom: 4, // Add spacing for better readability
  },
  orderImage: {
    width: 60, // Set a specific width
    height: 60, // Set a specific height
    borderRadius: 8, // Optional: Add border radius if needed
    marginLeft: 8, // Space between text and image
  },
  orderTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 4,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  orderTotal: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginTop: 4, // Add spacing for clarity
  },
});

export const paymentConfirm = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    backgroundColor: styleConstants.color.primaryColor,
    color: styleConstants.color.textWhiteColor,
  },
  text: {
    textAlign: "center",
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    fontWeight: "500",
    color: styleConstants.color.textWhiteColor,
  },
  enableButton: {
    backgroundColor: styleConstants.color.textWhiteColor,
    borderRadius: 25,
    marginTop: 25,
    height: 50,
    justifyContent: "center",
    width: 310,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: styleConstants.color.textGrayColor,
    borderRadius: 25,
    marginTop: 25,
    height: 50,
    justifyContent: "center",
    width: 310,
    textAlign: "center",
  },
  buttonText: {
    color: styleConstants.color.primaryColor,
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    fontWeight: "500",
  },
});

const { width } = Dimensions.get("screen");
export const paymentPage = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  footerButton: {
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 25,
    marginTop: 5,
    height: 50,
    justifyContent: "center",
    width: width * 0.85, // 85% of screen width
  },
  buttonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    textAlign: "center",
  },
});

export const plansStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "black",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#FFFFFF",
    fontFamily: styleConstants.fontFamily,
  },
  card: {
    width: 140, // Adjusted card size for better layout
    padding: 16,
    justifyContent: "center",
    backgroundColor: styleConstants.color.transparent,
    marginRight: 16,
    borderRadius: 10,
    borderWidth: 2,
    position: "relative",
    height: 140,
  },
  popular: {
    fontSize: 14,
    color: "#FFD700",
    position: "absolute",
    top: 10,
    left: 5,
  },
  planName: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 22,
    marginBottom: 8,
    fontFamily: styleConstants.fontFamily,
  },
  price: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
  tick: {
    position: "absolute",
    top: 5,
    right: 5,
    fontSize: 18,
    color: "#FFD700",
  },
  additionalCard: {
    backgroundColor: styleConstants.color.transparent,
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    borderColor: styleConstants.color.textWhiteColor,
    borderWidth: 1,
  },
  additionalCardTop: {
    borderBottomWidth: 1,
    borderColor: styleConstants.color.textWhiteColor,
    paddingBottom: 10,
    marginBottom: 10,
  },
  additionalCardText: {
    fontSize: 16,
    color: styleConstants.color.textWhiteColor,
    fontFamily: styleConstants.fontFamily,
  },
  additionalCardMainText: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
  },
  tAndC: {
    fontSize: 12,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
    marginVertical: 10,
  },
  submitButton: {
    // marginTop: 20,
    // paddingVertical: 10,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 57,
    height: 50,
    justifyContent: "center",
  },
});

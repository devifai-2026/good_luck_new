import { Dimensions, StyleSheet, StatusBar, Platform } from "react-native";
import { styleConstants } from "./constants";

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 30;

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const homePageStyle = StyleSheet.create({
  container: {
    backgroundColor: styleConstants.color.transparent,
    height: "auto",
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 4,
  },
  imageContainer: {
    width: screenWidth - 30,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginVertical: 10, // Adds space between the images
  },
  image: {
    width: "100%",
    borderRadius: 20,
  },
  textOverlayLeft: {
    position: "absolute",
    bottom: 45, // Adjusts the vertical spacing from the bottom
    left: 20,
    right: 20,
    paddingVertical: 10,
    alignItems: "flex-start", // Aligns text to the left
  },
  textOverlayRight: {
    position: "absolute",
    bottom: 45, // Adjusts the vertical spacing from the bottom
    left: 20,
    right: 20,
    paddingVertical: 10,
    alignItems: "flex-end", // Aligns text to the right
    fontFamily: styleConstants.fontFamily,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: styleConstants.color.textWhiteColor,
    marginBottom: 5, // Adds spacing between header and subtext
    fontFamily: styleConstants.fontFamily,
  },
  subText: {
    fontSize: 16,
    color: styleConstants.color.textWhiteColor,
    fontFamily: styleConstants.fontFamily,
  },
  // spacer: {
  //   height: 20, // Adds space between the two image containers
  // },
  //spacer not required. Delete this part.

  menuImagesContainer: {
    paddingVertical: 4,
  },
  menuImage: {
    width: screenWidth - 20,
    height: Math.round(screenHeight * 0.22),
    marginHorizontal: 10,
    borderRadius: 16,
    resizeMode: "cover",
  },
});

export const walletStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 16 + STATUSBAR_HEIGHT,
    backgroundColor: styleConstants.color.backgroundGrayColor,
  },
  userName: {
    fontSize: 24,
    fontFamily: styleConstants.fontFamily,
    marginBottom: 8,
  },
  walletBalance: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: "#4caf50", // Green for balance
    marginBottom: 16,
  },
  rechargeButton: {
    marginBottom: 16,
    backgroundColor: styleConstants.color.primaryColor,
  },
  rechargeButtonText: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
  },
  header: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    margin: 16,
    color: styleConstants.color.textBlackColor,
  },
  listItem: {
    paddingVertical: 8,
  },
  chip: {
    marginVertical: 6,
    borderRadius: 16,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  chiptext: {
    fontFamily: styleConstants.fontFamily,
  },
  creditChip: {
    backgroundColor: styleConstants.color.lightGreen, // Light green
  },
  debitChip: {
    backgroundColor: styleConstants.color.lightRed, // Light red
  },
  amount: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
  creditAmount: {
    color: styleConstants.color.deepGreen, // Green for credit
  },
  debitAmount: {
    color: styleConstants.color.deepRed, // Red for debit
  },
});

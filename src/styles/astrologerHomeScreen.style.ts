import { Dimensions, StyleSheet } from "react-native";
import { styleConstants } from "./constants";

const screenWidth = Dimensions.get("window").width;

export const astrologerHomeScreenStyle = StyleSheet.create({
  container: {
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    width: screenWidth - 30, // Added consistent padding
    justifyContent: "space-between",
    padding: 16,
    flexDirection: "row",
    borderRadius: 16,
    marginTop: 16,
    alignSelf: "center", // Centers the container
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  balanceContainer: {
    gap: 8,
    alignItems: "flex-start",
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "400",
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  amountText: {
    fontSize: 28, // Reduced size slightly for better fit
    fontWeight: "500",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  withdrawButton: {
    height: 48,
    width: 140,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  withdrawText: {
    fontWeight: "500",
    fontSize: 16,
    color: "#FFF",
    fontFamily: styleConstants.fontFamily,
  },
  requestTitleText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "600",
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  requestList: {
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2, // Added slight shadow for better separation
  },
  unverifiedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
  },
  unverifiedText: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 20,
    fontFamily: styleConstants.fontFamily,
    textAlign: "center",
  },
  verifyButton: {
    backgroundColor: styleConstants.color.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
});

import { Dimensions, StyleSheet } from "react-native";
import { styleConstants } from "./constants";

const screenWidth = Dimensions.get("window").width;

export const astrologerRequestScreenStyle = StyleSheet.create({
  appBar: { flexDirection: "row", gap: 10 },
  content: {
    padding: "auto",
    marginTop: "5%",
    flex: 1,
    marginLeft: "2%",
  },
  requestTitleText: {
    color: "#222",
    fontSize: 24,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
  arrowBtn: { padding: 5 },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: "#2C3E50",
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginVertical: 16,
    marginHorizontal: 20,
    gap: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    borderColor: styleConstants.color.primaryColor,
    borderWidth: 1,
  },
  selectedTab: {
    backgroundColor: styleConstants.color.primaryColor,
  },
  tabButtonText: {
    textAlign: "center",
    fontSize: 16,

    fontFamily: styleConstants.fontFamily,
    //color: selectedTab === 'callRequests' ? '#FF6B6B' : '#2C3E50',
  },
  requestList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  requestDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: "#2C3E50",
  },
  time: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: "#7F8C8D",
  },
  acceptButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  completeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
});

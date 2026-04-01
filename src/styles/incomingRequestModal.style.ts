import { StyleSheet, Dimensions } from "react-native";
import { styleConstants } from "./constants";

const { width, height } = Dimensions.get("window");

export const incomingRequestModalStyle = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  userInfoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    fontFamily: styleConstants.fontFamily,
  },
  requestType: {
    fontSize: 18,
    color: "#e0e0e0",
    marginTop: 10,
    fontFamily: styleConstants.fontFamily,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
  },
  buttonWrapper: {
    alignItems: "center",
  },
});

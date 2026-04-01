import { StyleSheet } from "react-native";
import { styleConstants } from "./constants";

export const subscriptionStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",

    borderRadius: 20,
    padding: 16,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 28,
    color: styleConstants.color.textWhiteColor,
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
    width: 140,
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
  balance: {
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
  submitButton: {
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 57,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
  },

  textInput: {
    flex: 1, // Allow the TextInput to take up available space
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,

    marginRight: 8, // Space between TextInput and Button
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    color: styleConstants.color.textWhiteColor,
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

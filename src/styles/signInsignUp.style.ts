import { StyleSheet } from "react-native";
import { styleConstants } from "./constants";
import { Colors } from "react-native/Libraries/NewAppScreen";

export const signSignUpStyle = StyleSheet.create({
  buttonContainer: {
    width: "98%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
  signInButton: {
    width: "100%",
    padding: 15,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 46,
    marginBottom: 10,
    alignItems: "center",
  },
  signInButtonText: {
    color: styleConstants.color.primaryColor, // saffron color
    fontSize: 18,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
  signUpButton: {
    width: "100%",
    padding: 15,
    borderColor: styleConstants.color.backgroundWhiteColor,
    borderWidth: 1,
    borderRadius: 46,
    backgroundColor: styleConstants.color.transparent,
    alignItems: "center",
  },
  signUpButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
});

export const signInPageStyle = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginTop: 20,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  forgotPasswordLink: {
    alignItems: "flex-end",
    marginVertical: 10,
  },
  forgotPasswordText: {
    color: styleConstants.color.primaryColor, // saffron color
    fontSize: 16,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
  loginButton: {
    width: "100%",
    padding: 15,
    backgroundColor: styleConstants.color.primaryColor, // saffron color
    borderRadius: 46,
    alignItems: "center",
  },
  loginButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
  selectRoleButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radioButton: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export const createAccountStyle = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginTop: 20,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 10,
    alignSelf: "center",
  },
  signUpButton: {
    width: "100%",
    padding: 15,
    backgroundColor: styleConstants.color.primaryColor, // saffron color
    borderRadius: 46,
    alignItems: "center",
  },
  signUpButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
  selectRoleButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  radioButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  loginButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
});
export const otpInputStyle = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    color: styleConstants.color.backgroundWhiteColor,
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,

    textAlignVertical: "center",
    fontFamily: styleConstants.fontFamily,
  },
  timerContainer: {
    borderRadius: 100,

    // backgroundColor: styleConstants.color.primaryColor, // Ensure the container background is transparent
  },
  timerText: {
    color: styleConstants.color.primaryColor, // saffron color for the timer
    fontSize: 16,
  },
  timerCountdown: {
    color: styleConstants.color.primaryColor, // saffron color for the countdown
    fontSize: 16,
  },

  resendButtonText: {
    color: styleConstants.color.primaryColor, // saffron color
    fontSize: 16,
  },
  signUpButton: {
    width: "100%",
    padding: 15,
    backgroundColor: styleConstants.color.primaryColor, // saffron color
    borderRadius: 46,
    alignItems: "center",
    marginTop: 20,
  },
  signUpButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },

  otpText: {
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 20, // Set a value for lineHeight based on your design needs
  },
});

export const authLayOutStyle = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  backgroundImage: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  header: {
    elevation: 0,
    display: "flex",
    flexDirection: "row",
    paddingTop: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  icon: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 10000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
    height: "90%",
  },
  headerTextLineOne: {
    color: styleConstants.color.textWhiteColor,
    textAlign: "center",
    fontFamily: styleConstants.fontFamily,
    fontSize: 40,
    fontWeight: "400",
    lineHeight: 50,
    marginBottom: 10,
    position: "absolute",
    top: 20,
    width: "100%",
  },
  headerTextLineTwo: {
    color: styleConstants.color.textWhiteColor,
    textAlign: "center",
    fontFamily: styleConstants.fontFamily,
    fontSize: 46,
    fontWeight: "400",
    lineHeight: 60,
    marginBottom: 20,
    position: "absolute",
    top: 70,
    width: "100%",
  },
  logoImageContainer: {
    alignItems: "center",
    marginBottom: 210,
    borderRadius: 100,
  },
  logoImageStyle: {
    width: 200,
    height: 200,

    backgroundColor: "transparent",
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
});

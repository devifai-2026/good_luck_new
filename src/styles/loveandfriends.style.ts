import { Dimensions, StyleSheet } from "react-native";
import { styleConstants } from "./constants";

export const MatchesStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  matchesContent: {
    marginHorizontal: 10,
    flex: 1,
  },
});

export const matchesListStyles = StyleSheet.create({
  matches: {
    padding: 0,
  },
  matchContainer: {
    padding: 5,
    backgroundColor: styleConstants.color.backgroundGrayColor,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
    display: "flex",
  },
  imageContainer: {
    margin: 2,
    padding: 2,
    justifyContent: "flex-start",
  },
  image: {
    borderRadius: 10,
  },
  content: {
    flexDirection: "column",
    margin: 2,
    padding: 2,
    alignItems: "flex-start",
    flexWrap: "wrap",
    flex: 1,
  },
  name: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 20,
    color: styleConstants.color.textBlackColor,
  },
  text: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    textTransform: "capitalize",

    flexWrap: "wrap",
    color: styleConstants.color.textBlackColor,
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 5,
    left: -5,
  },
});

export const createProfileStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  headerContainerStyle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 2,
    gap: 2,
  },
  icon: {
    justifyContent: "space-between",
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    margin: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginVertical: 8,
  },
  textFieldHeader: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    // marginVertical: 12,
  },
  imagesGrid: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  imagesParentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    position: "relative",
    margin: 4,
    width: 90,
    height: 80,
  },
  image: {
    width: 90,
    height: 80,
    borderRadius: 8,
  },

  cardImageContainer: {
    position: "relative",
    margin: 4,
    width: "85%",
    height: "auto",
  },
  cardImage: {
    width: "85%",
    height: "auto",
    borderRadius: 8,
  },
  uploadButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  cameraIcon: {
    alignSelf: "center",
  },
  removeIcon: {
    position: "absolute",
    color: styleConstants.color.textBlackColor,
    backgroundColor: styleConstants.color.textGrayColor,
    right: 5,
  },
  input: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  bioInput: {
    marginBottom: 16,
    height: 100,
    justifyContent: "flex-start",
    flex: 1,
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    borderRadius: 8,
    padding: 10,
  },
  switchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderRadius: 8,

    marginBottom: 16,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
  },
  switchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  habitContainer: {
    marginBottom: 16,
  },
  toggleButton: {
    // borderRadius: 16,
    backgroundColor: styleConstants.color.transparent,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    marginRight: 12,
    width: "auto",
  },
  toggleButtonActive: {
    // backgroundColor: styleConstants.color.primaryColor,
  },
  toggleText: {
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    backgroundColor: styleConstants.color.transparent,
  },
  chipSelected: {
    backgroundColor: styleConstants.color.primaryColor,
  },
  chipText: {
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
    textTransform: "capitalize",
  },
  chipTextSelected: {
    color: styleConstants.color.textWhiteColor,
    fontFamily: styleConstants.fontFamily,
  },
  submitButton: {
    marginVertical: 16,
    backgroundColor: styleConstants.color.primaryColor,
    // height: "6%",
    // alignItems: "center",
    borderRadius: 46,
  },
  submitButtonContent: {
    paddingVertical: 4,
    alignSelf: "center",
  },
  submitButtonText: {
    color: styleConstants.color.textWhiteColor,
    alignSelf: "center",
    fontFamily: styleConstants.fontFamily,
    fontSize: 18,
  },
  // Add these styles to your createProfileStyles
  termsModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  termsModalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    maxHeight: "80%",
    width: "90%",
  },
  termsContent: {
    padding: 20,
  },
  termsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: styleConstants.color.primaryColor,
  },
  termsScrollView: {
    maxHeight: 300,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
    color: styleConstants.color.textColor,
  },
  termsLink: {
    padding: 12,
    backgroundColor: styleConstants.color.lightGray,
    borderRadius: 8,
    marginBottom: 15,
  },
  termsLinkText: {
    color: styleConstants.color.primaryColor,
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  termsNote: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
    color: styleConstants.color.textGrayColor,
  },
  termsButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  termsButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  agreeButton: {
    backgroundColor: styleConstants.color.primaryColor,
  },
  termsLinkText: {
    color: "#333",
    fontSize: 14,
    marginRight: 6,
  },

  readButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  readButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

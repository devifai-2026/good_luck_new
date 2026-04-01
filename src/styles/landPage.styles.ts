import { Dimensions, StyleSheet } from "react-native";
import { styleConstants } from "./constants";

const { width, height: screenHeight } = Dimensions.get("window");
const screenWidth = Dimensions.get("window").width;
export const landPageStyle = StyleSheet.create({
  loadingIndicator: {
    marginTop: "50%",
  },
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.transparent,
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignItems: "center",
  },
  OptionContainer: {
    display: "flex",
    gap: 10,
  },
  homeSellContainer: {
    backgroundColor: styleConstants.color.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the text
    minWidth: "85%",
    position: "relative", // Needed for absolute icon
  },
  landSellContainer: {
    backgroundColor: "#5BAFFD",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the text
    minWidth: "85%", // Ensure consistent width
    position: "relative", // Needed for absolute icon
  },
  adContainer: {
    backgroundColor: "#A4BF00",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the text
    minWidth: "85%", // Ensure consistent width
    position: "relative", // Needed for absolute icon
  },
  iconContainer: {
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    display: "flex",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 50,
    position: "absolute", // Keep icon on the left
    left: 10,
  },
  text: {
    flex: 1, // Take all space
    textAlign: "center", // Center text within flow
    fontSize: 18,
    color: styleConstants.color.textWhiteColor,
    fontFamily: styleConstants.fontFamily,
  },

  icon: {
    height: 30,
    width: 30,
  },
  rightArrowContainer: {
    paddingLeft: 2,
    right: 0,

    position: "absolute",
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
  menuImage: {
    width: screenWidth - 10, // Set a fixed width for each image
    height: 150, // Set a fixed height for each image
    marginHorizontal: 5, // Adds space between the images
    borderRadius: 20,
  },

  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  headerSubContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },

  title: {
    fontSize: 24,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 10,
  },

  LandListContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },

  // .........PropertyCard Styles (non-local-service, full detail view).......

  LandCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    width: width * 0.9,
    alignSelf: "center",
  },

  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: Math.round(screenHeight * 0.22),
    resizeMode: "cover",
  },
  newBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF6F61",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  newText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
  },
  eyeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 6,
    borderRadius: 50,
  },
  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1A1A1A",
    fontFamily: styleConstants.fontFamily,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 13,
    color: "#777",
    marginLeft: 4,
    fontFamily: styleConstants.fontFamily,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    color: "#777",
    marginLeft: 4,
    fontFamily: styleConstants.fontFamily,
  },
  descriptionText: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
    fontFamily: styleConstants.fontFamily,
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.primaryColor,
  },

  // .........Featured Ad Card (isLocalService / home page).......

  featuredCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    width: width - 32,
    alignSelf: "center",
  },
  featuredImageWrapper: {
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: Math.round(screenHeight * 0.22),
    resizeMode: "cover",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  featuredAdBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: styleConstants.color.primaryColor,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredAdBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    fontFamily: styleConstants.fontFamily,
  },
  featuredPriceBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featuredPriceText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
  },
  featuredFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  featuredCallText: {
    color: styleConstants.color.primaryColor,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
    letterSpacing: 0.3,
  },

  //................... Ad Post Page ........................

  container2: {
    flex: 1,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
  },

  headerContainer2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: styleConstants.color.primaryColor,
    paddingVertical: 12,
    borderRadius: 0,
    marginTop: 0,
    width: "100%",
    alignSelf: "center",
    marginBottom: 0,
  },
  actionButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
  },

  headerSubContainer2: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },
});

export const AdvertisementFormStyle = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
    flexGrow: 1, // Ensures it grows to fit the content
    padding: 16, // Optional padding
  },
  sectionHeader: {
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    fontFamily: styleConstants.fontFamily,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: styleConstants.color.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  radioButtonInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: styleConstants.color.primaryColor,
  },
  radioButtonLabel: {
    fontSize: 16,
    color: "black",
    fontFamily: styleConstants.fontFamily,
  },
  imagesGrid: {
    marginBottom: 20,
  },
  imagesParentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: styleConstants.color.textGrayColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: styleConstants.color.textBlackColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    backgroundColor: "white",
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
});

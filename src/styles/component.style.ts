import { Dimensions, StyleSheet, StatusBar, Platform } from "react-native";
import { styleConstants } from "./constants";
import { cloneElement } from "react";

// Get status bar height for proper top padding
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 30;

export const topscrollableMenu = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  menuItem: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 64,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(253, 122, 91, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(253, 122, 91, 0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
  },
  label: {
    color: "#444",
    fontSize: 10,
    textAlign: "center",
    marginTop: 7,
    fontFamily: styleConstants.fontFamily,
    fontWeight: "600",
    lineHeight: 14,
  },
});

export const gridViewStyle = StyleSheet.create({
  gridContainer: { alignItems: "center", justifyContent: "center" },
  itemContainer: {
    // width: itemSize - 15,
    // height: itemSize + 80, // Adjust height to include space for title and prices
    marginBottom: 20, // Add space between rows
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: styleConstants.color.backgroundGrayColor, // Optional: Add background color for visual clarity
    borderRadius: 10,
  },
  image: {
    // width: itemSize - 10, // Slightly smaller to fit nicely within the container
    // height: itemSize - 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
  title: {
    color: styleConstants.color.textBlackColor,
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,

    textAlign: "center",
    marginVertical: 5, // Space between the image and title
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5, // Space between the title and prices
  },
  originalPrice: {
    fontSize: 14,
    color: styleConstants.color.textGrayColor,
    textDecorationLine: "line-through", // Strikethrough effect
    marginRight: 10, // Space between the original price and discounted price
    fontFamily: styleConstants.fontFamily,
  },
  discountedPrice: {
    fontSize: 14,

    color: styleConstants.color.textBlackColor, // You can adjust this color based on your design
    fontFamily: styleConstants.fontFamily,
  },
});

export const homeLayOutStyle = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-start",
  },
  drawerOverlay: {
    flex: 1,
  },
  drawerContainer: {
    width: "75%",
    height: "100%",
    backgroundColor: "#FAFAFA",
    position: "absolute",
    left: 0,
    top: 0,
    borderBottomRightRadius: 28,
    borderTopRightRadius: 28,
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    overflow: "hidden",
  },
  drawerHeader: {
    backgroundColor: styleConstants.color.primaryColor,
    paddingTop: STATUSBAR_HEIGHT + 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  drawerHeaderAvatar: {
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.75)",
    marginBottom: 12,
  },
  drawerUserName: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  drawerRoleBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  drawerRoleText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: styleConstants.fontFamily,
  },
  drawerDivider: {
    backgroundColor: "rgba(0,0,0,0.07)",
    height: 1,
  },
  drawerFooter: {
    alignItems: "center",
    position: "absolute",
    bottom: 24,
    width: "100%",
    paddingHorizontal: 20,
  },
  drawerFooterText: {
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
    fontSize: 13,
    textAlign: "center",
  },
  drawerVersionText: {
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  drawerContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 18,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    elevation: 10,
    shadowColor: styleConstants.color.primaryColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarWrapper: {
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 100,
    padding: 2,
    marginRight: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    fontFamily: styleConstants.fontFamily,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.3,
  },
  welcomeText: {
    fontSize: 17,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  content: {
    flex: 1,
    flexGrow: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: 82,
    position: "relative",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 14,
    minHeight: 58,
  },
  footerButtonActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  footerButton2: {
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 14,
    minHeight: 58,
  },
  iconWrapper: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 2,
  },
  footerButtonText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontFamily: styleConstants.fontFamily,
    textAlign: "center",
    marginTop: 2,
  },
  footerButtonTextActive: {
    color: styleConstants.color.textWhiteColor,
    fontWeight: "600",
  },
  activeTab: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "white",
    marginTop: 4,
  },
  homeIconContainer: {
    position: "absolute",
    top: -30,
    left: "50%",
    transform: [{ translateX: -32 }],
    backgroundColor: styleConstants.color.transparent,
    borderRadius: 50,
    height: 64,
    width: 64,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "50%",
    backgroundColor: "white",
    bottom: 0,
    borderBottomLeftRadius: 400,
    borderBottomRightRadius: 400,
  },
  homeIcon: {
    position: "absolute",
    backgroundColor: styleConstants.color.primaryColor,
    zIndex: 100,
    borderRadius: 50,
    elevation: 10,
    shadowColor: styleConstants.color.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
  },
  homeIconLabel: {
    color: styleConstants.color.backgroundWhiteColor,
    fontSize: 30,
    alignSelf: "center",
  },
});

export const imageUploaderStyles = StyleSheet.create({
  container: {
    flex: 1,

    display: "flex",
    flexDirection: "row",
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
  selectedImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export const lazyLoadingImageStyle = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorText: {
    color: styleConstants.color.textBlackColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: "cover",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
});

export const lodarModalStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
    fontFamily: styleConstants.fontFamily,
  },
});

export const modalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    width: Dimensions.get("window").width * 0.9, // 90% of screen width
    height: Dimensions.get("window").height * 0.75,
    zIndex: 100000,
    alignSelf: "center",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
    textTransform: "capitalize",
  },
});

export const walletModalStyles = StyleSheet.create({
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
});

export const myProfileStyle = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
    marginVertical: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    alignSelf: "center",
    marginLeft: 2,
  },
  container: {
    padding: 1 + 0,
    backgroundColor: styleConstants.color.transparent,
  },
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    height: 430,
    width: 400,
    borderRadius: 20,
  },
  socialButtonsContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    backgroundColor: "white",
    borderRadius: 25,
  },
  divider: {
    marginVertical: 20,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    textTransform: "capitalize",

    color: styleConstants.color.textBlackColor,
    flexWrap: "wrap",
    flexBasis: "auto",
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,

    color: styleConstants.color.textGrayColor,
  },
  bioTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 10,
  },
  bioContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  editIcon: { position: "absolute", zIndex: 100 },
  nameAgeText: {
    fontSize: 22,
    marginTop: 10,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
});

export const scrollableProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "105%", // to avoid white background corners at footer
    opacity: 1,
  },
  imageStyle: {
    resizeMode: "cover",
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    alignSelf: "flex-start",
  },
  filterButton: {
    alignSelf: "flex-end",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  progressLine: {
    height: 4,
    width: 50,
    backgroundColor: styleConstants.color.textGrayColor,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: styleConstants.color.textWhiteColor,
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  userInfo: {
    color: "white",
    fontSize: 32,
    fontFamily: styleConstants.fontFamily,
    alignSelf: "flex-start",
    fontWeight: "600",
  },
  interestContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  interest: {
    marginHorizontal: 8,
    padding: 4,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    width: "33%",
    borderColor: styleConstants.color.textWhiteColor,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    textTransform: "capitalize",
    marginTop: 7,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 35,
  },
  actionButton: {
    marginHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    color: styleConstants.color.textWhiteColor,
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1000000,
  },
});

export const textCardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingBottom: 10,
  },
  logoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: styleConstants.color.backgroundGrayColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  imageIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: styleConstants.fontFamily,
    marginBottom: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 3,
    fontFamily: styleConstants.fontFamily,
  },
  contactText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 3,
    fontFamily: styleConstants.fontFamily,
  },
  newBadge: {
    backgroundColor: "#FF6F61",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  newText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
  },
  description: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
    fontFamily: styleConstants.fontFamily,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: styleConstants.color.backgroundGrayColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    color: styleConstants.color.primaryColor,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
  },
  // legacy — kept for any other usage
  row: { flexDirection: "row", marginBottom: 10 },
  imageContainer: { position: "relative", marginRight: 10 },
  content: { justifyContent: "space-between" },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 4 },
  chip: { backgroundColor: "#e0f7fa", marginRight: 4, marginBottom: 4, borderRadius: 25 },
  chipText: { color: "#00796b", fontWeight: "500", fontFamily: styleConstants.fontFamily },
});

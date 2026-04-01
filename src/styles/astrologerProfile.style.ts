import { StyleSheet } from "react-native";
import { styleConstants } from "./constants";

export const astrologerProfileStyle = StyleSheet.create({
  profile: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: styleConstants.color.backgroundGrayColor,
    padding: 10,
    margin: 10,
    borderRadius: 20,
    minWidth: "90%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 30,
  },
  info: {
    marginLeft: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 6,
  },
  name: {
    fontSize: 22,

    color: styleConstants.color.textGrayColor,
    fontFamily: styleConstants.fontFamily,
  },
  tags: {
    flexDirection: "row",
    marginVertical: 2,
    gap: 1.5,
    // justifyContent: "space-between",
    flexWrap: "wrap",
  },
  tag1: {
    backgroundColor: styleConstants.color.deepGreen,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 16,
    color: styleConstants.color.backgroundWhiteColor,
    fontFamily: styleConstants.fontFamily,
    flexWrap: "wrap",
  },
  tag2: {
    backgroundColor: "#696FD5",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 16,
    color: styleConstants.color.backgroundWhiteColor,
    fontFamily: styleConstants.fontFamily,
    flexWrap: "wrap",
  },
  tag3: {
    backgroundColor: "#D5698B",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 16,
    color: styleConstants.color.backgroundWhiteColor,
    fontFamily: styleConstants.fontFamily,
    flexWrap: "wrap",
  },

  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
  },
  rating: {
    fontSize: 16,
    color: "#FFB800",
    fontFamily: styleConstants.fontFamily,
  },
  orders: {
    fontSize: 16,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 54,
    marginTop: 16,
    marginBottom: 8,
    // borderColor:'red',
    // borderWidth:2
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statNumber: {
    fontSize: 18,

    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  statLabel: {
    fontSize: 18,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  description: {
    fontSize: 16,
    color: styleConstants.color.textBlackColor,
    margin: 16,
    fontFamily: styleConstants.fontFamily,
  },
  readMore: {
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },
  adContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#F6A800",
    padding: 10,
    marginVertical: 10,
    borderRadius: 15,
    alignItems: "center", // Center the "Ad" text horizontally
  },
  adText: {
    fontSize: 18,

    color: styleConstants.color.textWhiteColor,
    fontFamily: styleConstants.fontFamily,
  },
  actions: {
    flexDirection: "row",

    marginVertical: 16,
    gap: 8,
  },
  actionButton: {
    backgroundColor: styleConstants.color.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
});

export const topAstrologerStyle = StyleSheet.create({
  searchContainer: {
    backgroundColor: "#F0F2F7",
    borderWidth: 1,
    borderColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    marginVertical: 8,
    paddingRight: 8,
    marginHorizontal: 15,
  },
  searchInput: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    color: "black",
    fontSize: 16,
    backgroundColor: "#F0F2F7",
    width: "90%",
    fontFamily: styleConstants.fontFamily,
  },
  filterList: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: styleConstants.fontFamily,
  },

  adContainer: {
    width: "100%",
    height: 0.00000001,
    backgroundColor: "#F6A800",
    // padding: 10,
    // marginVertical: 10,
    // borderRadius: 15,
    alignItems: "center", // Center the "Ad" text horizontally
  },
  adText: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "#ffffff",
    fontFamily: styleConstants.fontFamily,
  },
});

export const astrologerCard = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    width: 160, // Adjust the width as needed
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  astrologerImage: {
    width: "100%",
    height: 120, // Adjust height as needed
    resizeMode: "cover",
  },
  infoContainer: {
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  astrologerName: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: "#333",
    marginBottom: 2,
  },
  astrologerDescription: {
    fontSize: 12,
    color: "#666",
    fontFamily: styleConstants.fontFamily,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderColor: "#E0E0E0",
  },
  chatButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  chatText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: styleConstants.fontFamily,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    color: "orange",
    fontSize: 12,
    marginLeft: 2,
    fontFamily: styleConstants.fontFamily,
  },
});

export const astrologerListStyle = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
  },
  astrologerItem: {
    width: 95,
    height: 110,
    alignItems: "center",
    marginHorizontal: 15,
  },
  itemContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  statusBadge: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: styleConstants.color.backgroundGrayColor,
  },
  statusText: {
    color: styleConstants.color.textBlackColor,
    fontSize: 12,
    fontFamily: styleConstants.fontFamily,
  },
  itemText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    paddingTop: 6,
  },
});

export const astrologercardStyles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    // width: '90%', // Still adjusting width relative to screen
    width: "90%",
    minWidth: "90%",
    // height: "40%", // Matches width, making it square
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: "center", // Centers content vertically
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  clientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  clientDetails: {
    flexDirection: "column",
  },
  clientName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    fontFamily: styleConstants.fontFamily,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  star: {
    color: "#FFD700",
    fontSize: 16,
  },
  reviewText: {
    color: "#757575",
    fontSize: 14,
    marginTop: 5,
    fontFamily: styleConstants.fontFamily,
  },
});

export const requestListingStyle = StyleSheet.create({
  messageList: {
    padding: 10,
  },
  messageItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    width: "100%",
  },
  profilePicture: {
    justifyContent: "flex-start",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageDetails: {
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 18,
    color: "#444",
    // fontWeight: "bold",
    justifyContent: "space-between",
    marginBottom: 4,
    fontFamily: styleConstants.fontFamily,
  },
  lastMessage: {
    justifyContent: "space-between",
    fontSize: 16,
    color: "#666",
    // fontWeight: "500",
    fontFamily: styleConstants.fontFamily,
  },
  acceptButton: {
    height: 32,
    width: 98,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 51,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  rejectButton: {
    marginTop: 10,
    height: 32,
    width: 98,
    backgroundColor: styleConstants.color.transparent,
    borderRadius: 51,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rejectText: {
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  acceptText: {
    color: "#fff",
    fontFamily: styleConstants.fontFamily,
  },

  buttinContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingBottom: 10,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  iconOverlay: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

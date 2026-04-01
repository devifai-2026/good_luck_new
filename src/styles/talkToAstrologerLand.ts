import { Dimensions, StyleSheet } from "react-native";
import { styleConstants } from "./constants";

const { width } = Dimensions.get("window");
const screenWidth = Dimensions.get("window").width;
export const talkToAstrologer = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    paddingHorizontal: 2,
    paddingVertical: 20,
    alignItems: "center",
    height: "100%",
  },

  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 15,
  },

  headerContainer2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 15,
  },

  headerSubContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },

  headerSubContainer2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 22,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 10,
    fontWeight: "semibold",
  },
  title2: {
    fontSize: 22,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 10,
    fontWeight: "500",
  },

  ViewAll: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.primaryColor,
  },
});

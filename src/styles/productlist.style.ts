import { StyleSheet } from "react-native";
import { styleConstants } from "./constants";

export const productListstyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.transparent,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 24,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 20,
  },
});

export const subCategoriesstyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.transparent,
    paddingHorizontal: 15,
  },
  topMenuContainer: {
    height: "25%",
  },
  headerContainer: {
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
  newArrivalsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  newArrivals: {
    fontSize: 18,
    fontWeight: "600",
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  showMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  showMoreText: {
    fontSize: 16,
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },
});

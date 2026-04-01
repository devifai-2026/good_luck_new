import { StyleSheet } from "react-native";
import { styleConstants } from "./constants";

export const astrologerHomeScreenStyle = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: styleConstants.color.primaryColor,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: "#FD7A5B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  balanceCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255,255,255,0.85)",
    fontFamily: styleConstants.fontFamily,
    letterSpacing: 0.4,
  },
  refreshIconButton: {
    padding: 4,
  },
  amountText: {
    fontSize: 38,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
    color: "#FFF",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  balanceCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  minWithdrawNote: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontFamily: styleConstants.fontFamily,
  },
  withdrawButton: {
    backgroundColor: "#FFF",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  withdrawText: {
    fontWeight: "600",
    fontSize: 14,
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },

  // Promo Code Card
  promoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: styleConstants.color.primaryColor,
  },
  promoCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  promoTextGroup: {
    gap: 2,
  },
  promoLabel: {
    fontSize: 11,
    color: styleConstants.color.textGrayColor,
    fontFamily: styleConstants.fontFamily,
    letterSpacing: 0.4,
  },
  promoCode: {
    fontSize: 18,
    fontWeight: "700",
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
    letterSpacing: 1.5,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    borderColor: styleConstants.color.primaryColor,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  shareText: {
    fontSize: 13,
    fontWeight: "600",
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  requestTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  requestBadge: {
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  requestBadgeText: {
    color: "#FFF",
    fontSize: 13,
    fontFamily: styleConstants.fontFamily,
    fontWeight: "600",
  },

  // Request List Card
  requestList: {
    marginHorizontal: 16,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: "hidden",
  },

  // Empty State
  emptyContainer: {
    marginHorizontal: 16,
    minHeight: 220,
    backgroundColor: "#FFF",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  // Unverified State
  unverifiedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 32,
  },
  unverifiedIcon: {
    marginBottom: 16,
  },
  unverifiedText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    fontFamily: styleConstants.fontFamily,
    textAlign: "center",
  },
  unverifiedSubText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 28,
    fontFamily: styleConstants.fontFamily,
    textAlign: "center",
    lineHeight: 22,
  },
  verifyButton: {
    backgroundColor: styleConstants.color.primaryColor,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
    shadowColor: styleConstants.color.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    fontWeight: "600",
  },
});

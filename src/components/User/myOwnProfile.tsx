import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { IconButton } from "react-native-paper";
import { RootState } from "../../redux";
import { styleConstants } from "../../styles";
import { dummyImageURL } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../redux/utils";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = width * 0.28;

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.card}>
    <View style={styles.cardIconBox}>
      <IconButton
        icon={icon}
        size={22}
        iconColor={styleConstants.color.primaryColor}
        style={styles.cardIconBtn}
      />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  </View>
);

const MyOwnProfile = () => {
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  const navigation = useNavigation<any>();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: userDetails?.profilePicture || dummyImageURL }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.editBadge}
            onPress={() => navigation.navigate("myprofileedit")}
            activeOpacity={0.8}
          >
            <IconButton
              icon="pencil"
              size={16}
              iconColor={styleConstants.color.backgroundWhiteColor}
              style={styles.editBadgeIcon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.nameText} numberOfLines={1}>
          {userDetails?.fullName || "—"}
        </Text>
        <Text style={styles.phoneSubText}>
          {userDetails?.phoneNumber || "—"}
        </Text>
      </View>

      {/* Divider pill */}
      <View style={styles.pillDivider} />

      {/* Info Cards */}
      <View style={styles.cardsSection}>
        {userDetails?.dateOfBirth && userDetails.dateOfBirth.length > 0 && (
          <InfoCard
            icon="calendar-account"
            label="Date of Birth"
            value={formatDate(userDetails.dateOfBirth)}
          />
        )}
        <InfoCard
          icon="gender-male-female"
          label="Gender"
          value={userDetails?.gender || "—"}
        />
        <InfoCard
          icon="star-circle-outline"
          label="Super Note"
          value={String(userDetails?.supernote ?? 0)}
        />
        {userDetails?.promocode && (
          <InfoCard
            icon="ticket-percent-outline"
            label="Promo Code"
            value={userDetails.promocode}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  /* ── Header ── */
  headerBanner: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  profilePicture: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: styleConstants.color.backgroundWhiteColor,
    backgroundColor: styleConstants.color.deactivatedButtonColor,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: styleConstants.color.backgroundWhiteColor,
    justifyContent: "center",
    alignItems: "center",
  },
  editBadgeIcon: {
    margin: 0,
    padding: 0,
    width: 28,
    height: 28,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginBottom: 6,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  phoneSubText: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
  },

  /* ── Pill divider ── */
  pillDivider: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: styleConstants.color.deactivatedButtonColor,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 8,
  },

  /* ── Cards ── */
  cardsSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(253,122,91,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardIconBtn: {
    margin: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardValue: {
    fontSize: 15,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    fontWeight: "600",
  },
});

export default MyOwnProfile;

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Share,
} from "react-native";
import { useSelector } from "react-redux";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { RootState } from "../../redux";
import { styleConstants } from "../../styles";
import { dummyImageURL } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import NoDataComponent from "../User/noDataComponent";
import AstrologerReviewCard from "../User/astrologerReviewCard";

const { width } = Dimensions.get("window");

const AstrologerMyProfile = () => {
  const astrologerDetails = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerDetails
  );

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId
  );

  const reviews = useSelector((state: RootState) => state.auth.astroloReview);

  const { getRatingReviewById, loading } = useAstrologyServices();
  const navigation = useNavigation<any>();

  const [uploadedImage, setUploadedImage] = useState("");
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    chatPrice: "",
    videoPrice: "",
    callPrice: "",
    yearsOfExperience: "",
    description: "",
    promoCode: "",
  });

  useEffect(() => {
    setUploadedImage(astrologerDetails?.profile_picture ?? "");
    setProfileData({
      fullName: `${astrologerDetails?.Fname ?? ""} ${astrologerDetails?.Lname ?? ""}`.trim(),
      phone: astrologerDetails?.phone ?? "",
      chatPrice: astrologerDetails?.chat_price?.toString() ?? "",
      videoPrice: astrologerDetails?.video_price?.toString() ?? "",
      callPrice: astrologerDetails?.call_price?.toString() ?? "",
      yearsOfExperience: astrologerDetails?.years_of_experience?.toString() ?? "",
      description: astrologerDetails?.description ?? "",
      promoCode: astrologerDetails?.promo_code?.toString() ?? "",
    });
  }, [astrologerDetails]);

  useEffect(() => {
    getRatingReviewById(astrologerId ?? "");
  }, [astrologerId]);

  const handleCopyPromoCode = () => {
    if (profileData.promoCode) {
      Share.share({ message: `My promo code: ${profileData.promoCode}` });
    }
  };

  const averageRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: uploadedImage || dummyImageURL }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
          <View style={styles.editIconWrapper}>
            <IconButton
              iconColor={styleConstants.color.backgroundWhiteColor}
              icon="pencil"
              size={18}
              style={styles.editIcon}
              onPress={() => navigation.navigate("astrologerprofileedit")}
            />
          </View>
        </View>

        <Text style={styles.heroName}>{profileData.fullName || "Astrologer"}</Text>
        <Text style={styles.heroPhone}>{profileData.phone}</Text>

        {averageRating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {averageRating}</Text>
            <Text style={styles.ratingCount}> ({reviews?.length} reviews)</Text>
          </View>
        )}
      </View>

      {/* Promo Code Card */}
      {profileData.promoCode ? (
        <View style={styles.promoCard}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoLabel}>Your Promo Code</Text>
            <Text style={styles.promoCode}>{profileData.promoCode}</Text>
            <Text style={styles.promoSubtext}>Share with users to earn commission</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyPromoCode}>
            <Text style={styles.copyIcon}>⧉</Text>
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
          <View style={styles.promoDashedLeft} />
          <View style={styles.promoDashedRight} />
        </View>
      ) : (
        <View style={styles.promoCardEmpty}>
          <Text style={styles.promoEmptyText}>No promo code assigned yet</Text>
        </View>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profileData.yearsOfExperience || "—"}
          </Text>
          <Text style={styles.statLabel}>Yrs Exp</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{reviews?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {astrologerDetails?.total_number_service_provide ?? 0}
          </Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>

      {/* Pricing Section */}
      <Text style={styles.sectionTitle}>Pricing</Text>
      <View style={styles.pricingRow}>
        {[
          { label: "Chat", value: profileData.chatPrice, icon: "💬" },
          { label: "Call", value: profileData.callPrice, icon: "📞" },
          { label: "Video", value: profileData.videoPrice, icon: "🎥" },
        ].map(({ label, value, icon }) => (
          <View key={label} style={styles.priceCard}>
            <Text style={styles.priceIcon}>{icon}</Text>
            <Text style={styles.priceValue}>
              {value ? `₹${value}` : "—"}
            </Text>
            <Text style={styles.priceLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* About Section */}
      {profileData.description ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>{profileData.description}</Text>
        </View>
      ) : null}

      {/* Reviews Section */}
      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Reviews</Text>
      {loading ? (
        <ActivityIndicator
          color={styleConstants.color.primaryColor}
          size="small"
          style={styles.loader}
        />
      ) : reviews?.length === 0 ? (
        <NoDataComponent message="No reviews yet" />
      ) : (
        reviews?.map((review, index) => (
          <AstrologerReviewCard
            key={index}
            clientImage={review.clientImage}
            clientName={review.clientName}
            reviewText={review.reviewText}
            rating={review.rating}
          />
        ))
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F8FA",
    paddingBottom: 32,
  },

  /* Hero */
  heroSection: {
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  profilePicture: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: width * 0.14,
    borderWidth: 3,
    borderColor: styleConstants.color.backgroundWhiteColor,
    backgroundColor: "#f0e6e6",
  },
  editIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: "#222",
    borderRadius: 20,
    elevation: 4,
  },
  editIcon: {
    margin: 0,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.backgroundWhiteColor,
    marginBottom: 4,
  },
  heroPhone: {
    fontSize: 13,
    fontFamily: styleConstants.fontFamily,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 10,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    color: "#FFE082",
    fontWeight: "700",
    fontSize: 13,
  },
  ratingCount: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
  },

  /* Promo Code */
  promoCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFF8F6",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: styleConstants.color.primaryColor,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2,
  },
  promoDashedLeft: {
    position: "absolute",
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F7F8FA",
    top: "50%",
    marginTop: -12,
  },
  promoDashedRight: {
    position: "absolute",
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F7F8FA",
    top: "50%",
    marginTop: -12,
  },
  promoLeft: {
    flex: 1,
  },
  promoLabel: {
    fontSize: 11,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.primaryColor,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  promoCode: {
    fontSize: 28,
    fontWeight: "800",
    color: styleConstants.color.textBlackColor,
    letterSpacing: 4,
    fontFamily: styleConstants.fontFamily,
    marginBottom: 4,
  },
  promoSubtext: {
    fontSize: 11,
    color: styleConstants.color.textGrayColor,
    fontFamily: styleConstants.fontFamily,
  },
  copyButton: {
    alignItems: "center",
    backgroundColor: styleConstants.color.primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  copyIcon: {
    fontSize: 18,
    color: styleConstants.color.backgroundWhiteColor,
  },
  copyText: {
    fontSize: 11,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.backgroundWhiteColor,
    fontWeight: "600",
  },
  promoCardEmpty: {
    marginHorizontal: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  promoEmptyText: {
    fontSize: 13,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },
  statLabel: {
    fontSize: 11,
    color: styleConstants.color.textGrayColor,
    fontFamily: styleConstants.fontFamily,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 4,
  },

  /* Pricing */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  pricingRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  priceCard: {
    flex: 1,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  priceIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
  },
  priceLabel: {
    fontSize: 11,
    color: styleConstants.color.textGrayColor,
    fontFamily: styleConstants.fontFamily,
    marginTop: 2,
  },

  /* About */
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    lineHeight: 20,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 14,
    padding: 14,
    elevation: 1,
  },

  loader: {
    marginTop: "10%",
    alignSelf: "center",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default AstrologerMyProfile;

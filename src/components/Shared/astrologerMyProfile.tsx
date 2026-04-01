import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
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
  });

  useEffect(() => {
    setUploadedImage(astrologerDetails?.profile_picture ?? "");
    setProfileData({
      fullName: `${astrologerDetails?.Fname} ${astrologerDetails?.Lname}`,
      phone: astrologerDetails?.phone ?? "",
      chatPrice: astrologerDetails?.chat_price?.toString() ?? "",
      videoPrice: astrologerDetails?.video_price?.toString() ?? "",
      callPrice: astrologerDetails?.call_price?.toString() ?? "",
      yearsOfExperience:
        astrologerDetails?.years_of_experience?.toString() ?? "",
      description: astrologerDetails?.description ?? "",
    });
  }, [astrologerDetails]);

  useEffect(() => {
    getRatingReviewById(astrologerId ?? "");
  }, [astrologerId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture with Edit Icon Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: uploadedImage || dummyImageURL }}
          style={styles.profilePicture}
          resizeMode="cover"
        />
        <IconButton
          iconColor={styleConstants.color.backgroundWhiteColor}
          icon="pencil"
          size={24}
          style={styles.editIcon}
          onPress={() => {
            navigation.navigate("astrologerprofileedit");
          }}
        />
      </View>

      {/* Profile Information */}
      {[
        { label: "Full Name", value: profileData.fullName },
        { label: "Phone Number", value: profileData.phone },
        { label: "Years of Experience", value: profileData.yearsOfExperience },
        { label: "Description", value: profileData.description },
      ].map(({ label, value }, index) => (
        <View key={index} style={styles.infoSection}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.text}>{value}</Text>
        </View>
      ))}

      {/* Review Section */}
      <Text style={styles.labelSecond}>Reviews</Text>
      {/* <View style={{ width: "auto" }}> */}
      {loading ? (
        <ActivityIndicator
          color={styleConstants.color.primaryColor}
          size="small"
          style={styles.loader}
        />
      ) : reviews?.length === 0 ? (
        <NoDataComponent message="No review yet" />
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
      {/* </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  profilePicture: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: styleConstants.color.primaryColor,
    elevation: 3,
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.primaryColor,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  labelSecond: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginBottom: 8,
    marginTop: 16,
  },
  loader: {
    marginTop: "20%",
    alignSelf: "center",
  },
});

export default AstrologerMyProfile;

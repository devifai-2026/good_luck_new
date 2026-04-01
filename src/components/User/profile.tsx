import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Linking,
  BackHandler,
  Pressable,
} from "react-native";
import {
  Avatar,
  IconButton,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useMatrimonyandDatingServices from "../../hooks/useMatrimonyDatingService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ProfileType } from "../../services/constants";
import { dummyImageURL } from "../../constants";

import { myProfileStyle as styles } from "../../styles";

const MyProfile = ({ routes }: { routes: any }) => {
  const navigation = useNavigation<any>();
  const type = routes?.params?.type;

  const profileDetails = useSelector(
    (state: RootState) => state.auth.profileDetails
  );

  const { getProfileDetails, isLoading, sendLike } =
    useMatrimonyandDatingServices();

  const currentProfileId = useSelector(
    (state: RootState) => state.auth.currentProfileId
  );
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );
  const openWhatsApp = (phone: string) => {
    Linking.openURL(`whatsapp://send?phone=+91${phone}`);
  };

  const openFacebook = (link: string) => {
    const url = link.startsWith("https://") ? link : `https://${link}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };
  useEffect(() => {
    if (type === "matrimonyprofile") {
      getProfileDetails(ProfileType.matrimony, currentProfileId ?? "");
    } else if (type === "datingprofile") {
      getProfileDetails(ProfileType.dating, currentProfileId ?? "");
    } else if (type === "ownmatrimonyprofile") {
      getProfileDetails(ProfileType.matrimony, userId ?? "");
    } else if (type === "owndatingprofile")
      getProfileDetails(ProfileType.dating, userId ?? "");
  }, [type]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (type === "matrimonyprofile" || type === "ownmatrimonyprofile") {
          navigation.navigate("matrimonydashboard");
        } else if (type === "datingprofile" || type === "owndatingprofile") {
          navigation.navigate("datingdashboard");
        }
        // }  else navigation.navigate("home"); // or navigation.navigate('YourPreviousScreen');
        return true; // Prevent default behavior (exit app)
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  // (profileDetails, "inside profile component");

  return (
    <View style={{ flex: 1 }}>
      {isLoading || !profileDetails?.userName ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size={"large"}
          color={styleConstants.color.primaryColor}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {/* Profile Section */}
          <View style={styles.titleContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 8,
              }}
            >
              <Icon
                name="arrow-back"
                size={24}
                color="black"
                style={{ top: -2, zIndex: 1000000 }}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={styles.title}>
                {type === "ownmatrimonyprofile" || type === "owndatingprofile"
                  ? "Your profile"
                  : profileDetails?.userName ?? "No Name"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 4,
              }}
            >
              {(type === "ownmatrimonyprofile" ||
                type === "owndatingprofile") && (
                <Pressable
                  onPress={() => {
                    if (type === "ownmatrimonyprofile") {
                      navigation.navigate("creatematrimonyprofile", {
                        type: "updatematrimonyprofile",
                      });
                    } else if (type === "owndatingprofile") {
                      navigation.navigate("createdatingprofile", {
                        type: "updatedatingprofile",
                      });
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    name="edit"
                    size={24}
                    color={styleConstants.color.primaryColor}
                    style={{ top: -2, zIndex: 10000000 }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      color: styleConstants.color.primaryColor,
                      paddingBottom: 6,
                      marginLeft: 2,
                    }}
                  >
                    Edit
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.profileSection}>
            {type === "ownmatrimonyprofile" || type === "owndatingprofile" ? (
              <>
                <Avatar.Image
                  size={100}
                  source={{
                    uri: profileDetails?.imageURL[0]
                      ? profileDetails?.imageURL[0]
                      : dummyImageURL,
                  }}
                />
                <Text style={styles.nameAgeText}>
                  {profileDetails?.userName}
                </Text>
              </>
            ) : (
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: profileDetails?.imageURL[0] ?? dummyImageURL,
                  }}
                  loadingIndicatorSource={{
                    uri: profileDetails?.imageURL[0] ?? dummyImageURL,
                  }}
                  style={styles.profileImage}
                />

                {/* WhatsApp and Facebook buttons */}
                <View style={styles.socialButtonsContainer}>
                  {profileDetails?.whatsappNumber && (
                    <IconButton
                      icon="whatsapp"
                      size={30}
                      iconColor="#25D366"
                      style={styles.socialButton}
                      onPress={() =>
                        openWhatsApp(profileDetails?.whatsappNumber)
                      }
                    />
                  )}

                  {profileDetails?.facebookLink && (
                    <IconButton
                      icon="facebook"
                      size={30}
                      iconColor="#3b5998"
                      style={styles.socialButton}
                      onPress={() => openFacebook(profileDetails?.facebookLink)}
                    />
                  )}

                  <IconButton
                    icon="heart"
                    size={30}
                    iconColor={styleConstants.color.primaryColor}
                    style={styles.socialButton}
                    onPress={async () => {
                      await sendLike(type, profileDetails?.userID);
                    }}
                  />
                </View>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <IconButton
                icon="map-marker"
                size={20}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>City:</Text>
                {profileDetails?.city}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <IconButton
                icon="map-marker"
                size={20}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>State:</Text>{" "}
                {profileDetails?.state}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <IconButton icon="calendar" size={20} style={styles.detailIcon} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Age:</Text>{" "}
                {profileDetails?.age}
              </Text>
            </View>

            {(type === "datingprofile" || type === "owndatingprofile") && (
              <>
                <View style={styles.detailItem}>
                  <IconButton
                    icon="school"
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Education:</Text>{" "}
                    {profileDetails?.education}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <IconButton
                    icon="smoking"
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Smoking Habits:</Text>{" "}
                    {profileDetails?.smoking ? "Yes" : "No"}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <IconButton
                    icon="glass-cocktail"
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Alcohol Habits:</Text>{" "}
                    {profileDetails?.drinking ? "Yes" : "No"}
                  </Text>
                </View>
              </>
            )}
            {(type === "matrimonyprofile" ||
              type === "ownmatrimonyprofile") && (
              <>
                <View style={styles.detailItem}>
                  <IconButton
                    icon="gender-male-female"
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Gender:</Text>{" "}
                    {profileDetails?.gender}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <IconButton
                    icon="group"
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Religion :</Text>{" "}
                    {profileDetails?.caste}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <IconButton
                    icon="heart-broken"
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Is Divorcee :</Text>{" "}
                    {profileDetails?.isDivorcee ? "Yes" : "No"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <IconButton
                    icon="wallet"
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Salary:</Text>
                    {" ₹"}
                    {parseInt(profileDetails?.salary)}
                  </Text>
                </View>
              </>
            )}
            {type === "datingprofile" && (
              <View style={styles.detailItem}>
                <IconButton icon="heart" size={20} style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Orientation:</Text> Straight
                </Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <IconButton icon="star" size={20} style={styles.detailIcon} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Interests:</Text>{" "}
                {profileDetails?.interests?.map((item: string, index: number) =>
                  index === 0 ? item : `, ${item}`
                )}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <IconButton
                icon="account-search"
                size={20}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Looking For:</Text>{" "}
                {profileDetails?.lookingFor}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Bio Section */}
          <Text style={styles.bioTitle}>Bio</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{profileDetails?.bio}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyProfile;

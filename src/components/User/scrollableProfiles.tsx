import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { styleConstants } from "../../styles/constants";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateActiveId } from "../../redux/silces/auth.silce";
import { ProfileType } from "../../services/constants";
import { dummyImageURL } from "../../constants";
import CloudImage from "../Shared/lazyLoadingImage";

import { scrollableProfileStyles as styles } from "../../styles";

const DatingDashBoardScroll = (props: {
  userName: string;
  userID: string;
  userAge: number;
  userLocation: string;
  imageURL: string[];
  interests: string[];
  gender: string;
  handleRightSwipe: any;
  handleLeftSwipe: any;
  handleLikeClick: any;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();

  const {
    userName,
    userAge,
    userLocation,
    imageURL,
    interests,
    gender,
    userID,
    handleLeftSwipe,
    handleRightSwipe,
    handleLikeClick,
  } = props;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageURL?.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [currentImageIndex, userID]);
  const route = useRoute<any>();
  const routeParams = route.params;
  let progressBarWidth = new Animated.Value(0);

  const handleClick = () => {
    // Go to next image if available, else go to first
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageURL?.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    Animated.timing(progressBarWidth, {
      toValue: 50,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  }, [currentImageIndex, userID]);

  useEffect(() => {
    // ("moving to next user");
    progressBarWidth = new Animated.Value(0);
  }, [userID]);

  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {Array.isArray(imageURL) ? (
        <Pressable style={styles.container} onPress={handleClick}>
          {/* Handle tap event */}
          <View style={styles.container}>
            <CloudImage
              imageUrl={imageURL[currentImageIndex] ?? dummyImageURL}
              imageStyle={styles.imageStyle}
              containerStyle={styles.container}
              loaderSize="large"
              type="BACKGROUND"
              imageContainerStyle={styles.backgroundImage}
            >
              <View style={styles.overlay}>
                <View style={styles.topContainer}>
                  <TouchableOpacity style={styles.backButton}>
                    <Icon
                      name="arrow-left"
                      size={30}
                      color="white"
                      onPress={() => {
                        navigation.goBack();
                      }}
                    />
                  </TouchableOpacity>

                  <View style={styles.progressContainer}>
                    {imageURL.map((_, index) => (
                      <View key={index} style={styles.progressLine}>
                        <Animated.View
                          style={[
                            styles.progressFill,
                            index === currentImageIndex
                              ? { width: progressBarWidth }
                              : {},
                          ]}
                        />
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.filterButton}>
                    {/* <Icon name="filter" size={30} color="white" /> */}
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomContainer}>
                  <Text style={styles.userInfo}>
                    {userName}, {userAge}
                  </Text>
                  <View style={styles.interestContainer}>
                    {interests &&
                      interests?.map((item: any) => (
                        <Text key={item} style={styles.interest}>
                          {item}
                        </Text>
                      ))}
                  </View>
                  <View style={styles.buttonContainer}>
                    <IconButton
                      icon="close-circle-outline"
                      iconColor={styleConstants.color.textWhiteColor}
                      mode="contained"
                      style={styles.actionButton}
                      size={50}
                      onPress={() => {
                        handleLeftSwipe();
                      }}
                    />
                    <IconButton
                      iconColor={styleConstants.color.textWhiteColor}
                      icon="heart-outline"
                      mode="contained"
                      style={styles.actionButton}
                      size={45}
                      onPress={async () => {
                        await handleLikeClick();
                      }}
                    />
                    <IconButton
                      icon="arrow-up"
                      iconColor={styleConstants.color.textWhiteColor}
                      mode="contained"
                      style={styles.actionButton}
                      size={45}
                      onPress={() => {
                        dispatch(updateActiveId({ id: userID }));
                        // (userID, "userid");
                        // navigation.navigate("matrimonyprofile");
                        if (
                          routeParams?.type &&
                          routeParams?.type === ProfileType.matrimony
                        )
                          navigation.navigate("matrimonyprofile");
                        else navigation.navigate("datingprofile");
                      }}
                    />
                  </View>
                </View>
              </View>
            </CloudImage>
          </View>

          {/* <ImageBackground
            source={{
              uri: imageURL[currentImageIndex] ?? dummyImageURL,
            }} // Use current image based on index
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
            loadingIndicatorSource={{
              uri: imageURL[currentImageIndex] ?? dummyImageURL,
            }}
            onLoadStart={() => {}}
            onLoadEnd={() => {}}
          >
            <View style={styles.overlay}>
              <View style={styles.topContainer}>
                <TouchableOpacity style={styles.backButton}>
                  <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                  {imageURL.map((_, index) => (
                    <View key={index} style={styles.progressLine}>
                      <Animated.View
                        style={[
                          styles.progressFill,
                          index === currentImageIndex
                            ? { width: progressBarWidth }
                            : {},
                        ]}
                      />
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.filterButton}>
                  <Icon name="filter" size={30} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.bottomContainer}>
                <Text style={styles.userInfo}>
                  {userName}, {userAge}
                </Text>
                <View style={styles.interestContainer}>
                  {interests &&
                    interests?.map((item: any) => (
                      <Text key={item} style={styles.interest}>
                        {item}
                      </Text>
                    ))}
                </View>
                <View style={styles.buttonContainer}>
                  <IconButton
                    icon="close-circle-outline"
                    iconColor={styleConstants.color.textWhiteColor}
                    mode="contained"
                    style={styles.actionButton}
                    size={50}
                    onPress={() => {
                      handleLeftSwipe();
                    }}
                  />
                  <IconButton
                    iconColor={styleConstants.color.textWhiteColor}
                    icon="heart-outline"
                    mode="contained"
                    style={styles.actionButton}
                    size={45}
                    onPress={async () => {
                      await handleLikeClick();
                    }}
                  />
                  <IconButton
                    icon="arrow-up"
                    iconColor={styleConstants.color.textWhiteColor}
                    mode="contained"
                    style={styles.actionButton}
                    size={45}
                    onPress={() => {
                      dispatch(updateActiveId({ id: userID }));
                      // (userID, "userid");
                      navigation.navigate("matrimonyprofile");
                      if (
                        routeParams?.type &&
                        routeParams?.type === ProfileType.matrimony
                      )
                        navigation.navigate("matrimonyprofile");
                      else navigation.navigate("datingprofile");
                    }}
                  />
                </View>
              </View>
            </View>
          </ImageBackground> */}
        </Pressable>
      ) : (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size={"large"}
          color={styleConstants.color.primaryColor}
        />
      )}
    </View>
  );
};

export default DatingDashBoardScroll;

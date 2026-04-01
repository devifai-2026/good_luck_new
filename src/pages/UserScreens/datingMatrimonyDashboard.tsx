import { BackHandler, View } from "react-native";
import React, { useEffect, useState } from "react";
import DatingScreenLayout from "../../components/Layouts/datingLayOut";
import DatingDashBoardScroll from "../../components/User/scrollableProfiles";
import SwipeGesture from "react-native-swipe-gestures";
import useMatrimonyandDatingServices from "../../hooks/useMatrimonyDatingService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ActivityIndicator } from "react-native";
import { styleConstants } from "../../styles/constants";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ProfileType } from "../../services/constants";
import { PROFILE_LIMIT } from "../../constants";
import {
  updateDatingProfileSeenCount,
  updateMatrimonyProfileSeenCount,
} from "../../redux/silces/auth.silce";
import NoDataComponent from "../../components/User/noDataComponent";
import { notifyMessage } from "../../hooks/useDivineShopServices";

const DatingMatrimonyDashBoard = ({ route }: { route: any }) => {
  const datingSubscribed = useSelector(
    (state: RootState) => state.auth.userDetails?.isDatingSubscribed
  );

  const matrimonySubscribed = useSelector(
    (state: RootState) => state.auth.userDetails?.isMatrimonySubscribed
  );

  const matrimonyseenCount = useSelector(
    (state: RootState) => state.auth?.matrimonyProfileSeenCount ?? 0
  );

  const datingseenCount = useSelector(
    (state: RootState) => state.auth?.datingProfileSeenCount ?? 0
  );

  const userID = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewableProfile, setViewableProfile] = useState<any[]>([]);
  // (route?.params?.type, "getting route");
  const type = route?.params?.type;

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {
    getProfile,
    allProfiles,
    sendLike,
    getProfileDetails,
    profileDetails,
    isLoading,
  } = useMatrimonyandDatingServices();

  const handleSwipeLeft = async () => {
    //currentIndex, "current index");
    if (currentIndex === viewableProfile.length - 1) {
      notifyMessage("No more profiles to view");
      return;
    }

    const isAtLimit = currentIndex === PROFILE_LIMIT - 1;
    const isMatrimonyType = type === ProfileType.matrimony;
    const isDatingType = type === ProfileType.dating;

    if (isAtLimit) {
      if (
        isMatrimonyType &&
        matrimonyseenCount === PROFILE_LIMIT &&
        !matrimonySubscribed
      ) {
        //"Reached matrimony profile limit");
        dispatch(updateMatrimonyProfileSeenCount(PROFILE_LIMIT));
        navigation.navigate("matrimonyplans");
        return;
      }

      if (
        isDatingType &&
        datingseenCount === PROFILE_LIMIT &&
        !datingSubscribed
      ) {
        //"Reached dating profile limit");
        dispatch(updateDatingProfileSeenCount(PROFILE_LIMIT));
        navigation.navigate("datingplans");
        return;
      }
    }

    if (currentIndex < viewableProfile.length - 1) {
      setCurrentIndex(currentIndex + 1);

      if (isDatingType && datingseenCount < PROFILE_LIMIT) {
        dispatch(updateDatingProfileSeenCount(datingseenCount + 1));
        //datingseenCount, "dating profile");
      } else if (isMatrimonyType && matrimonyseenCount < PROFILE_LIMIT) {
        dispatch(updateMatrimonyProfileSeenCount(matrimonyseenCount + 1));
        //datingseenCount, "matrimony profile");
      }
    }
  };

  const handleSwipeRight = () => {
    // ("right swipe");
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const swipeConfig = {
    velocityThreshold: 0.4, // Adjusted for faster swipes
    directionalOffsetThreshold: 100, // Allows slight deviation while swiping
    gestureIsClickThreshold: 10, // Tolerates slight movements as a click
  };
  useEffect(() => {
    console.log(
      profileDetails,
      type,
      datingSubscribed,
      matrimonySubscribed,
      "looking for data"
    );
    // if (profileDetails?.lookingFor)
    {
      if (type === ProfileType.matrimony) {
        if (matrimonySubscribed) getProfile(ProfileType.matrimony, "all");
        else {
          console.log("here is control in matrimony");
          getProfile(ProfileType.matrimony, "randomFive");
        }
      } else if (type === ProfileType.dating) {
        if (datingSubscribed) getProfile(ProfileType.dating, "all");
        else {
          console.log("here is control in dating");
          getProfile(ProfileType.dating, "randomFive");
        }
      }
    }
  }, [type, datingSubscribed, matrimonySubscribed, profileDetails]);
  useEffect(() => {
    console.log(allProfiles, allProfiles?.length, "all profiles");
    if (
      (type === ProfileType.matrimony || type === ProfileType.dating) &&
      allProfiles.length > 0
    ) {
      setViewableProfile(allProfiles);
      // (allProfiles, "getting profiles");
    }
  }, [allProfiles]);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("home"); // or navigation.navigate('YourPreviousScreen');
        return true; // Prevent default behavior (exit app)
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  useEffect(() => {
    console.log(matrimonyseenCount, PROFILE_LIMIT, "seen count");
    if (
      type === ProfileType.dating &&
      datingseenCount >= PROFILE_LIMIT &&
      !datingSubscribed
    ) {
      navigation.navigate("datingplans");
    } else if (
      type === ProfileType.matrimony &&
      !matrimonySubscribed &&
      matrimonyseenCount >= PROFILE_LIMIT
    ) {
      navigation.navigate("matrimonyplans");
    } else {
      getProfileDetails(type, userID ?? "");
    }
  }, [userID, matrimonyseenCount, datingseenCount]);

  return (
    <View style={{ height: "100%" }}>
      <DatingScreenLayout showHeader>
        {isLoading ? (
          <ActivityIndicator
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            size={"large"}
            color={styleConstants.color.primaryColor}
          />
        ) : allProfiles?.length > 0 ? (
          <SwipeGesture
            config={swipeConfig}
            style={{ flex: 1, width: "100%", height: "100%" }}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          >
            {viewableProfile.length > 0 && (
              <DatingDashBoardScroll
                userID={viewableProfile[currentIndex]?.userID}
                userName={viewableProfile[currentIndex]?.userName}
                userAge={viewableProfile[currentIndex]?.userAge}
                userLocation={viewableProfile[currentIndex]?.userLocation}
                imageURL={viewableProfile[currentIndex]?.imageURL}
                interests={viewableProfile[currentIndex]?.interests}
                gender={viewableProfile[currentIndex]?.gender}
                handleLeftSwipe={handleSwipeLeft}
                handleRightSwipe={handleSwipeRight}
                handleLikeClick={async () => {
                  await sendLike(
                    type,
                    viewableProfile[currentIndex]?.userID,
                    setCurrentIndex,
                    currentIndex
                  );
                }}
              />
            )}
          </SwipeGesture>
        ) : (
          <NoDataComponent message="No profile found" />
        )}
      </DatingScreenLayout>
    </View>
  );
};

export default DatingMatrimonyDashBoard;

import React, { useState } from "react";
import {
  createDatingProfile,
  createMatrimonyProfile,
  getAllDatingRecivedLikes,
  getAllDatingSendLikes,
  getAllMatrimonySendLikes,
  getAllPlans,
  getDatingProfileDetails,
  getDatingProfiles,
  getMatrimonyProfileDetails,
  getMatrimonyProfiles,
  sendDatingLikeByProfileId,
  sendMatrimonyLikeByProfileId,
  subscribeForDating,
  subsCribeForMatrimony,
  updateDatingProfile,
  updateMatrimonyProfile,
} from "../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux";
import { notifyMessage } from "./useDivineShopServices";
import { useNavigation } from "@react-navigation/native";
import {
  updateCurrentAdDetails,
  updateCurrentProfileDetails,
  updateUserData,
} from "../redux/silces/auth.silce";
import { ProfileType } from "../services/constants";
import useMatchMessageService from "./useMatchMessageService";

export enum MatchType {
  received,
  sent,
}

const useMatrimonyandDatingServices = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );
  const matrimonyId = useSelector(
    (state: RootState) => state.auth.userDetails?.matrimonyID
  );

  const datingId = useSelector(
    (state: RootState) => state.auth.userDetails?.datingID
  );

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [allSentLikes, setAllSentLikes] = useState<any[]>([]);
  const [allRecievedLikes, setAllRecievedLikes] = useState<any[]>([]);
  const [filteredProfile, setfilteredProfile] = useState<any[]>([]);
  const [filteredTopFiveProfile, setfilteredTopFiveProfile] = useState<any[]>(
    []
  );
  const [profileDetails, setprofileDetails] = useState<any>();

  const [plans, setplans] = useState<any[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const { createChatRoom } = useMatchMessageService();

  const createOwnProfile = async (profileType: ProfileType, payload: any) => {
    try {
      setIsLoading(true); // Start loading
      // (payload, userId);
      const response =
        profileType === ProfileType.matrimony
          ? await createMatrimonyProfile(payload, userId ?? "")
          : await createDatingProfile(payload, userId ?? "");
      // (response?.data?.data);
      if (profileType === ProfileType.matrimony) {
        dispatch(updateUserData({ matrimonyID: userId }));

        notifyMessage(response?.data?.message);
        navigation.navigate("matrimonydashboard");
      } else if (profileType === ProfileType.dating) {
        dispatch(updateUserData({ datingID: userId }));

        notifyMessage(response?.data?.message);
        navigation.navigate("datingdashboard");
      }
    } catch (error) {
      console.error(error);
      notifyMessage("Couldn't create profile");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const getProfile = async (
    profileType: ProfileType,
    type: "all" | "randomFive"
  ) => {
    try {
      setIsLoading(true); // Start loading
      let response;
      response =
        profileType === ProfileType.matrimony
          ? await getMatrimonyProfiles(matrimonyId ?? "")
          : await getDatingProfiles(datingId ?? "");
      const data = response?.data?.data as Array<any>;
      console.log(data, "api response dating matrimony");

      const formattedData = [];
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        // ();

        if (profileType === ProfileType.matrimony) {
          // if (item?.searching_for && item?.searching_for !== lookingFor)
          {
            const tempFormattedData = formatProfileDataForList(item);
            formattedData.push(tempFormattedData);
          }
        } else {
          // (item?.looking_for, lookingFor, "getting match status");
          // if (item?.looking_for && item?.looking_for !== lookingFor)
          {
            const tempFormattedData = formatProfileDataForList(item);
            formattedData.push(tempFormattedData);
          }
        }
      }
      if (type === "all") {
        setAllProfiles(formattedData);
      } else if (type === "randomFive") {
        const randomData = formattedData?.slice(
          0,
          Math.min(5, formattedData.length)
        );
        setAllProfiles(formattedData);
        //randomData, "data");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const getProfileDetails = async (
    profileType: ProfileType,
    profileId: string
  ) => {
    try {
      setIsLoading(true); // Start loading

      const response =
        profileType === ProfileType.matrimony
          ? await getMatrimonyProfileDetails(profileId)
          : await getDatingProfileDetails(profileId);

      dispatch(
        updateCurrentProfileDetails(
          formatProfileDataForList(response?.data?.data)
        )
      );
      // setprofileDetails(formatProfileDataForList(response?.data?.data));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // End loading  6706f1e5150d4d61cc1b3229
    }
  };

  const getDatingMatrimonyPlans = async (profileType: ProfileType) => {
    try {
      setIsLoading(true); // Start loading
      const response = await getAllPlans(profileType);
      //response?.data?.data);

      const oneMonthPrice = response.data?.data?.one_month_plan;
      const oneYearPrice = response.data?.data?.one_year_plan;

      const subscriptionOptions = [
        {
          name: "1 Month",
          price: `₹${oneMonthPrice}`,
          duration: "1 Month",
          features: ["Full access", "Priority support", "Exclusive content"],
          amount: 99,
          key: "one_month_plan",
        },
        {
          name: "12 months",
          price: `₹${oneYearPrice}`,
          duration: "12 Months",
          features: ["Full access", "Priority support", "Exclusive content"],
          amount: 999,
          key: "one_year_plan",
        },
      ];
      setplans(subscriptionOptions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const subscribeForPremium = async (
    profileType: ProfileType,
    payload: any
  ) => {
    try {
      setIsLoading(true); // Start loading
      // // (payload, "getting payload");
      // (userId, "getting user id");
      const response =
        profileType === ProfileType.matrimony
          ? await subsCribeForMatrimony(payload)
          : await subscribeForDating(payload);

      setprofileDetails(formatProfileDataForList(response?.data?.data));

      if (profileType === ProfileType.matrimony) {
        {
          dispatch(updateUserData({ isMatrimonySubscribed: true }));

          notifyMessage("Matrimony profile upgraded successfully");
          navigation.navigate("matrimonydashboard");
          return;
        }
      } else {
        {
          dispatch(updateUserData({ isDatingSubscribed: true }));
          notifyMessage("Dating profile upgraded successfully");
          navigation.navigate("datingdashboard");
          return;
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      notifyMessage("Couldn't update user details");
    }
  };

  const updateProfileDetails = async (
    profileType: ProfileType,
    payload: any,
    updateType?: boolean
  ) => {
    try {
      setIsLoading(true); // Start loading
      // // (payload, "getting payload");
      // (userId, "getting user id");
      const response =
        profileType === ProfileType.matrimony
          ? await updateMatrimonyProfile(payload, matrimonyId ?? "")
          : await updateDatingProfile(payload, datingId ?? "");

      // setprofileDetails(formatProfileDataForList(response?.data?.data));

      dispatch(
        updateCurrentProfileDetails(
          formatProfileDataForList(response?.data?.data)
        )
      );

      if (profileType === ProfileType.matrimony) {
        if (updateType) {
          dispatch(updateUserData({ isMatrimonySubscribed: true }));
          navigation.navigate("matrimonydashboard");
          notifyMessage("Matrimony profile upgraded successfully");
          return;
        } else {
          navigation.navigate("mymatrimonyprofile");
          notifyMessage("Matrimony Profile updated successfully");
        }
      } else {
        if (updateType) {
          dispatch(updateUserData({ isDatingSubscribed: true }));
          notifyMessage("Dating profile upgraded successfully");
          navigation.navigate("datingdashboard");
          return;
        } else {
          navigation.navigate("mydatingprofile"),
            notifyMessage("Dating Profile updated successfully");
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      notifyMessage("Couldn't update user details");
    }
  };
  const sendLike = async (
    profileType: ProfileType | "datingprofile",
    sendId: string,
    setCurrentIndex?: any,
    index?: number
  ) => {
    try {
      if (
        profileType === ProfileType.dating ||
        profileType === "datingprofile"
      ) {
        const response = await sendDatingLikeByProfileId(userId ?? "", sendId);

        if (response?.data?.data?.match) {
          notifyMessage("You matched with this profile");
          try {
            await createChatRoom(sendId);
            return;
          } catch (error) {
            console.error(error);
          }
        }
      } else if (profileType === ProfileType.matrimony) {
        const response = await sendMatrimonyLikeByProfileId(
          userId ?? "",
          sendId
        );
        // (response?.data, "getting data for matrimony like");
      }
      if (index) setCurrentIndex(index++);

      notifyMessage("You liked this profile");
    } catch (error: any) {
      notifyMessage("You already liked this profile");
    }
  };

  const getMatchedProfile = async (type: ProfileType) => {
    try {
      setIsLoading(true);

      let recievedResponse = null;
      let sentResponse = null;
      if (type === ProfileType.dating) {
        recievedResponse = await getAllDatingRecivedLikes(userId ?? "");
        sentResponse = await getAllDatingSendLikes(userId ?? "");
      } else {
        recievedResponse = await getAllDatingRecivedLikes(userId ?? "");
        sentResponse = await getAllMatrimonySendLikes(userId ?? "");
      }
      const formattedRecievedProfileData = recievedResponse?.data?.data?.map(
        (item: any) => formatProfileDataForList(item)
      );

      const formattedSentProfileData = sentResponse.data?.data?.map(
        (item: any) => formatProfileDataForList(item)
      );

      setAllRecievedLikes(formattedRecievedProfileData);
      setAllSentLikes(formattedSentProfileData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const formatProfileDataForList = (profileData: any) => {
    return {
      userID: profileData.userId ?? profileData?._id,
      userName: `${profileData.Fname ?? "-"} ${profileData.Lname ?? "-"}`,
      userAddress: `${profileData.city}, ${profileData.state}`,
      userAge: profileData?.age,
      imageURL: profileData?.photo ?? profileData?.photos,
      interests: Array.isArray(profileData?.interests)
        ? profileData?.interests
        : [profileData?.interests],
      gender: profileData?.gender,
      bio: profileData?.bio,
      caste: profileData?.cast,
      salary: profileData?.salary,
      city: profileData?.city,
      state: profileData?.state,
      lookingFor: profileData?.searching_for ?? profileData?.looking_for,
      isDivorcee: profileData?.isDivorce,
      age: profileData?.age,
      whatsappNumber: profileData?.whatsappNumber,
      facebookLink: profileData?.facebookLink,
      smoking: profileData?.smoker,
      drinking: profileData?.alcoholic,
      education: profileData?.education,
    };
  };

  const handleButtonCLick = async (
    route: any,
    userDetails: any,
    uploadedImages: string[],
    bio: string,
    isDivorcee: string,
    selectedGender: string[],
    selectedInterests: string[],
    smoking: string,
    drinking: string
  ) => {
    // Helper function for validation
    // // (route.params.type, "getting type");
    // const isValidPhoneNumber = (phone: string) => phone?.length === 10;
    const isValidPin = (pin: string) => pin?.length === 6;
    const isValidAge = (age: number) => age >= 18;
    const isValidName = (name: string) =>
      name?.trim()?.split(" ").length >= 2 &&
      name.trim().split(" ")[0]?.length > 0 &&
      name.trim().split(" ")[1]?.length > 0;

    // Common fields validation
    if (!isValidName(userDetails?.name)) {
      notifyMessage("Please provide both first and last names.");
      return;
    }

    if (!isValidAge(parseInt(userDetails?.age ?? "0"))) {
      notifyMessage("Age must be 18 or above.");
      return;
    }

    if (!bio || bio.trim().length === 0) {
      notifyMessage("Bio cannot be empty.");
      return;
    }

    // Matrimony Profile Creation
    if (route.params.type === ProfileType.matrimony) {
      const payload = {
        Fname: userDetails?.name?.trim()?.split(" ")[0],
        Lname: userDetails?.name?.trim()?.split(" ")[1] ?? "",
        photo: uploadedImages,
        city: userDetails?.city,
        state: userDetails?.state,
        salary: userDetails?.salary,
        age: parseInt(userDetails?.age ?? ""),
        education: userDetails?.education,
        subscribed: false,
        subs_plan_name: "Basic plan",
        subs_start_date: new Date().toISOString(),
        bio,
        isDivorce: isDivorcee === "Yes",
        pending_likes_id: "64e4b3a1f5e45b8d9b2c5f7d",
        sent_likes_id: "64e4b3aaf5e45b8d9b2c5f7e",
        cast: userDetails?.caste,
        searching_for: selectedGender[0]?.toLowerCase(),
        gender:
          selectedGender[0]?.toLowerCase() === "bride" ? "Male" : "Female",
        interests: selectedInterests, //[0]?.toLowerCase(),
        pin: userDetails?.pin,
        whatsappNumber: userDetails?.whatsappno,
        facebookLink: userDetails?.fblink,
      };

      await createOwnProfile(ProfileType.matrimony, payload);
      return;
    }
    // Dating Profile Creation
    else if (route.params.type === ProfileType.dating) {
      const payload = {
        Fname: userDetails?.name?.trim()?.split(" ")[0],
        Lname: userDetails?.name?.trim()?.split(" ")[1] ?? "",
        photos: uploadedImages,
        city: userDetails?.city,
        state: userDetails?.state,
        age: parseInt(userDetails?.age ?? "0"),
        education: userDetails?.education,
        subscribed: false,
        subs_plan_name: "Basic plan",
        subs_start_date: new Date().toISOString(),
        bio,
        smoker: smoking === "Yes",
        alcoholic: drinking === "Yes",
        pending_likes_id: "64e4b3a1f5e45b8d9b2c5f7d",
        sent_likes_id: "64e4b3aaf5e45b8d9b2c5f7e",
        looking_for:
          selectedGender[0]?.toLowerCase() === "men"
            ? "male"
            : selectedGender[0]?.toLowerCase() === "women"
            ? "female"
            : "both",
        orientation:
          selectedGender[0]?.toLowerCase() === "both" ? "straight" : "straight",
        interests: selectedInterests, //[0]?.toLowerCase(),
      };

      createOwnProfile(ProfileType.dating, payload);
    }
    // Update Matrimony Profile
    else if (route.params.type === "updatematrimonyprofile") {
      const payload = {
        Fname: userDetails?.name?.trim()?.split(" ")[0],
        Lname: userDetails?.name?.trim()?.split(" ")[1] ?? "",
        education: userDetails?.education,
        photo: uploadedImages,
        city: userDetails?.city,
        state: userDetails?.state,
        salary: userDetails?.salary,
        age: parseInt(userDetails?.age ?? ""),
        subscribed: false,
        subs_plan_name: "Basic plan",
        subs_start_date: new Date().toISOString(),
        bio,
        isDivorce: isDivorcee === "Yes",
        pending_likes_id: "64e4b3a1f5e45b8d9b2c5f7d",
        sent_likes_id: "64e4b3aaf5e45b8d9b2c5f7e",
        cast: userDetails?.caste,
        searching_for: selectedGender[0]?.toLowerCase(),
        gender:
          selectedGender[0]?.toLowerCase() === "bride" ? "Male" : "Female",
        interests: selectedInterests, //[0]?.toLowerCase(),
        whatsappNumber: userDetails?.whatsappno,
        facebookLink: userDetails?.fblink,
      };
      // // (payload);

      await updateProfileDetails(ProfileType.matrimony, payload);
      return;
    }
    // Update Dating Profile
    else if (route.params.type === "updatedatingprofile") {
      const payload = {
        Fname: userDetails?.name?.trim()?.split(" ")[0],
        Lname: userDetails?.name?.trim()?.split(" ")[1] ?? "",
        education: userDetails?.education,
        photos: uploadedImages,
        city: userDetails?.city,
        state: userDetails?.state,
        salary: userDetails?.salary,
        age: parseInt(userDetails?.age ?? "18"),
        subscribed: false,
        subs_plan_name: "Basic plan",
        subs_start_date: new Date().toISOString(),
        bio,
        smoker: smoking === "Yes",
        alcoholic: drinking === "Yes",
        pending_likes_id: "64e4b3a1f5e45b8d9b2c5f7d",
        sent_likes_id: "64e4b3aaf5e45b8d9b2c5f7e",
        cast: userDetails?.caste,
        looking_for:
          selectedGender[0]?.toLowerCase() === "men"
            ? "male"
            : selectedGender[0]?.toLowerCase() === "women"
            ? "female"
            : "both",

        interests: selectedInterests, //[0]?.toLowerCase(),
      };
      // (payload, "before sending");

      await updateProfileDetails(ProfileType.dating, payload);

      return;
    }
    // Default case: Navigate to plans page
  };

  const handleChipToggle = (
    chip: string,
    selectedChips: string[],
    setChips: (chips: string[]) => void,
    route: any,
    selectionType?: "single" | "multiple"
  ) => {
    // (chip);
    if (selectionType && selectionType === "single") {
      // ("here again");
      setChips([chip]);
      return;
    }

    setChips(
      selectedChips?.includes(chip)
        ? selectedChips?.filter((item) => item !== chip)
        : [...selectedChips, chip]
    );
  };

  return {
    createOwnProfile,
    getProfile,
    allProfiles,
    setAllProfiles,
    filteredProfile,
    setfilteredProfile,
    filteredTopFiveProfile,
    setfilteredTopFiveProfile,
    getProfileDetails,
    profileDetails,
    setprofileDetails,
    updateProfileDetails,
    isLoading,
    handleButtonCLick,
    handleChipToggle,
    sendLike,
    getMatchedProfile,
    allRecievedLikes,
    allSentLikes,
    subscribeForPremium,
    getDatingMatrimonyPlans,
    plans,
    // getMatchedProfileRecived,
    // Return the loading state
  };
};

export default useMatrimonyandDatingServices;

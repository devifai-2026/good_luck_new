import { PermissionsAndroid, Platform } from "react-native";
import { indianStatesAndCities } from "../services/constants";
import { UserRoleEnum } from "./redux.constants";

export const getCityListByState = (state: string) => {
  // (state);
  for (let i = 0; i < indianStatesAndCities.length; i++) {
    if (indianStatesAndCities[i].state === state)
      return indianStatesAndCities[i].cities;
  }

  return [];
};

export const requestCameraPermission = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "We need access to your camera to upload photos.",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const formatDate = (date: string | null): string => {
  if (!date || date?.length === 0) return ""; // If no date selected, return an empty string
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options); // Format date
};

export const formatTime = (isoString: string | null): string => {
  if (!isoString || isoString?.length === 0) return "";
  const date = new Date(isoString);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const getSpecalizationNameById = (
  id: string | any,
  specializations: any[]
) => {
  console.log(specializations, id);
  for (let i = 0; i < specializations.length; i++) {
    if (specializations[i]._id === id || specializations[i]._id === id?._id) {
      return specializations[i].name;
    }
  }
  return "";
};

export const getInitialRouteName = (
  role: UserRoleEnum,
  astrologerId?: string
) => {
  if (role === UserRoleEnum.astrologer) {
    // console.log(astrologerId);
    if (astrologerId && astrologerId?.length > 0) {
      return "astrologerhomeascreen";
    }
    return "astrologerregistration";
  } else if (role === UserRoleEnum.affiliateMarketer) {
    return "affiliateMarketerhome";
  } else return "home";
};

export const detectPhoneNumber = (text: string): string | null => {
  const phoneRegex = /(\+91[\-\s]?)?[0]?(91)?[789]\d{9}/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

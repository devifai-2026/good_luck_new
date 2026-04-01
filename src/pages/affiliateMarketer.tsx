import React, { useEffect } from "react";
import HomeScreenLayout from "../components/Layouts/homeLayOut";
import ServicesHomePage from "./UserScreens/servicesScreen";
import { Alert, BackHandler } from "react-native";

const AffiliatearketerHomePage = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true; // prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup on unmount
  }, []);
  return (
    <HomeScreenLayout>
      <ServicesHomePage hideHeaderandFooter={true} />
    </HomeScreenLayout>
  );
};

export default AffiliatearketerHomePage;

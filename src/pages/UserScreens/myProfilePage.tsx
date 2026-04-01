import { View, Text } from "react-native";
import React from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import MyOwnProfile from "../../components/User/myOwnProfile";

const MyprofilePage = () => {
  return (
    <HomeScreenLayout>
      <MyOwnProfile />
    </HomeScreenLayout>
  );
};

export default MyprofilePage;

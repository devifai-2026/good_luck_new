import { View, Text } from "react-native";
import React from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import MyProfileEdit from "../../components/Shared/myProfileCreate";

const EditMyProfile = () => {
  return (
    <HomeScreenLayout hideFooter>
      <MyProfileEdit />
    </HomeScreenLayout>
  );
};

export default EditMyProfile;

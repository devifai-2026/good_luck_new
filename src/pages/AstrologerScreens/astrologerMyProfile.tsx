import { View, Text } from "react-native";
import React from "react";
import AstrologerHomeScreenLayout from "../../components/Layouts/astrologerHomeLayout";
import AstrologerForm from "./astrologerForm";
import AstrologerMyProfile from "../../components/Shared/astrologerMyProfile";

const AstrologerMyProfilePage = () => {
  return (
    <AstrologerHomeScreenLayout>
      <AstrologerMyProfile />
    </AstrologerHomeScreenLayout>
  );
};

export default AstrologerMyProfilePage;

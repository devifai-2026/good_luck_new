import { View, Text } from "react-native";
import React from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import DetailsPage from "../../components/User/adDetails";

const AdDetailsPage = () => {
  return (
    <HomeScreenLayout>
      <DetailsPage />
    </HomeScreenLayout>
  );
};

export default AdDetailsPage;

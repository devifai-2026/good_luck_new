import React from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import PujaPageComponent from "../../components/User/pujaPageComponent";
import { Text } from "react-native-paper";

const PujaPage = () => {
  return (
    <HomeScreenLayout>
      <PujaPageComponent />
    </HomeScreenLayout>
  );
};

export default PujaPage;

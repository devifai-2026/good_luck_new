import { View, Text } from "react-native";
import React from "react";
import AstrologerHomeScreenLayout from "../../components/Layouts/astrologerHomeLayout";
import AstrologerForm from "./astrologerForm";

const AstrologerEditProfile = () => {
  return (
    <AstrologerHomeScreenLayout>
      <AstrologerForm isEditForm />
    </AstrologerHomeScreenLayout>
  );
};

export default AstrologerEditProfile;

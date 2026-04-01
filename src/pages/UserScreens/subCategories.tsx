import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon set you want to use
import ScrollableMenu, {
  IMenuItem,
} from "../../components/Shared/scrollableTopMenu";
import GridView from "../../components/Shared/gridView";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import { subCategoriesstyle as styles } from "../../styles";
import useDivineShopServices from "../../hooks/useDivineShopServices";
import { ActivityIndicator, Divider } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import { useNavigation } from "@react-navigation/native";
import NoDataComponent from "../../components/User/noDataComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { UserRoleEnum } from "../../redux/redux.constants";
import AstrologerHomeScreenLayout from "../../components/Layouts/astrologerHomeLayout";
import SubCategoriesComponent from "../../components/Shared/subCategoriesComponent";

const Subcategories = ({ navigation }: { navigation: any }) => {
  const role = useSelector((state: RootState) => state.auth.userDetails?.role);

  return role === UserRoleEnum.astrologer ? (
    <AstrologerHomeScreenLayout>
      <SubCategoriesComponent />
    </AstrologerHomeScreenLayout>
  ) : (
    <HomeScreenLayout>
      <SubCategoriesComponent />
    </HomeScreenLayout>
  );
};

export default Subcategories;

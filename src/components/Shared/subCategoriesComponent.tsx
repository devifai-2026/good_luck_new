import React, { useEffect } from "react";
import GridView from "./gridView";
import { styleConstants, subCategoriesstyle as styles } from "../../styles";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useDivineShopServices from "../../hooks/useDivineShopServices";
import { ActivityIndicator, Divider, Text } from "react-native-paper";
import NoDataComponent from "../User/noDataComponent";
import ScrollableTopMenu from "./scrollableTopMenu";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const SubCategoriesComponent = () => {
  const {
    categoryList,
    getAllCategory,
    getAllProduct,
    loadingCategories,
    productList,
    loadingProducts,
  } = useDivineShopServices();

  useEffect(() => {
    getAllCategory();
    getAllProduct();
  }, []);

  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          onPress={() => {
            navigation.goBack();
          }}
          name="arrow-back"
          size={24}
          color="black"
          style={{ top: -2, zIndex: 10000000 }}
        />
        <Text style={styles.title}>Category</Text>
      </View>

      <View style={{ minHeight: "15%" }}>
        {loadingCategories ? (
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            color={styleConstants.color.primaryColor}
          />
        ) : categoryList?.length === 0 ? (
          <NoDataComponent message="No category avilable" type="small" />
        ) : (
          <ScrollableTopMenu navigation={navigation} menuItems={categoryList} />
        )}
      </View>

      <View style={styles.newArrivalsContainer}>
        <Text style={styles.newArrivals}>New Arrivals</Text>
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => {
            navigation.navigate("productlisting");
          }}
        >
          <Text style={styles.showMoreText}>Show More</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      {loadingProducts ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size={"large"}
          color={styleConstants.color.primaryColor}
        />
      ) : productList?.length === 0 ? (
        <NoDataComponent message="No product avilable" />
      ) : (
        <View style={{ alignItems: "center" }}>
          <GridView productList={productList} navigation={navigation} />
        </View>
      )}
    </View>
  );
};

export default SubCategoriesComponent;

import React, { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styleConstants } from "../../styles";
import NoDataComponent from "../User/noDataComponent";
import GridView from "./gridView";
import useDivineShopServices from "../../hooks/useDivineShopServices";
import { productListstyle as styles } from "../../styles";

const ProductListComponent = ({
  navigation,
  route: {
    params: { id },
  },
}: {
  navigation: any;
  route: any;
}) => {
  const {
    productList,
    loadingProducts,
    getAllProductByCategory,
    getAllProduct,
  } = useDivineShopServices();
  //(id, "getting route");
  useEffect(() => {
    if (id) getAllProductByCategory(id);
    else {
      getAllProduct();
      //(productList[0].source);
    }
  }, []);
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
        />
        <Text style={styles.title}>
          {id ? productList[0]?.categoryName : "New Arrivals "}
        </Text>
      </View>
      {loadingProducts ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size={"large"}
          color={styleConstants.color.primaryColor}
        />
      ) : productList?.length === 0 ? (
        <NoDataComponent message="No product avilable" />
      ) : (
        <GridView navigation={navigation} productList={productList} />
      )}
    </View>
  );
};

export default ProductListComponent;

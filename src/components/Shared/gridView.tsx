import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

import { gridViewStyle as styles } from "../../styles";

const screenWidth = Dimensions.get("window").width; // Get the screen width
const itemPadding = 10; // Padding around each grid item
const numberOfColumns = 2; // Set number of items per row to 2
const itemSize =
  (screenWidth - (numberOfColumns + 1) * itemPadding) / numberOfColumns; // Calculate item size

const GridView = ({
  navigation,
  productList,
}: {
  navigation: any;
  productList: any[];
}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={productList}
      renderItem={({
        item: { id, source, title, originalPrice, discountedPrice },
      }) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("buyProduct", { id: id });
          }}
        >
          <View
            style={{
              ...styles.itemContainer,
              width: itemSize - 18,
              height: itemSize + 80,
            }}
          >
            <Image
              source={source}
              style={{
                ...styles.image,
                height: itemSize - 10,
                width: itemSize - 30,
              }}
            />
            <Text style={styles.title}>{title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>{originalPrice}</Text>
              <Text style={styles.discountedPrice}>{discountedPrice}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      numColumns={numberOfColumns}
      key={numberOfColumns} // Important for refreshing layout when screen size changes
      contentContainerStyle={styles.gridContainer}
    />
  );
};

export default GridView;

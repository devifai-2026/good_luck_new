import React from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { gridViewStyle as styles } from "../../styles";

const screenWidth = Dimensions.get("window").width;
const COLUMNS = 2;
const GUTTER = 12;
const CARD_GAP = 10;
const cardWidth =
  (screenWidth - GUTTER * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS;
const imageHeight = cardWidth * 0.88;

function getDiscountPercent(
  original: string,
  discounted: string
): number | null {
  const orig = parseFloat(String(original).replace(/[^\d.]/g, ""));
  const disc = parseFloat(String(discounted).replace(/[^\d.]/g, ""));
  if (!orig || !disc || disc >= orig) return null;
  return Math.round(((orig - disc) / orig) * 100);
}

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
      }) => {
        const discount = getDiscountPercent(
          String(originalPrice),
          String(discountedPrice)
        );
        return (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("buyProduct", { id })}
            style={styles.cardWrapper}
          >
            <View style={[styles.card, { width: cardWidth }]}>
              <View style={[styles.imageWrapper, { height: imageHeight }]}>
                <Image source={source} style={styles.image} />
                {discount !== null && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{discount}% OFF</Text>
                  </View>
                )}
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.discountedPrice}>{discountedPrice}</Text>
                  {originalPrice !== discountedPrice && (
                    <Text style={styles.originalPrice}>{originalPrice}</Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item.id}
      numColumns={COLUMNS}
      key={COLUMNS}
      contentContainerStyle={styles.gridContainer}
    />
  );
};

export default GridView;

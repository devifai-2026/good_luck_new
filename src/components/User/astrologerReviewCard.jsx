import { Text, View, Image } from "react-native";
import React from "react";

import { astrologercardStyles as styles } from "../../styles";

// const { width } = Dimensions.get("window");

export default function AstrologerReviewCard({
  clientImage,
  clientName,
  reviewText,
  rating,
}) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.clientInfo}>
        <Image source={{ uri: clientImage }} style={styles.clientImage} />
        <View style={styles.clientDetails}>
          <Text style={styles.clientName}>{clientName}</Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, index) => (
              <Text key={index} style={styles.star}>
                {index < rating ? "★" : "☆"}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>{reviewText}</Text>
    </View>
  );
}

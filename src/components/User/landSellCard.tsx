import { Text, View, Image } from "react-native";
import React from "react";
import { landPageStyle } from "../../styles/landPage.styles.ts";
import Icon from "react-native-vector-icons/MaterialIcons";

interface landSellCardProps {
  title: string;
  location: string;
  price: string;
  imageUrl: string;
}

export const LandSellCard: React.FC<landSellCardProps> = ({
  title,
  location,
  price,
  imageUrl,
}) => {
  return (
    <View style={landPageStyle.LandCardContainer}>
      <View style={landPageStyle.cardImageContainer}>
        {/* <Image source={{ uri: imageUrl }} style={landPageStyle.cardImage} /> */}
        <Image
          source={require("../../assets/landImage.png")}
          style={landPageStyle.cardImage}
        />
        <View style={landPageStyle.newBadge}>
          <Text style={landPageStyle.newText}>New</Text>
        </View>
        <View style={landPageStyle.eyeIcon}>
          <Icon name="remove-red-eye" size={20} color="#fff" />
        </View>
      </View>
      <View style={landPageStyle.cardContent}>
        <Text style={landPageStyle.cardTitle}>{title}</Text>
        <View style={landPageStyle.locationContainer}>
          <Icon name="location-pin" size={16} color="#666" />
          <Text style={landPageStyle.locationText}>{location}</Text>
        </View>
        <Text style={landPageStyle.cardPrice}>{price}</Text>
      </View>
    </View>
  );
};

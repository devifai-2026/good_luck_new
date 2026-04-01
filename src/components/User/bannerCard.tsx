import { Text, View, Image, Pressable, Linking } from "react-native";
import React from "react";
import { landPageStyle } from "../../styles/landPage.styles.ts";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styleConstants } from "../../styles/constants.ts";
import { useNavigation } from "@react-navigation/native";
import { updateCurrentAdDetails } from "../../redux/silces/auth.silce.ts";
import { useDispatch } from "react-redux";
import { notifyMessage } from "../../hooks/useDivineShopServices.ts";

interface IBannerCard {
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  description: string;
  phone: string;
  isown: boolean;
  isNew: boolean;
  bannerData: any;
  isLocalService?: boolean;
}

const BannerCard: React.FC<IBannerCard> = ({
  title,
  location,
  price,
  imageUrl,
  description,
  phone,
  isown,
  isNew,
  bannerData,
  isLocalService,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const handleCall = async () => {
    try {
      const phoneNumber = `tel:${phone}`;
      const supported = await Linking.canOpenURL(phoneNumber);
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        notifyMessage("Unable to make the call.");
      }
    } catch (error) {}
  };

  if (isLocalService) {
    return (
      <Pressable onPress={handleCall}>
        <View style={landPageStyle.featuredCard}>
          {/* Full-bleed image */}
          <View style={landPageStyle.featuredImageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={landPageStyle.featuredImage}
            />
            {/* SPONSORED badge — top left */}
            <View style={landPageStyle.featuredAdBadge}>
              <Text style={landPageStyle.featuredAdBadgeText}>SPONSORED</Text>
            </View>

            {/* Price badge — bottom right of image */}
            {price ? (
              <View style={landPageStyle.featuredPriceBadge}>
                <Text style={landPageStyle.featuredPriceText}>₹ {price}</Text>
              </View>
            ) : null}
          </View>

          {/* Call Now footer */}
          <View style={landPageStyle.featuredFooter}>
            <Icon
              name="phone"
              size={18}
              color={styleConstants.color.primaryColor}
            />
            <Text style={landPageStyle.featuredCallText}>Call Now</Text>
            <Icon
              name="chevron-right"
              size={20}
              color={styleConstants.color.primaryColor}
            />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("addDetailsPage");
        dispatch(updateCurrentAdDetails(bannerData));
      }}
    >
      <View style={landPageStyle.LandCardContainer}>
        <View style={landPageStyle.cardImageContainer}>
          <Image source={{ uri: imageUrl }} style={landPageStyle.cardImage} />
          {isNew && (
            <View style={landPageStyle.newBadge}>
              <Text style={landPageStyle.newText}>New</Text>
            </View>
          )}
          <View style={landPageStyle.eyeIcon}>
            <Icon name="remove-red-eye" size={18} color="#fff" />
          </View>
        </View>
        <View style={landPageStyle.cardContent}>
          <Text style={landPageStyle.cardTitle}>{title}</Text>
          {location ? (
            <View style={landPageStyle.locationContainer}>
              <Icon name="location-pin" size={15} color="#999" />
              <Text style={landPageStyle.locationText}>{location}</Text>
            </View>
          ) : null}
          {phone ? (
            <View style={landPageStyle.contactContainer}>
              <Icon name="phone-in-talk" size={15} color="#999" />
              <Text style={landPageStyle.contactText}>{phone}</Text>
            </View>
          ) : null}
          {description ? (
            <Text style={landPageStyle.descriptionText} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
          {price ? (
            <Text style={landPageStyle.cardPrice}>₹ {price}</Text>
          ) : null}
        </View>
        <Pressable style={landPageStyle.actionButton} onPress={handleCall}>
          <Icon name="phone" size={18} color="#fff" />
          <Text style={landPageStyle.actionButtonText}>Call Now</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default BannerCard;

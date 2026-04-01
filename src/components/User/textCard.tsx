import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styleConstants } from "../../styles/constants";
import { useNavigation } from "@react-navigation/native";
import { textCardStyles as styles } from "../../styles";
import { useDispatch } from "react-redux";
import { updateCurrentAdDetails } from "../../redux/silces/auth.silce";

interface ITextCard {
  title: string;
  location: string;
  phone: string;
  isNew: boolean;
  chipOptions: string[];
  logo: string;
  isown: boolean;
  price: string;
  description: string;
  textData: any;
}

const TextCard = (props: ITextCard) => {
  const {
    title,
    location,
    phone,
    isNew,
    logo,
    price,
    description,
    textData,
  } = props;
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <Pressable
      onPress={() => {
        dispatch(updateCurrentAdDetails(textData));
        navigation.navigate("addDetailsPage");
      }}
    >
      <View style={styles.container}>
        {/* Header: logo + title + location + phone */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            {logo?.length > 0 ? (
              <Image
                style={styles.imageIcon}
                resizeMode="cover"
                source={{ uri: logo }}
              />
            ) : (
              <Icon
                name="campaign"
                size={26}
                color={styleConstants.color.primaryColor}
              />
            )}
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {title}
            </Text>
            {location ? (
              <View style={styles.infoRow}>
                <Icon name="location-pin" size={13} color="#AAA" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            ) : null}
            {phone ? (
              <View style={styles.infoRow}>
                <Icon name="phone-in-talk" size={13} color="#AAA" />
                <Text style={styles.contactText}>{phone}</Text>
              </View>
            ) : null}
          </View>

          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {description?.length > 0 && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {/* Footer: price + view details */}
        <View style={styles.footer}>
          {price ? (
            <Text style={styles.priceText}>₹ {price}</Text>
          ) : (
            <View />
          )}
          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
            <Icon
              name="chevron-right"
              size={14}
              color={styleConstants.color.primaryColor}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TextCard;

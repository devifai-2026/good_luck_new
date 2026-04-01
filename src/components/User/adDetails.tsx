import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Chip } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { dummyImageURL } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { addListener } from "@reduxjs/toolkit";
import { PostType } from "../../hooks/useAdvertisementService";
import DeleteModal from "../Shared/deleteModal";
import { notifyMessage } from "../../hooks/useDivineShopServices";

// Interface for props
interface IDetailsPageProps {}

const DetailsPage: React.FC<IDetailsPageProps> = () => {
  const [showDeleteModal, setshowDeleteModal] = useState<boolean>(false);
  const adDetails = useSelector(
    (state: RootState) => state.auth.currentAdDetails
  );
  const navigation = useNavigation<any>();

  const handlePress = async () => {
    try {
      if (adDetails?.website) {
        const url = adDetails.website.startsWith("http")
          ? adDetails.website
          : `https://${adDetails.website}`;
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          await Linking.openURL(url);
        } else {
          notifyMessage("Unable to open the website.");
        }
      } else if (adDetails?.phone) {
        const phoneNumber = `tel:${adDetails.phone}`;
        const supported = await Linking.canOpenURL(phoneNumber);

        if (supported) {
          await Linking.openURL(phoneNumber);
        } else {
          notifyMessage("Unable to make the call.");
        }
      } else {
        notifyMessage("No website or phone number available.");
      }
    } catch (error) {
      console.error("Error opening link:", error);
      notifyMessage("Something went wrong.");
    }
  };

  const toggleModal = () => {
    setshowDeleteModal(!showDeleteModal);
  };

  return showDeleteModal ? (
    <DeleteModal visible={showDeleteModal} onClose={toggleModal} />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Image */}
      {adDetails?.image && (
        <Image
          source={{ uri: adDetails?.image ?? dummyImageURL }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* New Badge */}
      {adDetails?.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>New</Text>
        </View>
      )}

      {/* Edit Button */}

      {/* Content */}
      <View style={styles.content}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.title}>{adDetails?.title}</Text>
          {adDetails?.isOwn && (
            <View style={styles.iconContainer}>
              <Pressable
                style={styles.editButton}
                onPress={() => {
                  const type = adDetails?.type;
                  // console.log(adDetails?.type, "getting category");
                  if (adDetails?.category === PostType.HomeLand)
                    navigation.navigate("editHomeAdd", { type });
                  else navigation.navigate("editJobAdd", { type });
                }}
              >
                <Icon
                  name="edit"
                  size={30}
                  color={styleConstants.color.primaryColor}
                />
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => {
                  setshowDeleteModal(true);
                }}
              >
                <Icon
                  name="delete"
                  size={30}
                  color={styleConstants.color.primaryColor}
                />
              </Pressable>
            </View>
          )}
        </View>

        {adDetails?.address && (
          <View style={styles.row}>
            <Icon name="location-pin" size={16} color="#666" />
            <Text style={styles.text}>
              {adDetails?.address}
              {adDetails?.addressTwo ? `,${adDetails?.addressTwo}` : ""}
            </Text>
          </View>
        )}
        {adDetails?.phone && (
          <View style={styles.row}>
            <Icon name="phone-in-talk" size={16} color="#666" />
            <Text style={styles.text}>{adDetails?.phone}</Text>
          </View>
        )}
        {adDetails?.companyName && (
          <View style={styles.row}>
            <Icon name="business" size={16} color="#666" />
            <Text style={styles.text}>{adDetails?.companyName}</Text>
          </View>
        )}
        {adDetails?.workLocation && (
          <View style={styles.row}>
            <Icon name="work" size={16} color="#666" />
            <Text style={styles.text}>{adDetails?.workLocation}</Text>
          </View>
        )}

        {adDetails?.price && (
          <Text style={styles.priceText}>₹ {adDetails?.price}</Text>
        )}
        {adDetails?.salary && (
          <Text style={styles.priceText}>₹ {adDetails?.salary}</Text>
        )}

        {adDetails?.description && (
          <Text style={styles.description}>{adDetails?.description}</Text>
        )}

        {/* Action Button */}
        {!adDetails?.isOwn && (
          <Pressable style={styles.actionButton} onPress={handlePress}>
            <Icon
              name={adDetails?.website ? "language" : "phone"}
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {adDetails?.website ? "Visit Website" : "Call Now"}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

export default DetailsPage;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  newBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
  },
  newText: {
    color: "#fff",
    fontSize: 12,

    fontFamily: styleConstants.fontFamily,
  },
  iconContainer: {
    flexDirection: "row", // Aligns items in a row
    justifyContent: "flex-end", // Aligns icons to the right
    alignItems: "center", // Vertically centers the icons
    gap: 12, // Adds space between the icons
    position: "absolute", // Keeps the icons on the top-right
    top: 8, // Adjusts the position of the icons from the top
    right: 8, // Adjusts the position of the icons from the right
  },

  editButton: {
    marginBottom: 10,
  },

  deleteButton: {
    marginBottom: 10,
  },

  editText: {
    marginLeft: 8,
    color: styleConstants.color.primaryColor,
    fontSize: 14,

    fontFamily: styleConstants.fontFamily,
  },
  content: {
    position: "relative",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  title: {
    fontSize: 20,
    justifyContent: "space-between",
    color: "#333",
    marginBottom: 8,
    fontFamily: styleConstants.fontFamily,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  text: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
    fontFamily: styleConstants.fontFamily,
  },
  priceText: {
    fontSize: 18,

    color: styleConstants.color.primaryColor,
    marginVertical: 8,
    fontFamily: styleConstants.fontFamily,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginVertical: 8,
    fontFamily: styleConstants.fontFamily,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: styleConstants.fontFamily,
  },
  extraDetails: {
    marginVertical: 8,
  },
  extraDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  extraDetailLabel: {
    fontSize: 14,

    color: "#333",
    fontFamily: styleConstants.fontFamily,
  },
  extraDetailValue: {
    fontSize: 14,
    color: "#666",
    fontFamily: styleConstants.fontFamily,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: styleConstants.color.primaryColor,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    width: "60%",
    alignSelf: "center",
  },
  actionButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,

    fontFamily: styleConstants.fontFamily,
  },
});

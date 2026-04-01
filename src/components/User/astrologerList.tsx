import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import { updateActiveAstrologerDetail } from "../../redux/silces/auth.silce";

import { astrologerListStyle as styles } from "../../styles";

interface AstrologerListProps {
  navigation: any;
  astrologers: Array<IAstrologer>;
}

export interface IAstrologer {
  id: string;
  name: string;
  status: string;
  image: string; // Assuming the profile picture is a URL or base64 string
  route: string;
  color: string;
  description: string;
  price: number;
  callPrice: number; // Added for call pricing
  orders: number; // Total number of services provided
  rating: number; // Rating of the astrologer
  language: string[]; // Assuming language is an array of strings
  certifications: string[]; // Corrected from 'certificaations' to 'certifications'
  yearsOfExperience: number; // Added for years of experience
}

const AstrologerList = ({ navigation, astrologers }: AstrologerListProps) => {
  const dispatch = useDispatch();
  const renderItem = ({ item }: { item: IAstrologer }) => (
    <View style={styles.astrologerItem}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          // console.log(item);
          dispatch(updateActiveAstrologerDetail(item)),
            navigation.navigate(item.route, { id: item.id });
        }}
      >
        <Image
          style={styles.icon}
          source={{ uri: item?.image }}
          resizeMode="contain"
        />
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={astrologers}
      horizontal
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default AstrologerList;

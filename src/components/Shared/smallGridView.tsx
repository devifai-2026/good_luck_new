import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styleConstants } from "../../styles";
import { useDispatch } from "react-redux";
import { updateCurrentLocalServiceCategory } from "../../redux/silces/auth.silce";


interface ICategory {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
}

interface IProps {
  data: ICategory[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

const SmallGridView = ({ data, refreshing, onRefresh }: IProps) => {
  const navigation = useNavigation<any>();
  const numColumns = 4;
  const dispatch = useDispatch();
  // Format data into rows of 3 and add empty spaces if needed
  const formattedData = [...data];
  while (formattedData.length % numColumns !== 0) {
    formattedData.push({
      id: `empty-${formattedData.length}`,
      name: "",
      color: "transparent",
    });
  }

  const renderItem = ({
    item,
  }: {
    item: { id: string; name: string; color: string; icon?: string | null };
  }) => {
    if (item.name === "") {
      return (
        <View style={{ flex: 1, margin: 8, backgroundColor: "transparent" }} />
      );
    }

    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => {
          dispatch(
            updateCurrentLocalServiceCategory({
              id: item?.id,
              name: item?.name,
            })
          );
          navigation.navigate("otherlocalservicepage", {
            localServiceId: item.id,
          });
        }}
      >
        <Image
          source={
            item.icon
              ? { uri: item.icon }
              : require("../../assets/localService.jpg")
          }
          style={styles.icon}
          resizeMode="cover"
        />
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <FlatList
        data={formattedData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={renderItem}
        refreshing={refreshing ?? false}
        onRefresh={onRefresh}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingBottom: 32,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginVertical: 12,
    marginHorizontal: 6,
    alignItems: "center",
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  name: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: styleConstants.fontFamily,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
  },
});

export default SmallGridView;

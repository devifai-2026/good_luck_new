import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import SmallGridView from "../../components/Shared/smallGridView";
import useLocalServices from "../../hooks/useLocalServices";
import { ActivityIndicator } from "react-native-paper";
import { styleConstants } from "../../styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const LocalServicesHomePage = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");

  const { getAllCategoryLocalServices, localServicesCategory, isLoading } =
    useLocalServices();

  useEffect(() => {
    getAllCategoryLocalServices();
  }, []);

  const filteredCategories = localServicesCategory.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <HomeScreenLayout>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            size={24}
            color="black"
            style={{ top: -2 }}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Local Services</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Icon name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Icon name="close" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Grid */}
        {isLoading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={styleConstants.color.primaryColor}
          />
        ) : (
          <SmallGridView
            data={filteredCategories}
            refreshing={isLoading}
            onRefresh={getAllCategoryLocalServices}
          />
        )}
      </View>
    </HomeScreenLayout>
  );
};

export default LocalServicesHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 22,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 10,
    fontWeight: "600",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: "#333",
    padding: 0,
  },
  loader: {
    marginTop: "50%",
  },
});

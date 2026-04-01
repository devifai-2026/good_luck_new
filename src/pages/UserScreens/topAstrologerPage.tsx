import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AstrologerCard from "../../components/User/astrologerCard";
import { styleConstants } from "../../styles/constants";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import NoDataComponent from "../../components/User/noDataComponent";

const PRIMARY = styleConstants.color.primaryColor;

export default function TopAstrologerPage() {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchtext, setsearchtext] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    getAstrologerList,
    astrologerList,
    loading,
    filterAstrologerByName,
    filteredastrologerList,
  } = useAstrologyServices();

  const [currentList, setcurrentList] = useState<any[]>([]);

  const filtersOld =
    useSelector((state: RootState) => state.auth.astrologerCategories) ?? [];
  const filters: any[] = [{ name: "All", _id: "" }, ...filtersOld];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setsearchtext("");
    await getAstrologerList(selectedFilter);
    setRefreshing(false);
  }, [selectedFilter]);

  useEffect(() => {
    getAstrologerList(selectedFilter);
  }, []);

  useEffect(() => {
    if (searchtext.length > 0) setcurrentList(filteredastrologerList);
    else setcurrentList(astrologerList);
  }, [astrologerList, filteredastrologerList]);

  const renderFilter = ({ item }: { item: any }) => {
    const isSelected = item?._id === selectedFilter;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedFilter(item?._id);
          getAstrologerList(item?._id);
        }}
        style={[
          pageStyles.chip,
          isSelected && pageStyles.chipActive,
        ]}
      >
        <Text style={[pageStyles.chipText, isSelected && pageStyles.chipTextActive]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <HomeScreenLayout>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[PRIMARY]}
              tintColor={PRIMARY}
            />
          }
        >
          {/* Header */}
          <View style={pageStyles.header}>
            <View style={pageStyles.headerBubble1} />
            <View style={pageStyles.headerBubble2} />
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={pageStyles.backBtn}
            >
              <Icon name="arrow-back" size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={pageStyles.headerRow}>
              <View>
                <Text style={pageStyles.headerTitle}>All Astrologers</Text>
                <Text style={pageStyles.headerSubtitle}>
                  {currentList.length > 0
                    ? `${currentList.length} experts available`
                    : "Find your perfect guide"}
                </Text>
              </View>
              <MaterialCommunityIcons name="star-shooting" size={38} color="rgba(255,255,255,0.25)" />
            </View>
          </View>

          {/* Floating Search */}
          <View style={pageStyles.searchWrapper}>
            <View style={pageStyles.searchBox}>
              <Icon name="search" size={20} color={PRIMARY} />
              <TextInput
                style={pageStyles.searchInput}
                placeholder="Search by name..."
                placeholderTextColor="#BBBBBB"
                value={searchtext}
                onChangeText={(text) => {
                  setsearchtext(text);
                  if (text.length === 0) setcurrentList(astrologerList);
                }}
                onSubmitEditing={() => filterAstrologerByName(searchtext)}
                returnKeyType="search"
              />
              {searchtext.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    setsearchtext("");
                    setcurrentList(astrologerList);
                  }}
                  style={pageStyles.clearBtn}
                >
                  <Icon name="close" size={15} color="#999" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => filterAstrologerByName(searchtext)}
                  style={pageStyles.searchIconBtn}
                >
                  <Icon name="tune" size={18} color={PRIMARY} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Chips */}
          <FlatList
            data={filters}
            renderItem={renderFilter}
            keyExtractor={(item) => item?._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={pageStyles.filterList}
          />

          {/* Astrologer List */}
          <View style={pageStyles.listContainer}>
            {loading ? (
              <ActivityIndicator
                style={{ marginTop: 60, alignSelf: "center" }}
                size="large"
                color={PRIMARY}
              />
            ) : currentList?.length > 0 ? (
              currentList.map((astrologer, index) => (
                <AstrologerCard key={astrologer.id ?? index} astrologer={astrologer} />
              ))
            ) : (
              <NoDataComponent message="No astrologer found" />
            )}
          </View>
        </ScrollView>
      </HomeScreenLayout>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY,
    paddingTop: 16,
    paddingBottom: 36,
    paddingHorizontal: 20,
    overflow: "hidden",
    borderRadius: 15,
  },
  headerBubble1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -50,
    right: -30,
  },
  headerBubble2: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -20,
    left: 100,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Poppins-Light",
    fontWeight: "700",
    color: "#FFF",
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins-Light",
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  searchWrapper: {
    marginTop: -20,
    paddingHorizontal: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Light",
    color: "#222",
    paddingVertical: 0,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  searchIconBtn: {
    padding: 2,
  },
  filterList: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    backgroundColor: "#FFF",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: PRIMARY,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Poppins-Light",
    fontWeight: "500",
    color: PRIMARY,
  },
  chipTextActive: {
    color: "#FFF",
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
});

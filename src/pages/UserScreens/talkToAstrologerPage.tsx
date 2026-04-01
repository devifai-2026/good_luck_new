import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Touchable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import Icon from "react-native-vector-icons/MaterialIcons";
import { talkToAstrologer } from "../../styles/talkToAstrologerLand";
import { useNavigation } from "@react-navigation/native";
import ScrollableTopMenu, {
  IMenuItem,
} from "../../components/Shared/scrollableTopMenu";
import AstrologerList from "../../components/User/astrologerList";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { ActivityIndicator } from "react-native-paper";
import { styleConstants } from "../../styles/constants";

export default function TalkToAstrologerPage() {
  const [serachData, setSearchData] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const { getAstrologerList, astrologerList, loading } = useAstrologyServices();

  const menuItems: IMenuItem[] = [
    {
      id: "1",
      title: "Panchang",
      icon: require("../../assets/panchang.png"),
      route: "panchangpage",
    },
    {
      id: "2",
      title: "Janam Kundali",
      icon: require("../../assets/janamKundali.png"),
      // route: matrimonyID ? "matrimonydashboard" : "creatematrimonyprofile",
      route: "janamkundali",
    },
    {
      id: "3",
      title: "Kundali Matching",
      icon: require("../../assets/kundaliMatching.png"),
      route: "matchmaking",
    },
    {
      id: "4",
      title: "Remedies",
      icon: require("../../assets/health&bueaty.png"),
      // route: datingID ? "datingdashboard" : "createdatingprofile",
      route: "subproducts",
    },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAstrologerList("");
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getAstrologerList("");
  }, []);

  return (
    <View style={{ height: "100%" }}>
      <HomeScreenLayout>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[styleConstants.color.primaryColor]}
              tintColor={styleConstants.color.primaryColor}
            />
          }
        >
          <View style={talkToAstrologer.container}>
            <View style={talkToAstrologer.headerContainer}>
              <View style={talkToAstrologer.headerSubContainer}>
                <Icon
                  onPress={() => {
                    navigation.goBack();
                  }}
                  name="arrow-back"
                  size={24}
                  color="black"
                  style={{ top: -2, zIndex: 10000000 }}
                />
                <Text style={talkToAstrologer.title}>Talk To Astrologer</Text>
              </View>
            </View>

            <ScrollableTopMenu navigation={navigation} menuItems={menuItems} />

            <View style={{}}>
              <View style={talkToAstrologer.headerSubContainer2}>
                <View>
                  <Text style={talkToAstrologer.title2}>Top Astrologer</Text>
                </View>
                {!loading && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("topAstrologerPage")}
                    disabled
                  ></TouchableOpacity>
                )}
              </View>
            </View>
            {loading ? (
              <ActivityIndicator
                style={{ marginTop: "30%", alignSelf: "center" }}
                size={"small"}
                color={styleConstants.color.primaryColor}
              />
            ) : (
              <AstrologerList
                navigation={navigation}
                astrologers={astrologerList}
              />
            )}

            <View style={{ width: "100%" }}>
              <View style={talkToAstrologer.headerSubContainer2}>
                <View>
                  <Text style={talkToAstrologer.title2}>Our Astrologer</Text>
                </View>
                {!loading && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("topAstrologerPage")}
                    disabled={loading}
                  >
                    <Text style={talkToAstrologer.ViewAll}>View all</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {loading ? (
              <ActivityIndicator
                style={{
                  marginTop: "30%",
                  alignSelf: "center",
                }}
                size={"small"}
                color={styleConstants.color.primaryColor}
              />
            ) : (
              <AstrologerList
                navigation={navigation}
                astrologers={astrologerList}
              />
            )}
          </View>
        </ScrollView>
      </HomeScreenLayout>
    </View>
  );
}

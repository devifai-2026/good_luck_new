import React, { useEffect } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native-paper";
import { MatchesStyles as styles } from "../../styles";
import useMatrimonyandDatingServices from "../../hooks/useMatrimonyDatingService";
import { ProfileType } from "../../services/constants";
import { styleConstants } from "../../styles/constants";
import MatchesList from "../../components/User/matchedList";
import { useRoute } from "@react-navigation/native";
import NoDataComponent from "../../components/User/noDataComponent";

const screenWidth = Dimensions.get("screen").width;

const Matches = ({ navigation }: { navigation: any }) => {
  const params = useRoute();

  const { getMatchedProfile, isLoading, allRecievedLikes, allSentLikes } =
    useMatrimonyandDatingServices();

  useEffect(() => {
    if (params.name === "datingmatches") {
      getMatchedProfile(ProfileType.dating);
    } else {
      getMatchedProfile(ProfileType.matrimony);
    }
  }, [params.name]);

  // Combine both lists with a type identifier
  const combinedData = [
    ...(allSentLikes?.length > 0
      ? [{ type: "header", title: "Sent Likes" }]
      : []),
    ...(allSentLikes || []),
    ...(allRecievedLikes?.length > 0
      ? [{ type: "header", title: "Received Likes" }]
      : []),
    ...(allRecievedLikes || []),
  ];

  const renderItem = ({ item }: any) => {
    if (item.type === "header") {
      return (
        <Text style={{ ...styles.title, fontSize: 22 }}>{item.title}</Text>
      );
    }
    return <MatchesList navigation={navigation} matchItems={[item]} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          name="arrow-back"
          onPress={() => navigation.goBack()}
          size={24}
          color="black"
          style={{ top: -2 }}
        />
        <Text style={[styles.title, { marginLeft: screenWidth / 3 - 20 }]}>
          Likes
        </Text>
      </View>
      <View style={styles.matchesContent}>
        {isLoading ? (
          <ActivityIndicator
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            size="large"
            color={styleConstants.color.primaryColor}
          />
        ) : combinedData?.length === 0 ? (
          <NoDataComponent message="No matches avilable" />
        ) : (
          <FlatList
            data={combinedData}
            keyExtractor={(item, index) => item.userID || `header-${index}`}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
};

export default Matches;

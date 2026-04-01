import React, { useEffect, useState } from "react";
// import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { astrologerRequestScreenStyle } from "../../styles/astrologerRequestScreen.style";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RequestList from "../../components/User/requestListing";
import AstrologerHomeScreenLayout from "../../components/Layouts/astrologerHomeLayout";
import { dummyImageURL } from "../../constants";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ActivityIndicator } from "react-native-paper";
import NoDataComponent from "../../components/User/noDataComponent";

export enum AstrologerRequestType {
  chatRequests,
  callRequests,
}

const AstrologerRequestScreen = ({ navigation }: { navigation: any }) => {
  const [requests, setRequests] = useState<any[]>([]);

  const [selectedTab, setSelectedTab] = useState<AstrologerRequestType>(
    AstrologerRequestType.chatRequests
  );

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId
  );

  const { astrologyChatList, astrologerChatListById, loading } =
    useAstrologyServices();

  useEffect(() => {
    if (selectedTab === AstrologerRequestType.chatRequests) {
      astrologerChatListById(astrologerId ?? "");
    }
  }, [selectedTab]);
  useEffect(() => {
    if (
      selectedTab === AstrologerRequestType.chatRequests &&
      astrologyChatList?.length > 0
    ) {
      setRequests(astrologyChatList);
    } else {
      setRequests([]);
    }
  }, [astrologyChatList, selectedTab]);

  console.log(requests, "astrologer chat list ");

  return (
    <AstrologerHomeScreenLayout>
      <View style={astrologerRequestScreenStyle.content}>
        <View style={astrologerRequestScreenStyle.appBar}>
          <TouchableOpacity style={astrologerRequestScreenStyle.arrowBtn}>
            <Icon name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={astrologerRequestScreenStyle.requestTitleText}>
            Chat history
          </Text>
        </View>
        <View style={astrologerRequestScreenStyle.tabContainer}>
          <TouchableOpacity
            style={[
              astrologerRequestScreenStyle.tabButton,
              selectedTab === AstrologerRequestType.callRequests &&
                astrologerRequestScreenStyle.selectedTab,
            ]}
            onPress={() => setSelectedTab(AstrologerRequestType.callRequests)}
          >
            <Text
              style={[
                astrologerRequestScreenStyle.tabButtonText,
                {
                  color:
                    selectedTab === AstrologerRequestType.chatRequests
                      ? "#FF6B6B"
                      : "#fff",
                },
              ]}
            >
              Call Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              astrologerRequestScreenStyle.tabButton,
              selectedTab === AstrologerRequestType.chatRequests &&
                astrologerRequestScreenStyle.selectedTab,
            ]}
            onPress={() => setSelectedTab(AstrologerRequestType.chatRequests)}
          >
            <Text
              style={[
                astrologerRequestScreenStyle.tabButtonText,
                {
                  color:
                    selectedTab === AstrologerRequestType.callRequests
                      ? "#FF6B6B"
                      : "#fff",
                },
              ]}
            >
              Chat Requests
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" />
        ) : requests?.length === 0 ? (
          <NoDataComponent message="No history found" />
        ) : (
          <RequestList messages={requests} />
        )}
      </View>
    </AstrologerHomeScreenLayout>
  );
};

export default AstrologerRequestScreen;

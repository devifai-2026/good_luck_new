import { View, Text } from "react-native";
import React, { useEffect } from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import RequestList from "../../components/User/requestListing";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { ActivityIndicator } from "react-native-paper";
import NoDataComponent from "../../components/User/noDataComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { styleConstants } from "../../styles";

const AstrologyChatHistory = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );
  const { astrologyChatList, astrologerChatListById, loading } =
    useAstrologyServices();
  useEffect(() => {
    astrologerChatListById(userId ?? "");
  }, []);
  // console.log(astrologyChatList, "getting astrology chat list for user");
  return (
    <HomeScreenLayout>
      <Text
        style={{
          fontFamily: styleConstants.fontFamily,
          color: styleConstants.color.textBlackColor,
          fontSize: 25,
          margin: 20,
        }}
      >
        Asrology chat history
      </Text>
      {loading ? (
        <ActivityIndicator
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50%",
          }}
          size={"large"}
          color={styleConstants.color.primaryColor}
        />
      ) : astrologyChatList?.length > 0 ? (
        <RequestList messages={astrologyChatList} />
      ) : (
        <NoDataComponent message="No chat history found" />
      )}
    </HomeScreenLayout>
  );
};

export default AstrologyChatHistory;

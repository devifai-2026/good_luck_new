import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import DatingScreenLayout from "../../components/Layouts/datingLayOut";
import MessageList from "../../components/Chat/messageListing";
import useMatchMessageService from "../../hooks/useMatchMessageService";
import { ActivityIndicator } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import NoDataComponent from "../../components/User/noDataComponent";

const DatingMessageList = (navigation: { navigation: any }) => {
  const { loading, matches, getAllMatchesByUserId } = useMatchMessageService();
  useEffect(() => {
    getAllMatchesByUserId();
  }, [navigation]);

  return (
    <View style={{ height: "100%" }}>
      <DatingScreenLayout showFooter navigation={navigation}>
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
        ) : matches?.length > 0 ? (
          <MessageList messages={matches} />
        ) : (
          <NoDataComponent message="No messaging found" />
        )}
      </DatingScreenLayout>
    </View>
  );
};

export default DatingMessageList;

const styles = StyleSheet.create({});

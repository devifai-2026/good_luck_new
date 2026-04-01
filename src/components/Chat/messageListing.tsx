import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Divider } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import { useNavigation } from "@react-navigation/native";
import { dummyImageURL } from "../../constants";
import { useDispatch } from "react-redux";
import {
  updateActiveId,
  updateActiveMatchId,
} from "../../redux/silces/auth.silce";

export interface IMessage {
  matchId: string;
  userName: string;
  profilePicture: string;
  lastMessage?: string;
  userId: string;
}

interface MessageListProps {
  messages: IMessage[];
}

const MessageListItem: React.FC<{ message: IMessage }> = ({ message }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  return (
    <Pressable
      onPress={() => {
        dispatch(updateActiveMatchId({ id: message?.matchId }));
        dispatch(updateActiveId({ id: message?.userId }));
        navigation.navigate("datingmessagechat");
      }}
    >
      <View style={styles.messageItem}>
        <Image
          source={{ uri: message.profilePicture[0] ?? dummyImageURL }}
          style={styles.profilePicture}
        />
        <View style={styles.messageDetails}>
          <Text style={styles.userName}>{message.userName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {message.lastMessage}
          </Text>
        </View>
        <Divider />
      </View>
    </Pressable>
  );
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <View>
      <Text
        style={{
          fontFamily: styleConstants.fontFamily,
          fontSize: 20,
          color: styleConstants.color.textBlackColor,
          paddingLeft: 15,
          paddingVertical: 10,
        }}
      >
        Messages
      </Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.matchId}
        renderItem={({ item }) => <MessageListItem message={item} />}
        style={styles.messageList}
      />
    </View>
  );
};

export default MessageList;

const styles = StyleSheet.create({
  messageList: {
    padding: 10,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,

    marginBottom: 4,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  lastMessage: {
    fontSize: 14,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
});

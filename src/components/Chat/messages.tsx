// Message.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import useMatchMessageService from "../../hooks/useMatchMessageService";
import { styleConstants } from "../../styles/constants";
import { ChatType } from "./astrologyChatUI";

type MessageProps = {
  message: string;
  isOwnMessage: boolean;
  timestamp: number | string;
  type?: ChatType;
};

const Message: React.FC<MessageProps> = ({
  message,
  isOwnMessage,
  timestamp,
  type,
}) => {
  const { getTimeValueByISO } = useMatchMessageService();

  const renderContent = () => {
    if (type === ChatType.image) {
      return (
        <Image
          source={{ uri: message }}
          style={styles.messageImage}
          resizeMode="cover"
        />
      );
    }
    return (
      <Text
        style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.friendMessageText,
        ]}
      >
        {message}
      </Text>
    );
  };

  return (
    <View>
      <View
        style={[
          styles.messageContainer,
          isOwnMessage
            ? styles.ownMessageContainer
            : styles.friendMessageContainer,
          type === ChatType.image && styles.imageMessageContainer,
        ]}
      >
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    maxWidth: "70%",
    padding: 10,
  },

  ownMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#5398FF",
    borderBottomStartRadius: 15,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  friendMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#002D710F",
    borderBottomEndRadius: 15,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  imageMessageContainer: {
    padding: 5,
    backgroundColor: "transparent",
  },
  messageText: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
  ownMessageText: {
    color: "#ffff",
  },
  friendMessageText: {
    color: "#000",
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default Message;

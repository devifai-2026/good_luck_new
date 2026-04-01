import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  BackHandler,
} from "react-native";
import Message from "./messages";
import { styleConstants } from "../../styles/constants";
import socketServices from "../../hooks/useSocketService";
import useMatchMessageService from "../../hooks/useMatchMessageService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ActivityIndicator } from "react-native-paper";
import DatingScreenLayout from "../Layouts/datingLayOut";
import { dummyImageURL } from "../../constants";
import useMatrimonyandDatingServices from "../../hooks/useMatrimonyDatingService";
import ProfileCreation from "../User/myProfile";
import { ProfileType } from "../../services/constants";
import { UserRoleEnum } from "../../redux/redux.constants";
import { SOCKET_TYPES } from "../../services/socket.types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { detectPhoneNumber } from "../../redux/utils";
import { notifyMessage } from "../../hooks/useDivineShopServices";

export interface MessageType {
  id: string;
  message: string;
  isOwnMessage: boolean;
  timestamp: number;
}

const DatingChatComponent = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const matchId = useSelector((state: RootState) => state.auth.currentMatchId);

  const currentId = useSelector(
    (state: RootState) => state.auth.currentProfileId
  );

  const navigation = useNavigation<any>();

  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    setMessages,
    getMessagesByMatchId,
    loading,
    formatMessageForList,
  } = useMatchMessageService();

  const { getProfileDetails, profileDetails, isLoading } =
    useMatrimonyandDatingServices();

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (detectPhoneNumber(newMessage)) {
      notifyMessage("Sharing phone numbers is not allowed.");
      return;
    }
    if (socketServices && newMessage.trim().length > 0) {
      const messageData = {
        message: newMessage,
        senderId: userId,
        matchId,
      };
      socketServices.emit(SOCKET_TYPES.datingSendMessage, messageData); // Emit the message to the server
      const newMessageObj: MessageType = {
        id: (messages.length + 1).toString(),
        message: newMessage,
        isOwnMessage: true,
        timestamp: Date.now(),
      };

      setMessages([...messages, newMessageObj]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    // socketServices.initializeSocket();
    socketServices.emit(SOCKET_TYPES.registerUser, userId);

    socketServices.on(SOCKET_TYPES.datingNewMessage, (newMessage: any) => {
      // console.log(newMessage);
      if (newMessage?.matchId === matchId && newMessage?.senderId !== userId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          formatMessageForList(newMessage),
        ]);
      }
    });

    return () => {
      socketServices.removeListener(SOCKET_TYPES.datingNewMessage);
    };
  }, [matchId, userId]);

  useEffect(() => {
    getMessagesByMatchId(matchId ?? "");
    getProfileDetails(ProfileType.dating, currentId ?? "");
  }, []);
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("datingdashboard");
        return true; // Prevent default behavior (exit app)
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  return (
    <DatingScreenLayout
      showFooter
      chatname={profileDetails?.userName}
      chatProfilePicture={profileDetails?.imageURL[0] ?? dummyImageURL}
      isChatUI
    >
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={80}
        >
          {loading || isLoading ? (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size={"large"}
              color={styleConstants.color.primaryColor}
            />
          ) : (
            <View style={styles.content}>
              {messages.length === 0 ? (
                <Text style={styles.noMessageText}>
                  Start chatting with your new match!
                </Text>
              ) : (
                <FlatList
                  inverted
                  ref={flatListRef}
                  data={messages}
                  renderItem={({ item }) => <Message {...item} />}
                  keyExtractor={(item) => item.id}
                  style={styles.messageList}
                  contentContainerStyle={styles.messageListContainer}
                  showsVerticalScrollIndicator={false}
                />
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type a message..."
                  style={styles.input}
                  placeholderTextColor={styleConstants.color.textGrayColor}
                />

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendMessage}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </DatingScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  loadingIndicator: {
    marginTop: "50%",
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
    position: "static",
    bottom: "auto",
  },
  messageListContainer: {
    paddingBottom: 10,
    flexDirection: "column-reverse",
  },
  noMessageText: {
    color: styleConstants.color.textBlackColor,
    fontSize: 18,
    textAlign: "center",
    marginTop: "50%",
    fontFamily: styleConstants.fontFamily,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    color: "#000",
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
  sendButton: {
    backgroundColor: styleConstants.color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
  },
});

export default DatingChatComponent;

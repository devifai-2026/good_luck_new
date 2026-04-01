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
  Alert,
} from "react-native";
import Message from "./messages";
import { styleConstants } from "../../styles/constants";
import socketServices from "../../hooks/useSocketService";
import useMatchMessageService from "../../hooks/useMatchMessageService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import DatingScreenLayout from "../Layouts/datingLayOut";
import { dummyImageURL, uploadPreset } from "../../constants";
import useMatrimonyandDatingServices from "../../hooks/useMatrimonyDatingService";

import { ProfileType } from "../../services/constants";
import { UserRoleEnum } from "../../redux/redux.constants";
import { SOCKET_TYPES } from "../../services/socket.types";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  updateAstrologyChatDetails,
  updateChatDuration,
} from "../../redux/silces/auth.silce";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { detectPhoneNumber, requestCameraPermission } from "../../redux/utils";
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import { cloudinaryURL } from "../../services/constants";

export interface MessageType {
  id: string;
  message: string;
  isOwnMessage: boolean;
  timestamp: number;
  type?: ChatType;
}

export enum ChatStatus {
  accepted,
  rejected,
  ended,
  waiting,
  error,
  idle,
}

export enum ChatSendModel {
  user = "User",
  astrologer = "Astrologer",
}

export enum ChatType {
  text = "text",
  image = "image",
  video = "video",
}

export enum CallType {
  voice = "audio",
  video = "video",
}

const AstrologyChatComponent = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [chatDuration, setChatDuration] = useState<number>(0); // Timer in seconds

  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID,
  );

  const routes = useRoute<any>();

  const otherUserId = routes?.params?.userId;

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId,
  );

  const otherAstrologerId = useSelector(
    (state: RootState) => state.auth?.currentAstrologerDetails?.id,
  );

  const currentChatUserDetails = useSelector(
    (state: RootState) => state.auth.currentChatUserDetails,
  );

  const { roomId, chatStartTime, chatStatus } = useSelector(
    (state: RootState) => state.auth.astrologyChatDetails,
  );

  const isAstrologer = useSelector(
    (state: RootState) =>
      state.auth.userDetails?.role === UserRoleEnum.astrologer,
  );

  const dispatch = useDispatch();

  const navigation = useNavigation<any>();

  const flatListRef = useRef<FlatList>(null);
  const {
    astrologyMessageList,
    setAstrologyMessageList,
    loading,
    astrologerMessageListing,
  } = useAstrologyServices();

  // const { getProfileDetails, profileDetails, isLoading } =
  //   useMatrimonyandDatingServices();
  const extractIds = (room: string) => {
    if (!room) return { messageUserId: userId, astrologerId: astrologerId };
    const parts = room.split("_");

    if (parts.length >= 3) {
      // room_userId_astrologerId
      const messageUserId = parts[1];
      const astrologerId = parts[2];
      return { messageUserId, astrologerId };
    }
    return { messageUserId: userId, astrologerId: astrologerId };
  };

  const uploadToCloudinary = async (file: any) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.type,
        name: file.name || "image.jpg",
      });
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(cloudinaryURL, {
        method: "POST",
        body: formData,
      });

      const data = await response?.json();

      if (data?.secure_url) {
        return data?.secure_url;
      } else {
        console.error("Upload failed:", data);
        notifyMessage("Image upload failed");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      notifyMessage("Error uploading image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const selectImageFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      notifyMessage("Camera permission denied.");
      return;
    }
    try {
      const cameraOptions: CameraOptions = {
        mediaType: "photo",
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
        saveToPhotos: true,
      };

      const response = await launchCamera(cameraOptions);
      if (response.assets && response.assets[0]) {
        const imageUrl = await uploadToCloudinary(response.assets[0]);
        if (imageUrl) {
          sendMessage(imageUrl, ChatType.image);
        }
      }
    } catch (error) {
      console.error("Error launching camera:", error);
    }
  };

  const selectImageFromGallery = async () => {
    try {
      const galleryOptions: ImageLibraryOptions = {
        mediaType: "photo",
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      };

      const response = await launchImageLibrary(galleryOptions);
      if (response.assets && response.assets[0]) {
        const imageUrl = await uploadToCloudinary(response.assets[0]);
        if (imageUrl) {
          sendMessage(imageUrl, ChatType.image);
        }
      }
    } catch (error) {
      console.error("Error launching image library:", error);
    }
  };

  const sendMessage = (content?: string, type: ChatType = ChatType.text) => {
    const messageContent = content || newMessage;
    if (type === ChatType.text && detectPhoneNumber(messageContent)) {
      notifyMessage("Sharing phone numbers is not allowed.");
      return;
    }
    if (socketServices && messageContent.trim().length > 0) {
      const ids = extractIds(roomId);
      const messageUserId = ids.messageUserId || userId;
      const targetAstrologerId = ids.astrologerId || astrologerId;

      const messageData = {
        message: messageContent,
        senderId: isAstrologer ? astrologerId : userId,
        receiverId: isAstrologer ? messageUserId : targetAstrologerId,
        roomId: roomId,
        type: type,
        senderModel: isAstrologer
          ? ChatSendModel.astrologer
          : ChatSendModel.user,
        receiverModel: isAstrologer
          ? ChatSendModel.user
          : ChatSendModel.astrologer,
      };
      console.log(messageData, "before sending");
      socketServices.emit(SOCKET_TYPES.sendMessage, messageData);
      const newMessageObj: MessageType = {
        id: (astrologyMessageList.length + 1).toString(),
        message: messageContent,
        isOwnMessage: true,
        timestamp: Date.now(),
        type: type,
      };

      setAstrologyMessageList([...astrologyMessageList, newMessageObj]);
      setNewMessage("");
    }
  };

  const handleEndChat = () => {
    socketServices.emit(SOCKET_TYPES.endChat, {
      roomId,
      sender: isAstrologer ? "astrologer" : "user",
    });
    dispatch(
      updateAstrologyChatDetails({
        chatStatus: ChatStatus.ended,
        timer: 0,
        chatStartTime: 0,
        roomId: "",
      }),
    );
    if (isAstrologer) navigation.navigate("astrologerhomeascreen");
    else {
      navigation.navigate("talkToAstrologer");
    }
  };

  const handlePauseChat = () => {
    socketServices.emit(SOCKET_TYPES.pauseChat, { roomId });
    setIsPaused(true);
  };

  const handlePausedChat = (data: any) => {
    console.log("handlePausedChat");
    notifyMessage(data?.message);
    setIsPaused(true);
  };

  const handleResumeChat = () => {
    socketServices.emit(SOCKET_TYPES.resumeChat, { roomId });
    setIsPaused(false);
  };

  const handleResumedChat = (data: any) => {
    console.log("handleEndChat");
    notifyMessage(data?.message);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleMessageReceived = (newMessage: any) => {
      // console.log(newMessage);
      if (
        newMessage?.receiverId === userId ||
        newMessage?.receiverId === astrologerId
      ) {
        setAstrologyMessageList((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            message: newMessage?.message,
            isOwnMessage: newMessage?.senderId === userId,
            timestamp: Date.now(),
            type: newMessage?.type ?? ChatType.text,
          },
        ]);
      }
    };

    const handleChatError = (error: any) => {
      console.error("Chat error:", error.message);
      dispatch(
        updateAstrologyChatDetails({
          chatStatus: ChatStatus.error,
          timer: 0,
          chatStartTime: 0,
          roomId: "",
        }),
      );
    };

    const handleChatEnd = (data: any) => {
      console.log("handle chat end", "isastrologer", isAstrologer);
      notifyMessage(data.reason);

      dispatch(
        updateAstrologyChatDetails({
          chatStatus: ChatStatus.ended,
          timer: 0,
          chatStartTime: 0,
          roomId: "",
        }),
      );

      if (isAstrologer) navigation.navigate("astrologerhomeascreen");
      else {
        navigation.navigate("talkToAstrologer");
      }
    };
    const handleChatTimer = (data: any) => {
      console.log("⏱️ Chat timer from server:", data);
      if (data.elapsedTime) {
        // Sync with server's minute-based timer
        setChatDuration(data.elapsedTime * 60);
      }
    };

    const handleChatAccepted = (data: any) => {
      console.log("✅ Chat accepted event received in ChatUI:", data);
      dispatch(
        updateAstrologyChatDetails({
          chatStatus: ChatStatus.accepted,
          roomId: data.roomId,
        }),
      );
      // 🔥 Join the room to receive messages
      if (data.roomId) {
        socketServices.emit(SOCKET_TYPES.joinRoom, data.roomId);
      }
    };

    if (socketServices) {
      socketServices.on(SOCKET_TYPES.receivedMessage, handleMessageReceived);

      socketServices.on(SOCKET_TYPES.chatPaused, handlePausedChat);
      socketServices.on(SOCKET_TYPES.chatResumes, handleResumedChat);
      socketServices.on(SOCKET_TYPES.chatError, handleChatError);
      socketServices.on(SOCKET_TYPES.chatEnd, handleChatEnd);
      socketServices.on(SOCKET_TYPES.chatAccepted, handleChatAccepted);
      socketServices.on("chat-timer", handleChatTimer);
    }

    return () => {
      socketServices.removeListener(SOCKET_TYPES.chatRequested);
      socketServices.removeListener(SOCKET_TYPES.receivedMessage);
      socketServices.removeListener(SOCKET_TYPES.chatResponse);
      socketServices.removeListener(SOCKET_TYPES.chatRejected);
      socketServices.removeListener(SOCKET_TYPES.chatError);
      socketServices.removeListener(SOCKET_TYPES.chatEnd);
      socketServices.removeListener(SOCKET_TYPES.chatAccepted);
      socketServices.removeListener("chat-timer");
    };
  }, [isAstrologer, userId, dispatch]);

  useEffect(() => {
    return () => {
      if (routes?.name === "astrologychat") handleEndChat();
    };
  }, []);

  useEffect(() => {
    let timerInterval: any = null;
    console.log(
      "🕒 Timer Effect running. Status:",
      chatStatus,
      "Paused:",
      isPaused,
      "Role:",
      isAstrologer ? "Astrologer" : "User",
    );

    if (!isPaused && chatStatus === ChatStatus.accepted) {
      console.log("🚀 Starting chat timer interval");
      timerInterval = setInterval(() => {
        setChatDuration((prev) => prev + 1);
      }, 1000);
    } else {
      console.log("🛑 Timer interval NOT started because criteria not met");
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isPaused, chatStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    console.log(otherUserId, "getting other user id from params");
    console.log(userId, "getting user id from redux");
    // console.log(astrologerId, "getting astrologer id from redux");
    {
      if (isAstrologer) {
        console.log("astrologer case");
        astrologerMessageListing(otherUserId, astrologerId ?? "", true);
      } else if (routes?.name === "astrologychat") {
        astrologerMessageListing(userId ?? "", otherAstrologerId ?? "", true);
      } else {
        astrologerMessageListing(userId ?? "", otherUserId ?? "", false);
      }
    }
  }, [routes]);

  return (
    <DatingScreenLayout
      showFooter
      chatname={currentChatUserDetails?.name ?? "User"}
      chatProfilePicture={
        currentChatUserDetails?.profilePicture ?? dummyImageURL
      }
      isChatUI
    >
      {chatStatus === ChatStatus.waiting ? (
        <View>
          <ActivityIndicator
            style={styles.loadingIndicator}
            size={"large"}
            color={styleConstants.color.primaryColor}
          />
          <Text style={styles.noMessageText}>
            {`Waiting for ${currentChatUserDetails?.name ?? "Astrologer"
              } to accept your chat`}
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          {routes?.name === "astrologychat" && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                Chat Duration: {formatTime(chatDuration)}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleEndChat}
                  style={styles.endButton}
                  labelStyle={{ fontFamily: styleConstants.fontFamily }}
                >
                  End
                </Button>

                {/* {isPaused && isAstrologer && (
                  <Button
                    mode="contained"
                    onPress={handleResumeChat}
                    disabled={!isPaused}
                    style={styles.resumeButton}
                    labelStyle={{ fontFamily: styleConstants.fontFamily }}
                  >
                    Resume
                  </Button>
                )}
                {!isPaused && isAstrologer && (
                  <Button
                    mode="contained"
                    onPress={handlePauseChat}
                    disabled={isPaused}
                    style={styles.pauseButton}
                    labelStyle={{ fontFamily: styleConstants.fontFamily }}
                  >
                    Pause
                  </Button>
                )} */}
              </View>
            </View>
          )}

          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
          >
            {loading ? (
              <ActivityIndicator
                style={styles.loadingIndicator}
                size={"large"}
                color={styleConstants.color.primaryColor}
              />
            ) : (
              <View style={styles.content}>
                {astrologyMessageList?.length === 0 ? (
                  <Text style={styles.noMessageText}>
                    Start chatting with{" "}
                    {currentChatUserDetails?.name ?? isAstrologer
                      ? "User"
                      : "Astrologer"}
                    !
                  </Text>
                ) : (
                  <FlatList
                    inverted
                    ref={flatListRef}
                    data={astrologyMessageList}
                    renderItem={({ item }) => <Message {...item} />}
                    keyExtractor={(item) => item.id}
                    style={styles.messageList}
                    contentContainerStyle={styles.messageListContainer}
                    showsVerticalScrollIndicator={false}
                  />
                )}
                {routes?.name === "astrologychat" && (
                  <View style={styles.inputContainer}>
                    <View style={{ flexDirection: "row", marginRight: 5 }}>
                      <IconButton
                        icon="camera"
                        size={24}
                        onPress={selectImageFromCamera}
                        disabled={uploading}
                      />
                      <IconButton
                        icon="image"
                        size={24}
                        onPress={selectImageFromGallery}
                        disabled={uploading}
                      />
                    </View>
                    <TextInput
                      value={newMessage}
                      onChangeText={setNewMessage}
                      placeholder="Type a message..."
                      style={styles.input}
                      placeholderTextColor="#888888"
                    />

                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={() => sendMessage()}
                    >
                      <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      )}
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

  timerContainer: {
    padding: 10,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginVertical: 10,
  },
  endButton: {
    backgroundColor: styleConstants.color.deepRed,
    justifyContent: "flex-start",
  },
  pauseButton: {
    backgroundColor: styleConstants.color.primaryColor,
    justifyContent: "flex-end",
  },
  resumeButton: {
    backgroundColor: styleConstants.color.deepGreen,
    justifyContent: "flex-end",
  },
});

export default AstrologyChatComponent;

import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Divider } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import CallReceivedIcon from "../../assets/Svg/CallReceivedIcon";

import useMatchMessageService from "../../hooks/useMatchMessageService";
import socketServices from "../../hooks/useSocketService";
import { SOCKET_TYPES } from "../../services/socket.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { IAstrologyChatDetails } from "../../redux/redux.constants";
import { CallType, ChatStatus, ChatType } from "../Chat/astrologyChatUI";
import {
  removeChatRequestFromList,
  updateAstrologyCallDetails,
  updateAstrologyChatDetails,
  updateChatprofileDetails,
  updateCurrentCallDetails,
} from "../../redux/silces/auth.silce";
import { notifyMessage } from "../../hooks/useDivineShopServices";

import { requestListingStyle as styles } from "../../styles";
import { AGORA_APP_ID, dummyImageURL } from "../../constants";
import useAgora from "../../hooks/useAgora";
import ChatReceivedIcon from "../../assets/Svg/chatReceivedIcon";

interface Message {
  id: string;
  userId: string;
  userName: string;
  profilePicture: string;
  lastMessage: string;
  time?: number;
  totalChatTime?: string;
  type?: string;
  channelName?: string;
  userUid?: number;
  astrologerUid?: number;
  clientToken?: string;
  astrologerToken?: string;
}

interface MessageListProps {
  messages: Message[];
}

const RequestListItem: React.FC<{ message: Message }> = ({ message }) => {
  const { getTimeValueByISO } = useMatchMessageService();

  // console.log(message);

  // const callDetails = useSelector(
  //   (state: RootState) => state.auth.astrologyCallDetails
  // );

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId ?? "",
  );

  const { joinChannel } = useAgora();

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleChatAccept = () => {
    console.log("Chat Accepted");
    dispatch(
      updateChatprofileDetails({
        name: message?.userName,
        profilePicture: message?.profilePicture,
      }),
    );
    const acceptobject = { requestId: message?.id, response: "accepted" };
    socketServices.emit(SOCKET_TYPES.chatResponse, acceptobject);
    // navigation.navigate("astrologychat");
  };

  const handleCallAccept = () => {
    const acceptobject = {
      requestId: message?.id,
      response: "accepted",
      userId: message?.userId,
      astrologerId,
      callType: CallType.voice,
    };
    socketServices.emit(SOCKET_TYPES.callResponse, acceptobject);
    // navigation.navigate("datingchat");
  };

  const handleRejectChat = () => {
    console.log("Rejecting");
    socketServices.emit(SOCKET_TYPES.chatResponse, {
      requestId: message.id,
      response: "rejected",
    });

    dispatch(removeChatRequestFromList(message?.id));
  };

  const handleRejectCall = () => {
    console.log("Rejecting");
    socketServices.emit(SOCKET_TYPES.callResponse, {
      requestId: message.id,
      response: "rejected",
    });

    dispatch(updateCurrentCallDetails(null));

    dispatch(removeChatRequestFromList(message?.id));
  };

  const handleChatAccepted = (data: any) => {
    console.log("handleChatAccepted", "isastrologer");
    const chatState: IAstrologyChatDetails = {
      roomId: data.roomId,
      chatStartTime: Date.now(),
      timer: Date.now(),
      chatStatus: ChatStatus.accepted,
    };

    dispatch(updateAstrologyChatDetails(chatState));

    socketServices.emit(SOCKET_TYPES.joinRoom, data.roomId);

    navigation.navigate("astrologychat", {
      userId: message.userId,
    });
    dispatch(removeChatRequestFromList(message?.id));
  };

  const callJoinCallBack = (data: any) => {
    const chatState: IAstrologyChatDetails = {
      roomId: data.roomId,
      chatStartTime: Date.now(),
      timer: Date.now(),
      chatStatus: ChatStatus.accepted,
    };

    dispatch(updateAstrologyChatDetails(chatState));

    dispatch(removeChatRequestFromList(message?.id));

    navigation.navigate("AstrologerVoiceCallScreen");
  };

  const handleCallAccepted = async (data: any) => {
    console.log("🛑 STOP: Astrologer should NOT join from requestListing");

    // 🔥 CRITICAL: Do NOT join here at all
    const astrologerCallDetails = {
      appId: AGORA_APP_ID,
      channelName: message?.channelName,
      clientToken: message?.astrologerToken, // Astrologer token
      userUid: message?.userUid, // FIX: Use correct userUid from message
      astrologerUid: message?.astrologerUid, // Clear field name
      originalUserUid: message?.userUid, // User UID (reference)
      roomId: data.roomId,
      name: message?.userName, // ✅ Added user name
      profilePicture: message?.profilePicture, // ✅ Added profile picture
    };

    console.log("🎯 PREPARING for AstrologerVoiceCallScreen:", {
      astrologerUid: astrologerCallDetails.astrologerUid,
      userUidForCallScreen: astrologerCallDetails.userUid,
    });

    // Store in Redux
    dispatch(updateAstrologyCallDetails(astrologerCallDetails));

    // Update chat state
    const chatState: IAstrologyChatDetails = {
      roomId: data.roomId,
      chatStartTime: Date.now(),
      timer: Date.now(),
      chatStatus: ChatStatus.accepted,
    };
    dispatch(updateAstrologyChatDetails(chatState));
    dispatch(removeChatRequestFromList(message?.id));

    // 🔥 NAVIGATE ONLY - NO JOIN HERE
    console.log("🚀 Navigating to AstrologerVoiceCallScreen WITHOUT joining");
    navigation.navigate("AstrologerVoiceCallScreen", {
      callDetails: astrologerCallDetails,
    });
  };

  const handleChatError = () => {
    const chatState: Partial<IAstrologyChatDetails> = {
      chatStatus: ChatStatus.idle,
    };

    dispatch(updateAstrologyChatDetails(chatState));

    notifyMessage("Could not start the chat");
    dispatch(updateCurrentCallDetails(null));
  };

  const handleCallError = () => {
    const chatState: Partial<IAstrologyChatDetails> = {
      chatStatus: ChatStatus.idle,
    };

    dispatch(updateAstrologyChatDetails(chatState));

    notifyMessage("Could not start the chat");
  };
  useEffect(() => {
    console.log("socket id", socketServices.socketId);
    socketServices.on(SOCKET_TYPES.chatAccepted, handleChatAccepted);
    socketServices.on(SOCKET_TYPES.chatError, handleChatError);
    socketServices.on(SOCKET_TYPES.joinCall, handleCallAccepted);
    socketServices.on(SOCKET_TYPES.callError, handleCallError);

    return () => {
      socketServices.removeListener(SOCKET_TYPES.chatAccepted);
      socketServices.removeListener(SOCKET_TYPES.chatError);
      socketServices.removeListener(SOCKET_TYPES.joinCall);
    };
  }, []);

  console.log(message);

  return (
    <Pressable
      onPress={
        message?.totalChatTime
          ? () => {
              dispatch(
                updateChatprofileDetails({
                  name: message?.userName,
                  profilePicture: message?.profilePicture,
                }),
              );
              navigation.navigate("astrologychathistory", {
                userId: message.userId,
              });
            }
          : () => {}
      }
    >
      <View style={styles.messageItem}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: message?.profilePicture ?? dummyImageURL }}
            style={styles.profilePicture}
          />
          <View style={styles.iconOverlay}>
            {message?.type === "call" ? (
              <CallReceivedIcon />
            ) : (
              <CallReceivedIcon />
            )}
          </View>
        </View>

        <View style={styles.messageDetails}>
          <Text style={styles.userName}>{message.userName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {message?.totalChatTime
              ? message?.totalChatTime
              : getTimeValueByISO(message?.time ?? "")}
          </Text>
        </View>
        {!message?.totalChatTime && (
          <View>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={
                message?.channelName ? handleRejectCall : handleRejectChat
              }
            >
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={
                message?.channelName ? handleCallAccept : handleChatAccept
              }
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}

        <Divider />
      </View>
    </Pressable>
  );
};

const RequestList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestListItem message={item} />}
        style={styles.messageList}
        scrollEnabled
      />
    </View>
  );
};

export default RequestList;

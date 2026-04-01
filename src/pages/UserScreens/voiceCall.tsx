import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AGORA_APP_ID, dummyImageURL } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import useAgora from "../../hooks/useAgora";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { updateAstrologyChatDetails } from "../../redux/silces/auth.silce";
import { ChatStatus } from "../../components/Chat/astrologyChatUI";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import socketServices from "../../hooks/useSocketService";
import { SOCKET_TYPES } from "../../services/socket.types";
import LoaderModal from "../../components/Shared/lodarModal";
import { styleConstants } from "../../styles";

const VoiceCallPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const callDetails = useSelector(
    (state: RootState) => state.auth.astrologyCallDetails
  );

  const astrologerDetails = useSelector(
    (state: RootState) => state.auth.currentAstrologerDetails
  );

  const currentCallDetails = useSelector(
    (state: RootState) => state.auth.astrologyChatDetails
  );

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId
  );

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { leaveChannel, isJoined } = useAgora();
  // AGORA_APP_ID,
  // astrologerId ? callDetails?.astrologerToken : callDetails?.userToken,
  // callDetails?.channelName,
  // astrologerId ? callDetails?.astrologerUid : callDetails?.userUid

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const endCall = () => {
    leaveChannel(
      astrologerId && astrologerId?.length > 0 ? "astrologer" : "user",
      currentCallDetails?.roomId
    );
  };

  const handleChatEnd = (data: any) => {
    //"handleChatrejected", "isastrologer");
    notifyMessage(data.reason);

    dispatch(
      updateAstrologyChatDetails({
        chatStatus: ChatStatus.ended,
        timer: 0,
        chatStartTime: 0,
        roomId: "",
      })
    );
    navigation.goBack();
  };

  useEffect(() => {
    socketServices.on(SOCKET_TYPES.endCall, handleChatEnd);
    return () => {
      socketServices.removeListener(SOCKET_TYPES.chatEnd);
    };
  }, []);

  return isJoined ? (
    <LoaderModal text="Initiating your call" visible={!isJoined} />
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Voice Call</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              astrologerId && astrologerId?.length > 0
                ? astrologerDetails?.image
                : dummyImageURL, // Replace with actual image
          }}
          style={styles.profileImage}
        />
        <Text style={styles.callerName}>
          {astrologerId && astrologerId?.length > 0
            ? astrologerDetails?.name
            : "User"}
        </Text>
        <Text style={styles.callStatus}>Calling...</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            isMuted && { backgroundColor: "#ffcccb" },
          ]}
          onPress={toggleMute}
        >
          <Icon
            name={isMuted ? "mic-off" : "mic"}
            size={30}
            color={isMuted ? "#e63946" : "#000"}
          />
          <Text style={styles.controlText}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            isSpeakerOn && { backgroundColor: "#ccf5ff" },
          ]}
          onPress={toggleSpeaker}
        >
          <Icon
            name={isSpeakerOn ? "volume-high" : "volume-mute"}
            size={30}
            color={isSpeakerOn ? "#0077b6" : "#000"}
          />
          <Text style={styles.controlText}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}
        >
          <Icon name="call" size={30} color="#fff" />
          <Text style={styles.controlText}>End</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: styleConstants.color.primaryColor,
  },
  headerText: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: "#fff",
  },
  profileContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  callerName: {
    fontSize: 22,
    fontFamily: styleConstants.fontFamily,
    marginBottom: 5,
    color: styleConstants.color.textBlackColor,
  },
  callStatus: {
    fontSize: 16,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  controlsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 80,
    height: 80,
    elevation: 4,
  },
  endCallButton: {
    backgroundColor: "#e63946",
  },
  controlText: {
    marginTop: 5,
    fontSize: 14,
    color: "#000",
    fontFamily: styleConstants.fontFamily,
  },
});

export default VoiceCallPage;
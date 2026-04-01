import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Vibration,
  Platform,
  Modal,
} from "react-native";
import Sound from "react-native-sound";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { incomingRequestModalStyle as styles } from "../../styles/incomingRequestModal.style";
import { dummyImageURL, AGORA_APP_ID } from "../../constants";
import { SOCKET_TYPES } from "../../services/socket.types";
import socketServices from "../../hooks/useSocketService";
import {
  removeChatRequestFromList,
  updateAstrologyCallDetails,
  updateAstrologyChatDetails,
  updateChatprofileDetails,
  updateCurrentCallDetails,
} from "../../redux/silces/auth.silce";
import { IAstrologyChatDetails } from "../../redux/redux.constants";
import { CallType, ChatStatus } from "../Chat/astrologyChatUI";
import { RootState } from "../../redux";

Sound.setCategory("Playback");

interface IncomingRequestModalProps {
  isVisible: boolean;
  request: any;
}

const buttonWrapperStyle: any = {
  alignItems: "center",
};

const IncomingRequestModal: React.FC<IncomingRequestModalProps> = ({
  isVisible,
  request,
}) => {
  console.log("IncomingRequestModal render:", {
    isVisible,
    requestId: request?.id,
  });
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const soundRef = useRef<Sound | null>(null);

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId ?? "",
  );

  useEffect(() => {
    if (isVisible) {
      // Start Sound
      soundRef.current = new Sound("bell.mp3", Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        soundRef.current?.setNumberOfLoops(-1);
        soundRef.current?.play();
      });

      // Start Vibration
      const ONE_SECOND_IN_MS = 1000;
      const PATTERN = [
        1 * ONE_SECOND_IN_MS,
        2 * ONE_SECOND_IN_MS,
        3 * ONE_SECOND_IN_MS,
      ];
      Vibration.vibrate(PATTERN, true);
    } else {
      stopAlerts();
    }

    return () => stopAlerts();
  }, [isVisible, request?.id]);

  const stopAlerts = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
    Vibration.cancel();
  };

  const handleAccept = () => {
    if (!request) return;

    stopAlerts();

    if (request.type === "call") {
      const acceptobject = {
        requestId: request.id,
        response: "accepted",
        userId: request.userId,
        astrologerId,
        callType: CallType.voice,
      };
      socketServices.emit(SOCKET_TYPES.callResponse, acceptobject);
    } else {
      dispatch(
        updateChatprofileDetails({
          name: request.userName,
          profilePicture: request.profilePicture,
        }),
      );
      const acceptobject = { requestId: request.id, response: "accepted" };
      socketServices.emit(SOCKET_TYPES.chatResponse, acceptobject);
    }
  };

  const handleReject = () => {
    if (!request) return;

    stopAlerts();

    if (request.type === "call") {
      socketServices.emit(SOCKET_TYPES.callResponse, {
        requestId: request.id,
        response: "rejected",
      });
      dispatch(updateCurrentCallDetails(null));
    } else {
      socketServices.emit(SOCKET_TYPES.chatResponse, {
        requestId: request.id,
        response: "rejected",
      });
    }
    dispatch(removeChatRequestFromList(request.id));
  };

  useEffect(() => {
    const handleChatAccepted = (data: any) => {
      const chatState: IAstrologyChatDetails = {
        roomId: data.roomId,
        chatStartTime: Date.now(),
        timer: Date.now(),
        chatStatus: ChatStatus.accepted,
      };
      dispatch(updateAstrologyChatDetails(chatState));
      socketServices.emit(SOCKET_TYPES.joinRoom, data.roomId);
      navigation.navigate("astrologychat", {
        userId: request?.userId,
      });
      dispatch(removeChatRequestFromList(request?.id));
    };

    const handleCallAccepted = async (data: any) => {
      const astrologerCallDetails = {
        appId: AGORA_APP_ID,
        channelName: request?.channelName,
        clientToken: request?.astrologerToken,
        userUid: request?.userUid,
        astrologerUid: request?.astrologerUid,
        originalUserUid: request?.userUid,
        roomId: data.roomId,
        name: request?.userName,
        profilePicture: request?.profilePicture,
      };
      dispatch(updateAstrologyCallDetails(astrologerCallDetails));
      const chatState: IAstrologyChatDetails = {
        roomId: data.roomId,
        chatStartTime: Date.now(),
        timer: Date.now(),
        chatStatus: ChatStatus.accepted,
      };
      dispatch(updateAstrologyChatDetails(chatState));
      dispatch(removeChatRequestFromList(request?.id));
      navigation.navigate("AstrologerVoiceCallScreen", {
        callDetails: astrologerCallDetails,
      });
    };

    if (isVisible) {
      socketServices.on(SOCKET_TYPES.chatAccepted, handleChatAccepted);
      socketServices.on(SOCKET_TYPES.joinCall, handleCallAccepted);
    }

    return () => {
      socketServices.removeListener(SOCKET_TYPES.chatAccepted);
      socketServices.removeListener(SOCKET_TYPES.joinCall);
    };
  }, [isVisible, request]);

  if (!request) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleReject}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={styles.container}>
          <View style={styles.userInfoContainer}>
            <Image
              source={{ uri: request.profilePicture ?? dummyImageURL }}
              style={styles.profilePicture}
            />
            <Text style={styles.userName}>{request.userName}</Text>
            <Text style={styles.requestType}>
              Incoming {request.type === "call" ? "Voice Call" : "Chat Request"}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleReject}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 25,
                      height: 5,
                      backgroundColor: "#F44336",
                      borderRadius: 2,
                    }}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.buttonText}>Decline</Text>
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={handleAccept}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>
                    {request.type === "call" ? "📞" : "💬"}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.buttonText}>Accept</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IncomingRequestModal;

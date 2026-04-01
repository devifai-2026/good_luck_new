import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  BackHandler,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import socketServices from "../../hooks/useSocketService";
import { SOCKET_TYPES } from "../../services/socket.types";
import { updateAstrologyChatDetails } from "../../redux/silces/auth.silce";
import { ChatStatus } from "../../components/Chat/astrologyChatUI";
import useAgora from "../../hooks/useAgora";
import { AGORA_APP_ID } from "../../constants";
import useAudioPermissions from "../../hooks/useAudioPermissions";
import { prepareAstrologerCallDetails } from "../../services/callHelpers";

const AstrologerVoiceCallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {
    hasAudioPermission,
    requestPermissions,
    isChecking: permissionChecking,
  } = useAudioPermissions();

  const callDetails = useSelector(
    (state: RootState) => state.auth.astrologyCallDetails,
  );
  const chatDetails = useSelector(
    (state: RootState) => state.auth.astrologyChatDetails,
  );
  // const profileDetails = useSelector((state: RootState) => state.auth.chatProfileDetails);

  // const routeCallDetails = route.params?.callDetails;

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const durationRef = useRef<NodeJS.Timeout>();
  const joinAttemptRef = useRef<boolean>(false);

  const {
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleSpeaker,
    setMute,
    setSpeaker,
    isConnected,
    isJoined,
    connectionState,
    remoteAudioTracks,
  } = useAgora();

  // Get the actual call details to use with proper preparation
  const getCallDetails = useCallback(() => {
    const rawDetails = callDetails;

    console.log(
      "🔍 RAW Astrologer Details BEFORE preparation:",
      JSON.stringify(rawDetails, null, 2),
    );

    const preparedDetails = prepareAstrologerCallDetails(rawDetails);

    console.log(
      "🔍 Astrologer Details AFTER preparation:",
      JSON.stringify(preparedDetails, null, 2),
    );

    return preparedDetails;
  }, [callDetails]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Start call timer
  const startTimer = useCallback(() => {
    stopTimer();
    durationRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  // Stop call timer
  const stopTimer = useCallback(() => {
    if (durationRef.current) {
      clearInterval(durationRef.current);
      durationRef.current = undefined;
    }
  }, []);

  // Initialize call function
  const initializeCall = useCallback(async () => {
    if (joinAttemptRef.current) {
      console.log("🔄 Join attempt already in progress");
      return;
    }

    joinAttemptRef.current = true;
    console.log("🎯 AstrologerVoiceCallScreen INITIALIZING CALL");

    const currentCallDetails = getCallDetails();

    if (!currentCallDetails) {
      console.error("❌ No call details available");
      Alert.alert("Error", "Call details not available");
      joinAttemptRef.current = false;
      return;
    }

    console.log(
      "📞 Prepared Astrologer call details:",
      JSON.stringify(currentCallDetails, null, 2),
    );

    // Audio permission check
    const audioGranted = await requestPermissions();
    if (!audioGranted) {
      Alert.alert(
        "Permission Required",
        "Please allow microphone access for voice call",
      );
      joinAttemptRef.current = false;
      return;
    }

    // 🔥 CRITICAL: Use astrologerUid for astrologer
    const astrologerUid = currentCallDetails.astrologerUid;

    if (!astrologerUid || astrologerUid === 0) {
      console.error("❌ INVALID astrologer UID:", astrologerUid);
      Alert.alert("Error", "Invalid astrologer configuration");
      joinAttemptRef.current = false;
      return;
    }

    console.log("🎯 FINAL Astrologer joining with:", {
      astrologerUid: astrologerUid,
      userUidFromData: currentCallDetails.userUid,
      channel: currentCallDetails.channelName,
      tokenExists: !!currentCallDetails.clientToken,
    });

    setIsInitializing(true);

    try {
      const success = await joinChannel(
        AGORA_APP_ID,
        currentCallDetails.clientToken,
        currentCallDetails.channelName,
        astrologerUid, // ✅ 14246
      );

      if (success) {
        console.log(
          "✅ SUCCESS: Astrologer joined channel with UID:",
          astrologerUid,
        );
        setHasJoined(true);
        startTimer();
        await setMute(false);
        await setSpeaker(false);
      } else {
        console.error("❌ FAILED: Astrologer channel join failed");
        Alert.alert("Error", "Failed to establish call connection");
      }
    } catch (error) {
      console.error("❌ ERROR: Astrologer join exception:", error);
      Alert.alert("Error", "Call connection failed");
    } finally {
      setIsInitializing(false);
      joinAttemptRef.current = false;
    }
  }, [
    getCallDetails,
    requestPermissions,
    joinChannel,
    setMute,
    setSpeaker,
    startTimer,
  ]);

  // End call function
  const endCall = useCallback(
    async (sender: "user" | "astrologer") => {
      console.log("📞 Astrologer ending call...");
      stopTimer();
      setHasJoined(false);

      try {
        // Leave Agora channel
        await leaveChannel();

        // Emit end-call event
        socketServices.emit(SOCKET_TYPES.endCall, {
          roomId: chatDetails.roomId,
          sender: sender,
        });

        // Update chat status
        dispatch(
          updateAstrologyChatDetails({
            chatStatus: ChatStatus.idle,
          }),
        );

        console.log("✅ Astrologer call ended successfully");
      } catch (error) {
        console.error("❌ Error astrologer ending call:", error);
      } finally {
        navigation.goBack();
      }
    },
    [stopTimer, leaveChannel, chatDetails.roomId, dispatch, navigation],
  );

  // Handle mute toggle
  const handleToggleMute = async () => {
    if (!hasJoined) return;

    try {
      const success = await toggleMute();
      if (success) {
        setIsMuted(!isMuted);
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  // Handle speaker toggle
  const handleToggleSpeaker = async () => {
    if (!hasJoined) return;

    try {
      const success = await toggleSpeaker();
      if (success) {
        setIsSpeakerOn(!isSpeakerOn);
      }
    } catch (error) {
      console.error("Error toggling speaker:", error);
    }
  };

  // Handle call ended by user
  const handleCallEnded = useCallback(
    (data: any) => {
      console.log("📞 Call ended by user:", data);
      stopTimer();
      setHasJoined(false);

      Alert.alert("Call Ended", "The user ended the call", [
        {
          text: "OK",
          onPress: () => {
            dispatch(
              updateAstrologyChatDetails({
                chatStatus: ChatStatus.idle,
              }),
            );
            navigation.goBack();
          },
        },
      ]);
    },
    [stopTimer, dispatch, navigation],
  );

  // One-time Setup Effect (Mount/Unmount)
  useEffect(() => {
    console.log(
      "🎯 AstrologerVoiceCallScreen mount - roomId:",
      callDetails?.roomId,
    );
    if (socketServices && callDetails?.roomId) {
      console.log(
        "📡 Astrologer listening for callEnd and joining room:",
        callDetails.roomId,
      );
      socketServices.on(SOCKET_TYPES.callEnd, handleCallEnded);

      // 🔥 Join the room to receive call-end events
      socketServices.emit(SOCKET_TYPES.joinRoom, callDetails.roomId);
    } else {
      console.error(
        "⚠️ AstrologerVoiceCallScreen: Missing socketServices or roomId on mount!",
      );
    }

    const backAction = () => {
      Alert.alert("End Call?", "Are you sure you want to end the call?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () => endCall("astrologer"),
          style: "destructive",
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
      console.log("🔄 AstrologerVoiceCallScreen unmounting - Cleaning up");
      stopTimer();
      socketServices.removeListener(SOCKET_TYPES.callEnd);
      backHandler.remove();
      // We don't reset joinAttemptRef here to prevent re-joins on temporary unmounts if that was the issue,
      // but strictly speaking, if we unmount we probably want to reset.
      // However, if the parent re-renders causing unmount/remount, we want to be careful.
      // For now, standard cleanup is fine as long as we don't trigger it unnecessarily.
      joinAttemptRef.current = false;
    };
  }, [callDetails?.roomId]); // Reactive to roomId changes

  // Trigger Initialization Effect
  useEffect(() => {
    // Only try to initialize if we haven't joined effectively, aren't currently initializing,
    // and aren't already connected.

    if (callDetails && !hasJoined && !joinAttemptRef.current && !isJoined) {
      // Small delay to ensure component is properly mounted/stabilized
      const initTimer = setTimeout(() => {
        initializeCall();
      }, 500);

      return () => clearTimeout(initTimer);
    }
  }, [callDetails, hasJoined, isJoined, initializeCall]);

  // Monitor connection state
  useEffect(() => {
    console.log(
      "📊 Astrologer Connection - State:",
      connectionState,
      "Connected:",
      isConnected,
      "Joined:",
      isJoined,
      "Remote Tracks:",
      remoteAudioTracks.length,
    );

    if (isJoined && remoteAudioTracks.length > 0) {
      console.log("🎉 SUCCESS: Audio connection established with user!");
    }
  }, [connectionState, isConnected, isJoined, remoteAudioTracks]);

  // Get connection status text
  const getConnectionStatusText = () => {
    if (permissionChecking) return "Checking Permissions...";
    if (isInitializing) return "Initializing Call...";
    if (!hasJoined) return "Connecting...";
    if (isJoined && remoteAudioTracks.length > 0) return "Connected with User";
    if (isJoined) return "Waiting for User...";
    return `Connecting: ${connectionState}`;
  };

  const currentCallDetails = getCallDetails();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.durationText}>{formatTime(callDuration)}</Text>
        <Text style={styles.statusText}>{getConnectionStatusText()}</Text>
        {hasJoined && (
          <Text style={styles.detailsText}>
            Channel: {currentCallDetails?.channelName?.substring(0, 15)}...
            {isMuted && " • Muted"}
            {isSpeakerOn && " • Speaker"}
          </Text>
        )}
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              callDetails?.profilePicture ||
              "https://via.placeholder.com/120x120/333333/FFFFFF?text=User",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.nameText}>{callDetails?.name || "User"}</Text>
        <Text style={styles.roleText}>User</Text>

        {!currentCallDetails && (
          <Text style={styles.errorText}>No call details available</Text>
        )}
      </View>

      <View style={styles.controlsSection}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            isMuted && styles.controlButtonActive,
            !hasJoined && styles.controlButtonDisabled,
          ]}
          onPress={handleToggleMute}
          disabled={!hasJoined || isInitializing}
        >
          <Icon name={isMuted ? "mic-off" : "mic"} size={30} color="white" />
          <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={() => endCall("astrologer")}
        >
          <Icon name="call-end" size={30} color="white" />
          <Text style={styles.controlText}>End Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            isSpeakerOn && styles.controlButtonActive,
            !hasJoined && styles.controlButtonDisabled,
          ]}
          onPress={handleToggleSpeaker}
          disabled={!hasJoined || isInitializing}
        >
          <Icon
            name={isSpeakerOn ? "volume-up" : "volume-off"}
            size={30}
            color="white"
          />
          <Text style={styles.controlText}>
            {isSpeakerOn ? "Speaker" : "Earpiece"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Debug Info */}
      {__DEV__ && (
        <View style={styles.debugSection}>
          <Text style={styles.debugText}>
            Joined: {isJoined ? "Yes" : "No"} | Connected:{" "}
            {isConnected ? "Yes" : "No"} | Tracks: {remoteAudioTracks.length}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
  },
  durationText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  statusText: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 5,
  },
  detailsText: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 10,
  },
  profileSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  nameText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  roleText: {
    color: "#ccc",
    fontSize: 16,
  },
  controlsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  controlButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#333",
    minWidth: 70,
  },
  controlButtonActive: {
    backgroundColor: "#555",
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  endCallButton: {
    backgroundColor: "#ff3b30",
  },
  controlText: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
  debugSection: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: "center",
  },
  debugText: {
    color: "#666",
    fontSize: 10,
  },
});

export default AstrologerVoiceCallScreen;

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
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootState } from "../../redux";
import useAgora from "../../hooks/useAgora";
import socketServices from "../../hooks/useSocketService";
import { SOCKET_TYPES } from "../../services/socket.types";
import { updateAstrologyChatDetails } from "../../redux/silces/auth.silce";
import { ChatStatus } from "../../components/Chat/astrologyChatUI";
import { AGORA_APP_ID } from "../../constants";
import useAudioPermissions from "../../hooks/useAudioPermissions";
import { prepareUserCallDetails } from "../../services/callHelpers";

const UserVoiceCallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {
    hasAudioPermission,
    requestPermissions,
    isChecking: permissionChecking,
  } = useAudioPermissions();

  const chatDetails = useSelector(
    (state: RootState) => state.auth.astrologyChatDetails,
  );
  const profileDetails = useSelector(
    (state: RootState) => state.auth.currentAstrologerDetails,
  );
  const callDetails = useSelector(
    (state: RootState) => state.auth.userCallDetails,
  );

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
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

  // Get the actual call details to use
  const getCallDetails = useCallback(() => {
    const rawDetails = callDetails;

    console.log(
      "🔍 RAW User Details BEFORE preparation:",
      JSON.stringify(rawDetails, null, 2),
    );

    const preparedDetails = prepareUserCallDetails(rawDetails);

    console.log(
      "🔍 User Details AFTER preparation:",
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
    if (joinAttemptRef.current) return;
    joinAttemptRef.current = true;

    console.log("🎯 UserVoiceCallScreen INITIALIZING CALL");

    // Audio permission first
    const audioGranted = await requestPermissions();
    if (!audioGranted) {
      Alert.alert("Permission Required", "Please allow microphone access");
      joinAttemptRef.current = false;
      return;
    }

    const currentCallDetails = getCallDetails();

    if (!currentCallDetails) {
      console.error("❌ No call details available for user");
      Alert.alert("Error", "Call configuration incomplete");
      joinAttemptRef.current = false;
      return;
    }

    console.log(
      "📞 User call details:",
      JSON.stringify(currentCallDetails, null, 2),
    );

    // STRICT VALIDATION - userUid is critical
    if (
      !currentCallDetails?.channelName ||
      !currentCallDetails?.clientToken ||
      !currentCallDetails?.userUid
    ) {
      console.error("❌ MISSING essential call details for user");
      Alert.alert("Error", "Call configuration incomplete");
      joinAttemptRef.current = false;
      return;
    }

    // User UID - ensure it's correct
    const userUid = parseInt(currentCallDetails.userUid.toString(), 10);

    // Validate UID
    if (!userUid || userUid === 0) {
      console.error("❌ INVALID user UID:", userUid);
      Alert.alert("Error", "Invalid user configuration");
      joinAttemptRef.current = false;
      return;
    }

    console.log("🎯 User joining with:", {
      userUid: userUid, // ✅ 26294
      astrologerUidFromData: currentCallDetails.astrologerUid, // May be fallback
      channel: currentCallDetails.channelName,
    });

    setIsInitializing(true);

    try {
      // Join channel
      const success = await joinChannel(
        AGORA_APP_ID,
        currentCallDetails.clientToken,
        currentCallDetails.channelName,
        userUid, // ✅ 26294
      );

      if (success) {
        console.log("✅ SUCCESS: User joined channel with UID:", userUid);
        setHasJoined(true);
        startTimer();
        await setMute(false);
        await setSpeaker(true);
      } else {
        console.error("❌ FAILED: User channel join failed");
        Alert.alert("Connection Error", "Failed to establish call connection");
      }
    } catch (error) {
      console.error("❌ ERROR: User join exception:", error);
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

  const handleCallError = useCallback(() => {
    dispatch(
      updateAstrologyChatDetails({
        chatStatus: ChatStatus.idle,
      }),
    );
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  }, [dispatch, navigation]);

  const startConnectionMonitoring = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds

    const monitorInterval = setInterval(() => {
      attempts++;
      console.log(
        "🔍 CONNECTION MONITOR - Attempt:",
        attempts,
        "Joined:",
        isJoined,
        "Connected:",
        isConnected,
        "Remote Tracks:",
        remoteAudioTracks.length,
        "State:",
        connectionState,
      );

      if (attempts > maxAttempts && remoteAudioTracks.length === 0) {
        console.log("🔄 No connection after 30 seconds, showing alert...");
        Alert.alert(
          "Connection Issue",
          "Unable to establish audio connection. Please try again.",
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
        clearInterval(monitorInterval);
      }

      if (remoteAudioTracks.length > 0) {
        console.log("🎉 CONNECTION ESTABLISHED - Audio is working!");
        clearInterval(monitorInterval);
      }
    }, 2000);

    return () => clearInterval(monitorInterval);
  }, [isJoined, isConnected, remoteAudioTracks, connectionState, navigation]);

  // End call function
  const endCall = useCallback(async () => {
    console.log("📞 User ending call...");
    stopTimer();
    setHasJoined(false);

    try {
      // Leave Agora channel
      await leaveChannel();

      // Emit end-call event
      socketServices.emit(SOCKET_TYPES.endCall, {
        roomId: callDetails?.roomId || chatDetails.roomId,
        sender: "user",
      });

      // Update chat status
      dispatch(
        updateAstrologyChatDetails({
          chatStatus: ChatStatus.idle,
        }),
      );

      console.log("✅ User call ended successfully");
    } catch (error) {
      console.error("❌ Error ending call:", error);
    } finally {
      navigation.goBack();
    }
  }, [stopTimer, leaveChannel, chatDetails.roomId, dispatch, navigation]);

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

  // Handle call ended by astrologer
  const handleCallEnded = useCallback(
    (data: any) => {
      console.log("📞 Call ended by astrologer:", data);
      stopTimer();
      setHasJoined(false);

      Alert.alert("Call Ended", "The astrologer ended the call", [
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

  // Handle rejoin call
  const handleRejoinCall = useCallback(async () => {
    console.log("🔄 Attempting to rejoin call...");
    const currentCallDetails = getCallDetails();

    if (currentCallDetails) {
      await leaveChannel();

      // Wait a bit before rejoining
      setTimeout(async () => {
        const userUid = parseInt(currentCallDetails.userUid.toString(), 10);
        const success = await joinChannel(
          AGORA_APP_ID,
          currentCallDetails.clientToken,
          currentCallDetails.channelName,
          userUid,
        );

        if (success) {
          console.log("✅ Rejoined channel successfully");
          setHasJoined(true);
        } else {
          console.error("❌ Failed to rejoin channel");
        }
      }, 1000);
    }
  }, [getCallDetails, leaveChannel, joinChannel]);

  // One-time Setup Effect (Mount/Unmount)
  useEffect(() => {
    console.log("🎯 UserVoiceCallScreen mount - roomId:", callDetails?.roomId);
    if (socketServices && callDetails?.roomId) {
      console.log(
        "📡 User listening for callEnd and joining room:",
        callDetails.roomId,
      );
      socketServices.on(SOCKET_TYPES.callEnd, handleCallEnded);
      socketServices.on(SOCKET_TYPES.callError, (error: any) => {
        console.log("Call Error Received:", error);
      });

      // 🔥 Join the room to receive call-end events
      socketServices.emit(SOCKET_TYPES.joinRoom, callDetails.roomId);
    } else {
      console.error(
        "⚠️ UserVoiceCallScreen: Missing socketServices or roomId on mount!",
      );
    }
    // Back Handler to prevent accidental exit
    const backAction = () => {
      Alert.alert("End Call?", "Are you sure you want to end the call?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () => endCall(),
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
      console.log("🔄 UserVoiceCallScreen unmounting - Cleaning up");
      stopTimer();
      socketServices.removeListener(SOCKET_TYPES.callEnd);
      backHandler.remove();
      // Only unmount cleanup - do not reset joinAttemptRef aggressively to prevent loops if parent re-renders
      // but component conceptually stays alive.
      joinAttemptRef.current = false;
    };
  }, [callDetails?.roomId]); // Reactive to roomId changes

  // Trigger Initialization Effect
  useEffect(() => {
    // Only try to initialize if we haven't joined effectively, aren't currently initializing,
    // and aren't already connected.

    // We check if callDetails are valid before trying to init
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
      "📊 User Connection - State:",
      connectionState,
      "Connected:",
      isConnected,
      "Joined:",
      isJoined,
      "Remote Tracks:",
      remoteAudioTracks.length,
    );

    if (isJoined && remoteAudioTracks.length > 0) {
      console.log("🎉 SUCCESS: Audio connection established with astrologer!");
    }
  }, [connectionState, isConnected, isJoined, remoteAudioTracks]);

  // Get connection status text
  const getConnectionStatusText = () => {
    if (permissionChecking) return "Checking Permissions...";
    if (isInitializing) return "Initializing Call...";
    if (!hasJoined) return "Connecting...";
    if (isJoined && remoteAudioTracks.length > 0)
      return "Connected with Astrologer";
    if (isJoined) return "Waiting for Astrologer...";
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
              profileDetails?.profilePicture ||
              "https://via.placeholder.com/120x120/333333/FFFFFF?text=Astrologer",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.nameText}>
          {profileDetails?.name || "Astrologer"}
        </Text>
        <Text style={styles.roleText}>Astrologer</Text>

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
          onPress={endCall}
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

        {/* Debug button */}
        {/* <TouchableOpacity
          style={[styles.controlButton]}
          onPress={() => {
            console.log("🐛 DEBUG INFO:");
            console.log("- Joined:", isJoined);
            console.log("- Connected:", isConnected);
            console.log("- Remote Tracks:", remoteAudioTracks);
            console.log("- Connection State:", connectionState);
            console.log("- Call Details:", currentCallDetails);
            console.log("- Has Joined:", hasJoined);
            console.log("- Has Audio Permission:", hasAudioPermission);
          }}
        >
          <Icon name="bug-report" size={24} color="white" />
          <Text style={styles.controlText}>Debug</Text>
        </TouchableOpacity> */}

        {/* Rejoin button */}
        <TouchableOpacity
          style={[styles.controlButton]}
          onPress={handleRejoinCall}
        >
          <Icon name="refresh" size={24} color="white" />
          <Text style={styles.controlText}>Rejoin</Text>
        </TouchableOpacity>
      </View>

      {/* Debug Info */}
      {/* {__DEV__ && (
        <View style={styles.debugSection}>
          <Text style={styles.debugText}>
            Joined: {isJoined ? "Yes" : "No"} | Connected:{" "}
            {isConnected ? "Yes" : "No"} | Tracks: {remoteAudioTracks.length} |
            State: {connectionState}
          </Text>
        </View>
      )} */}
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
    textTransform: "capitalize",
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
    backgroundColor: "#333",
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
    flexWrap: "wrap",
  },
  controlButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#333",
    minWidth: 70,
    margin: 5,
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

export default UserVoiceCallScreen;

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../redux';
import useAgora from '../../hooks/useAgora';
import socketServices from '../../hooks/useSocketService';
import { SOCKET_TYPES } from '../../services/socket.types';
import { updateAstrologyChatDetails } from '../../redux/silces/auth.silce';
import { ChatStatus } from '../../components/Chat/astrologyChatUI';

const VoiceCallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const chatDetails = useSelector((state: RootState) => state.auth.astrologyChatDetails);
  const profileDetails = useSelector((state: RootState) => state.auth.chatProfileDetails);
  const callDetails = useSelector((state: RootState) => state.auth.currentCallDetails);

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const durationRef = useRef<NodeJS.Timeout>();

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
    remoteAudioTracks
  } = useAgora();

  // Initialize and join channel on mount
  useEffect(() => {
    console.log("VoiceCallScreen mounted - Starting call");
    console.log("Call details:", callDetails);
    
    const initializeCall = async () => {
      if (callDetails) {
        try {
          const success = await joinChannel(
            callDetails.appId,
            callDetails.clientToken,
            callDetails.channelName,
            callDetails.userUid
          );

          if (success) {
            console.log("Successfully joined voice channel");
            startTimer();
            
            // Set initial audio states
            await setMute(false);
            await setSpeaker(true);
          } else {
            console.error("Failed to join voice channel");
            Alert.alert("Error", "Failed to join voice call");
            navigation.goBack();
          }
        } catch (error) {
          console.error("Error joining channel:", error);
          Alert.alert("Error", "Failed to join voice call");
          navigation.goBack();
        }
      } else {
        console.error("No call details available");
        Alert.alert("Error", "Call details not found");
        navigation.goBack();
      }
    };

    initializeCall();

    // Socket listeners
    socketServices.on(SOCKET_TYPES.callEnd, handleCallEnded);

    return () => {
      console.log("VoiceCallScreen unmounting - Cleaning up");
      stopTimer();
      socketServices.removeListener(SOCKET_TYPES.callEnd);
    };
  }, [callDetails]);

  // Monitor connection state and remote audio tracks
  useEffect(() => {
    console.log("Connection state:", connectionState);
    console.log("Is connected:", isConnected);
    console.log("Is joined:", isJoined);
    console.log("Remote audio tracks:", remoteAudioTracks);
    
    if (isConnected && remoteAudioTracks.length > 0) {
      console.log("Audio should be working now");
    }
  }, [connectionState, isConnected, isJoined, remoteAudioTracks]);

  // Start call timer
  const startTimer = () => {
    stopTimer(); // Clear any existing timer
    durationRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Stop call timer
  const stopTimer = () => {
    if (durationRef.current) {
      clearInterval(durationRef.current);
      durationRef.current = undefined;
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // End call function
  const endCall = async () => {
    console.log("Ending call...");
    stopTimer();

    try {
      // Leave Agora channel
      await leaveChannel();

      // Emit end-call event
      socketServices.emit(SOCKET_TYPES.endCall, {
        roomId: chatDetails.roomId,
        sender: 'user'
      });

      // Update chat status
      dispatch(updateAstrologyChatDetails({
        chatStatus: ChatStatus.idle
      }));

      console.log("Call ended successfully");
    } catch (error) {
      console.error("Error ending call:", error);
    } finally {
      // Navigate back
      navigation.goBack();
    }
  };

  // Handle mute toggle
  const handleToggleMute = async () => {
    try {
      const success = await toggleMute();
      if (success) {
        setIsMuted(!isMuted);
      } else {
        console.error("Failed to toggle mute");
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  // Handle speaker toggle
  const handleToggleSpeaker = async () => {
    try {
      const success = await toggleSpeaker();
      if (success) {
        setIsSpeakerOn(!isSpeakerOn);
      } else {
        console.error("Failed to toggle speaker");
      }
    } catch (error) {
      console.error("Error toggling speaker:", error);
    }
  };

  // Handle call ended by astrologer
  const handleCallEnded = (data: any) => {
    console.log("Call ended by astrologer:", data);
    stopTimer();
    
    Alert.alert('Call Ended', 'The astrologer ended the call', [
      {
        text: 'OK',
        onPress: () => {
          dispatch(updateAstrologyChatDetails({
            chatStatus: ChatStatus.idle
          }));
          navigation.goBack();
        }
      }
    ]);
  };

  // Get connection status text
  const getConnectionStatusText = () => {
    if (isConnected && remoteAudioTracks.length > 0) {
      return 'Connected';
    } else if (isConnected) {
      return 'Connecting Audio...';
    }
    return connectionState;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.durationText}>
          {formatTime(callDuration)}
        </Text>
        <Text style={styles.statusText}>
          {getConnectionStatusText()}
        </Text>
        {remoteAudioTracks.length > 0 && (
          <Text style={styles.audioStatusText}>
            Audio connected ({remoteAudioTracks.length} user{remoteAudioTracks.length > 1 ? 's' : ''})
          </Text>
        )}
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri: profileDetails?.profilePicture || 'https://via.placeholder.com/120x120/333333/FFFFFF?text=Astrologer'
          }}
          style={styles.profileImage}
        />
        <Text style={styles.nameText}>
          {profileDetails?.name || 'Astrologer'}
        </Text>
        <Text style={styles.roleText}>Astrologer</Text>
      </View>

      <View style={styles.controlsSection}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleToggleMute}
        >
          <Icon
            name={isMuted ? "mic-off" : "mic"}
            size={30}
            color="white"
          />
          <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}
        >
          <Icon name="call-end" size={30} color="white" />
          <Text style={styles.controlText}>End Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
          onPress={handleToggleSpeaker}
        >
          <Icon
            name={isSpeakerOn ? "volume-up" : "volume-off"}
            size={30}
            color="white"
          />
          <Text style={styles.controlText}>Speaker</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
  },
  durationText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 5,
    textTransform: 'capitalize',
  },
  audioStatusText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 5,
  },
  profileSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#333',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleText: {
    color: '#ccc',
    fontSize: 16,
  },
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#333',
    minWidth: 70,
  },
  controlButtonActive: {
    backgroundColor: '#555',
  },
  endCallButton: {
    backgroundColor: '#ff3b30',
  },
  controlText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
});

export default VoiceCallScreen;
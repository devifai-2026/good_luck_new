// hooks/useAgora.ts
import { useState, useEffect, useRef } from "react";
import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  AudioProfileType,
  AudioScenarioType,
  ErrorCodeType,
} from "react-native-agora";

export interface RemoteAudioTracks {
  uid: number;
  audioTrack: any;
}

const useAgora = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<
    RemoteAudioTracks[]
  >([]);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [connectionState, setConnectionState] =
    useState<string>("disconnected");

  const engineRef = useRef<IRtcEngine | null>(null);

  // Initialize Agora engine
  const initAgoraEngine = async (appId: string): Promise<boolean> => {
    try {
      if (engineRef.current) {
        await destroyEngine();
      }

      const engine = createAgoraRtcEngine();

      // Better configuration for voice calls
      const result = await engine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileCommunication, // Communication mode use করুন
      });

      console.log("🔧 Agora initialize result:", result);

      engineRef.current = engine;

      // Audio settings improve করুন
      await engine.enableAudio();

      // Better audio profile for voice calls
      await engine.setAudioProfile(
        AudioProfileType.AudioProfileDefault,
        AudioScenarioType.AudioScenarioDefault
      );

      // Client role সঠিকভাবে set করুন
      await engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      setupEventListeners(engine);
      console.log("✅ Agora engine initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Error initializing Agora engine:", error);
      return false;
    }
  };

  // Setup event listeners
  const setupEventListeners = (engine: IRtcEngine) => {
    console.log("Setting up Agora event listeners");

    engine.registerEventHandler({
      onJoinChannelSuccess: (connection, elapsed) => {
        console.log(
          "✅ JOIN CHANNEL SUCCESS - Channel:",
          connection.channelId,
          "Elapsed:",
          elapsed
        );
        setIsJoined(true);
        setConnectionState("connected");
      },

      onUserJoined: (connection, uid, elapsed) => {
        console.log(
          "🎯 USER JOINED - UID:",
          uid,
          "In my channel:",
          connection.channelId
        );
        setIsConnected(true);
        setConnectionState("connected");
        addRemoteAudioTrack(uid);
      },

      onUserOffline: (connection, uid, reason) => {
        console.log("❌ USER OFFLINE - UID:", uid, "Reason:", reason);
        removeRemoteAudioTrack(uid);
      },

      onRemoteAudioStateChanged: (connection, uid, state, reason, elapsed) => {
        console.log(
          "🔊 REMOTE AUDIO STATE - UID:",
          uid,
          "State:",
          state,
          "Reason:",
          reason
        );

        if (state === 2) {
          // STARTING
          console.log("🎧 Remote audio starting for:", uid);
        } else if (state === 3) {
          // DECODING (playing)
          console.log("✅ Remote audio playing for:", uid);
          addRemoteAudioTrack(uid);
          setIsConnected(true);
        } else if (state === 0) {
          // STOPPED
          console.log("🔇 Remote audio stopped for:", uid);
          removeRemoteAudioTrack(uid);
        }
      },

      onConnectionStateChanged: (connection, state, reason) => {
        const stateText = getConnectionStateText(state);
        console.log("🔄 CONNECTION STATE:", stateText, "Reason:", reason);
        setConnectionState(stateText);
      },

      onError: (err, msg) => {
        console.error("❌ AGORA ERROR:", err, msg);
        setConnectionState("error");
      },

      onLeaveChannel: (connection, stats) => {
        console.log("🚪 LEFT CHANNEL - Stats:", stats);
        setIsJoined(false);
        setIsConnected(false);
        setConnectionState("disconnected");
        setRemoteAudioTracks([]);
      },
    });
  };

  const getConnectionStateText = (state: number): string => {
    switch (state) {
      case 1:
        return "connecting";
      case 2:
        return "connected";
      case 3:
        return "reconnecting";
      case 5:
        return "failed";
      default:
        return "disconnected";
    }
  };

  const addRemoteAudioTrack = (uid: number) => {
    setRemoteAudioTracks((prev) => {
      if (!prev.find((track) => track.uid === uid)) {
        return [...prev, { uid, audioTrack: null }];
      }
      return prev;
    });
  };

  const removeRemoteAudioTrack = (uid: number) => {
    setRemoteAudioTracks((prev) => prev.filter((track) => track.uid !== uid));
  };

  // Join channel
  const joinChannel = async (
    appId: string,
    token: string,
    channelName: string,
    uid: number,
    onJoinSuccess?: (data: any) => void,
    joinData?: any
  ): Promise<boolean> => {
    try {
      console.log("Joining channel:", { channelName, uid });

      if (!uid || uid === 0) {
        console.error("❌ Invalid UID provided:", uid);
        return false;
      }

      if (isJoined) {
        await leaveChannel();
      }

      const initSuccess = await initAgoraEngine(appId);
      if (!initSuccess || !engineRef.current) {
        throw new Error("Failed to initialize Agora engine");
      }

      // Join channel
      await engineRef.current.joinChannel(token, channelName, uid, {});

      // Enable speakerphone
      await engineRef.current.setEnableSpeakerphone(true);

      console.log("Channel joined successfully");

      // Call success callback IMMEDIATELY without setTimeout
      if (onJoinSuccess && joinData) {
        onJoinSuccess(joinData);
      }

      return true;
    } catch (error) {
      console.error("Error joining channel:", error);
      setConnectionState("error");
      return false;
    }
  };

  // Leave channel
  const leaveChannel = async (): Promise<boolean> => {
    try {
      if (engineRef.current && isJoined) {
        await engineRef.current.leaveChannel();
        setIsJoined(false);
        setIsConnected(false);
        setConnectionState("disconnected");
        setRemoteAudioTracks([]);
        console.log("Channel left successfully");
      }
      return true;
    } catch (error) {
      console.error("Error leaving channel:", error);
      return false;
    }
  };

  // Toggle mute
  const toggleMute = async (): Promise<boolean> => {
    try {
      if (engineRef.current) {
        await engineRef.current.muteLocalAudioStream(!isMuted);
        setIsMuted(!isMuted);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error toggling mute:", error);
      return false;
    }
  };

  // Toggle speaker
  const toggleSpeaker = async (): Promise<boolean> => {
    try {
      if (engineRef.current) {
        await engineRef.current.setEnableSpeakerphone(!isSpeakerOn);
        setIsSpeakerOn(!isSpeakerOn);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error toggling speaker:", error);
      return false;
    }
  };

  // Set mute state
  const setMute = async (mute: boolean): Promise<boolean> => {
    try {
      if (engineRef.current) {
        await engineRef.current.muteLocalAudioStream(mute);
        setIsMuted(mute);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error setting mute:", error);
      return false;
    }
  };

  // Set speaker state
  const setSpeaker = async (speakerOn: boolean): Promise<boolean> => {
    try {
      if (engineRef.current) {
        await engineRef.current.setEnableSpeakerphone(speakerOn);
        setIsSpeakerOn(speakerOn);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error setting speaker:", error);
      return false;
    }
  };

  // Destroy engine
  const destroyEngine = async (): Promise<boolean> => {
    try {
      if (engineRef.current) {
        console.log("🔴 Destroying Agora engine...");
        await leaveChannel();

        // Small delay before release
        await new Promise((resolve) => setTimeout(resolve, 500));

        engineRef.current.release();
        engineRef.current = null;

        console.log("✅ Agora engine destroyed successfully");
      }
      return true;
    } catch (error) {
      console.error("❌ Error destroying engine:", error);
      return false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        destroyEngine();
      }
    };
  }, []);

  return {
    // States
    isConnected,
    isJoined,
    remoteAudioTracks,
    isSpeakerOn,
    isMuted,
    connectionState,

    // Methods
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleSpeaker,
    setMute,
    setSpeaker,
    destroyEngine,
  };
};

export default useAgora;

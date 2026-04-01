// hooks/useAudioPermissions.ts - FIXED VERSION
import { useState, useEffect } from "react";
import { PermissionsAndroid, Platform, Alert, Linking } from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

/**
 * useAudioPermissions
 * - Ensures we always return a boolean (never null)
 * - Handles Android and iOS permission flows robustly
 * - Exposes requestPermissions() which returns true only when microphone access is granted
 */
const useAudioPermissions = () => {
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const requestAndroidPermissions = async (): Promise<boolean> => {
    try {
      console.log("🔊 Starting Android permission request...");

      // First check current status via react-native-permissions (helps with 'blocked' state)
      try {
        const micStatus = await check(PERMISSIONS.ANDROID.RECORD_AUDIO as any);
        console.log("� Android microphone check status:", micStatus);

        if (micStatus === RESULTS.GRANTED) {
          return true;
        }

        if (
          micStatus === RESULTS.BLOCKED ||
          micStatus === RESULTS.UNAVAILABLE
        ) {
          // Let user know and provide a path to settings
          Alert.alert(
            "Microphone Permission Required",
            "Microphone access is blocked or unavailable. Please enable it from settings.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
              { text: "Cancel", style: "cancel" },
            ],
          );
          return false;
        }
      } catch (e) {
        // If check fails, fall back to request flow
        console.warn("⚠️ Permission check failed, falling back to request:", e);
      }

      // Ask for RECORD_AUDIO (MODIFY_AUDIO_SETTINGS is optional)
      const permissions: any[] = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
      ].filter(Boolean); // Filter out undefined permissions

      console.log("📝 Requesting Android permissions:", permissions);

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      console.log("📋 Android permission results:", granted);

      const recordGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
        PermissionsAndroid.RESULTS.GRANTED;

      if (!recordGranted) {
        // Request denied by user
        Alert.alert(
          "Microphone Permission Required",
          "Voice calls require microphone access. Please allow microphone permission to continue.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ],
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Error in Android permission request:", error);
      return false;
    }
  };

  const checkiOSPermissions = async (): Promise<boolean> => {
    try {
      console.log("🔊 Checking iOS microphone permission...");

      const result = await check(PERMISSIONS.IOS.MICROPHONE);
      console.log("📊 iOS microphone status:", result);

      if (result === RESULTS.GRANTED) return true;
      if (result === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
        console.log("📝 iOS permission request result:", requestResult);
        return requestResult === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          "Microphone Permission Required",
          "Microphone access is blocked or unavailable. Please enable it from settings.",
          [
            {
              text: "Open Settings",
              onPress: () => openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ],
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error("❌ Error checking iOS permissions:", error);
      return false;
    }
  };

  const checkAudioPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === "android") {
        return await requestAndroidPermissions();
      } else {
        return await checkiOSPermissions();
      }
    } catch (error) {
      console.error("❌ Error in audio permission check:", error);
      return false;
    }
  };

  useEffect(() => {
    const initPermissions = async () => {
      setIsChecking(true);
      console.log("🎯 Initializing audio permissions...");

      const hasPermission = await checkAudioPermissions();

      console.log("✅ Initial permission result:", hasPermission);
      setHasAudioPermission(Boolean(hasPermission));
      setIsChecking(false);
    };

    initPermissions();
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    console.log("🔄 Manually requesting audio permissions...");
    setIsChecking(true);

    const hasPermission = await checkAudioPermissions();

    console.log("✅ Manual permission result:", hasPermission);
    setHasAudioPermission(Boolean(hasPermission));
    setIsChecking(false);

    return Boolean(hasPermission);
  };

  return {
    hasAudioPermission,
    isChecking,
    requestPermissions,
    checkAudioPermissions: requestPermissions, // Alias for consistency
  };
};

export default useAudioPermissions;

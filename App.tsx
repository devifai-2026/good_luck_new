import React from "react";

import Routes from "./src/routes";

import socketServices from "./src/hooks/useSocketService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./src/redux";
import { SOCKET_TYPES } from "./src/services/socket.types";
import { updateSocketState } from "./src/redux/silces/auth.silce";
import { UserRoleEnum } from "./src/redux/redux.constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OneSignal, LogLevel } from "react-native-onesignal";
import { SIGNAL_APP_ID } from "./src/constants";
import { SafeAreaView } from "react-native";

function App(): React.JSX.Element {
  // notification

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  // Initialize with your OneSignal App ID
  OneSignal.initialize(SIGNAL_APP_ID);
  // Use this method to prompt for push notifications.
  // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
  OneSignal.Notifications.requestPermission(false);
  const dispatch = useDispatch();
  const updateSocket = () => {
    dispatch(updateSocketState());
  };

  const role = useSelector((state: RootState) => state.auth.userDetails?.role);

  const userId =
    useSelector((state: RootState) => state.auth.userDetails?.userID) ?? "";
  React.useEffect(() => {
    if (
      socketServices.socketId?.length === 0 &&
      (role === UserRoleEnum.user || role === UserRoleEnum.affiliateMarketer)
    ) {
      socketServices.initializeSocket(() => {
        console.log("Socket connected, registering user:", userId);
        if (userId) {
          socketServices.emit(SOCKET_TYPES.registerUser, userId);
        }
      });
    } else if (userId && socketServices.isConnected()) {
      // If already connected but userId changed or component re-mounted
      socketServices.emit(SOCKET_TYPES.registerUser, userId);
    }
  }, [userId, socketServices]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <SafeAreaView> */}
      <Routes />
      {/* </SafeAreaView> */}
    </GestureHandlerRootView>
  );
}

export default App;

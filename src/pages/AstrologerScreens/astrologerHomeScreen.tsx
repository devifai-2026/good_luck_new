import React, { useEffect, useState } from "react";

import { Alert, BackHandler, Text, TouchableOpacity, View } from "react-native";
import { astrologerHomeScreenStyle } from "../../styles/astrologerHomeScreen.style";
import RequestList from "../../components/User/requestListing";
import AstrologerHomeScreenLayout from "../../components/Layouts/astrologerHomeLayout";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { UserRoleEnum } from "../../redux/redux.constants";
import socketServices from "../../hooks/useSocketService";
import { SOCKET_TYPES } from "../../services/socket.types";
import { dummyImageURL } from "../../constants";
import {
  addNewCallRequestInList,
  addNewChatRequestinList,
  logOut,
  updateCurrentCallDetails,
} from "../../redux/silces/auth.silce";
import NoDataComponent from "../../components/User/noDataComponent";
import { Button } from "react-native-paper";
import { withdrawRequest } from "../../services";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import IncomingRequestModal from "../../components/User/IncomingRequestModal";

const AstrologerHomeScreen = ({ navigation }: { navigation: any }) => {
  const astrologerId =
    useSelector((state: RootState) => state.auth.userDetails?.astrologerId) ??
    "";

  const wallet = useSelector((state: RootState) => state.auth.wallet);

  const isAstrologerVerified =
    useSelector(
      (state: RootState) => state.auth.userDetails?.isAstrologerVerified,
    ) ?? "";

  const claimPayment = async () => {
    if (wallet?.balance < 600) {
      notifyMessage("You can withdraw only if balance is greater than 600");
      return;
    }

    try {
      const response = await withdrawRequest({
        astrologerId,
        amount: wallet?.balance,
      });
      if (response) {
        notifyMessage("Withdraw request sent successfully");
      }
    } catch (error) {
      notifyMessage("Failed to withdraw");
    }
  };
  const dispstch = useDispatch();

  const { getWalletBalance } = useAstrologyServices();

  const astrologerChatRequests = useSelector(
    (state: RootState) => state.auth.astrologerChatRequests,
  );
  useEffect(() => {
    if (astrologerId?.length > 0)
      getWalletBalance(astrologerId, UserRoleEnum.astrologer);
  }, [astrologerId]);

  const handleNewChatRequests = (newReq: any) => {
    console.log(newReq, "new chat request");
    dispstch(
      addNewChatRequestinList({
        id: newReq?.requestId,
        userName: newReq?.Fname ? `${newReq?.Fname} ${newReq?.Lname}` : "User",
        profilePicture: newReq?.profile_picture ?? dummyImageURL,
        lastMessage: newReq?.lastMessage ?? "",
        userId: newReq?.userId,
        time: Date.now(),
        type: "chat",
      }),
    );
  };

  const handleNewCallRequests = (newReq: any) => {
    console.log(newReq, "new call request");
    dispstch(
      addNewChatRequestinList({
        id: newReq?.requestId,
        userName: newReq?.Fname ? `${newReq?.Fname} ${newReq?.Lname}` : "User",
        profilePicture: newReq?.profile_picture ?? dummyImageURL,
        lastMessage: newReq?.lastMessage ?? "",
        userId: newReq?.userId,
        time: Date.now(),
        type: "call",
        channelName: newReq?.channelName,
        userUid: newReq?.userUid,
        astrologerUid: newReq?.astrologerUid,
        clientToken: newReq?.clientToken,
        astrologerToken: newReq?.astrologerToken,
      }),
    );
  };

  useEffect(() => {
    if (socketServices.socketId?.length === 0) {
      socketServices.initializeSocket();
      // socketServices.emit(SOCKET_TYPES.registerAstrologer, astrologerId);
    }
    if (astrologerId?.length > 0 && socketServices) {
      socketServices.emit(SOCKET_TYPES.registerAstrologer, astrologerId);

      socketServices.on(
        SOCKET_TYPES.callRequestFromUser,
        handleNewCallRequests,
      );

      socketServices.on(
        SOCKET_TYPES.chatRequestFromUser,
        handleNewChatRequests,
      );
    }
  }, [astrologerId, socketServices]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true; // prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove(); // cleanup on unmount
  }, []);

  const latestRequest = astrologerChatRequests?.[0] || null;
  console.log("astrologerChatRequests length:", astrologerChatRequests?.length);
  console.log("latestRequest:", latestRequest?.id, latestRequest?.userName);

  return astrologerId?.length > 0 ? (
    <>
      <IncomingRequestModal
        isVisible={!!latestRequest}
        request={latestRequest}
      />
      <AstrologerHomeScreenLayout>
        <View style={astrologerHomeScreenStyle.content}>
          <View style={astrologerHomeScreenStyle.container}>
            <View style={astrologerHomeScreenStyle.balanceContainer}>
              <Text style={astrologerHomeScreenStyle.balanceText}>
                Available Balance
              </Text>
              <Text style={astrologerHomeScreenStyle.amountText}>
                {`₹${Number(wallet?.balance ?? 0).toFixed(2)}`}
              </Text>
              <Button
                onPress={() => {
                  if (astrologerId?.length > 0)
                    getWalletBalance(astrologerId, UserRoleEnum.astrologer);
                }}
              >
                Refresh
              </Button>
            </View>
            <View style={astrologerHomeScreenStyle.buttonContainer}>
              <TouchableOpacity
                style={astrologerHomeScreenStyle.withdrawButton}
                onPress={claimPayment}
              >
                <Text style={astrologerHomeScreenStyle.withdrawText}>
                  Withdraw
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={astrologerHomeScreenStyle.requestTitleText}>
              New Requests
            </Text>

            {astrologerChatRequests?.length === 0 ? (
              <View style={{ height: "65%" }}>
                <NoDataComponent message="No chat or call request" />
              </View>
            ) : (
              <View style={astrologerHomeScreenStyle.requestList}>
                <RequestList messages={astrologerChatRequests} />
              </View>
            )}
          </View>
        </View>
      </AstrologerHomeScreenLayout>
    </>
  ) : (
    <View style={astrologerHomeScreenStyle.unverifiedContainer}>
      <Text style={astrologerHomeScreenStyle.unverifiedText}>
        You are not verified.
      </Text>
      {/* <TouchableOpacity
        style={astrologerHomeScreenStyle.verifyButton}
        onPress={() => {}}
      >
        <Text style={astrologerHomeScreenStyle.verifyButtonText}>
          Check status
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={astrologerHomeScreenStyle.verifyButton}
        onPress={() => {
          dispstch(logOut());
        }}
      >
        <Text style={astrologerHomeScreenStyle.verifyButtonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AstrologerHomeScreen;

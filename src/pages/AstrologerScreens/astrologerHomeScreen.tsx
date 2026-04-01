import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { astrologerHomeScreenStyle as styles } from "../../styles/astrologerHomeScreen.style";
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
  addNewChatRequestinList,
  logOut,
  updateCurrentCallDetails,
} from "../../redux/silces/auth.silce";
import NoDataComponent from "../../components/User/noDataComponent";
import { withdrawRequest } from "../../services";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import IncomingRequestModal from "../../components/User/IncomingRequestModal";

const AstrologerHomeScreen = ({ navigation }: { navigation: any }) => {
  const astrologerId =
    useSelector((state: RootState) => state.auth.userDetails?.astrologerId) ?? "";

  const wallet = useSelector((state: RootState) => state.auth.wallet);

  const promocode = useSelector(
    (state: RootState) => state.auth.userDetails?.promocode,
  );

  const dispatch = useDispatch();
  const { getWalletBalance } = useAstrologyServices();
  const [refreshing, setRefreshing] = useState(false);

  const astrologerChatRequests = useSelector(
    (state: RootState) => state.auth.astrologerChatRequests,
  );

  useEffect(() => {
    if (astrologerId?.length > 0)
      getWalletBalance(astrologerId, UserRoleEnum.astrologer);
  }, [astrologerId]);

  const sharePromoCode = async () => {
    if (!promocode) return;
    try {
      await Share.share({
        message: `Use my promo code *${promocode}* on Good Luck to get an exclusive discount on astrology consultations!`,
      });
    } catch {
      notifyMessage("Could not share promo code");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (astrologerId?.length > 0) {
      await getWalletBalance(astrologerId, UserRoleEnum.astrologer);
    }
    setRefreshing(false);
  }, [astrologerId]);

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
      if (response) notifyMessage("Withdraw request sent successfully");
    } catch (error) {
      notifyMessage("Failed to withdraw");
    }
  };

  const handleNewChatRequests = (newReq: any) => {
    console.log(newReq, "new chat request");
    dispatch(
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
    dispatch(
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
    }
    if (astrologerId?.length > 0 && socketServices) {
      socketServices.emit(SOCKET_TYPES.registerAstrologer, astrologerId);
      socketServices.on(SOCKET_TYPES.callRequestFromUser, handleNewCallRequests);
      socketServices.on(SOCKET_TYPES.chatRequestFromUser, handleNewChatRequests);
    }
  }, [astrologerId, socketServices]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  const latestRequest = astrologerChatRequests?.[0] || null;

  return astrologerId?.length > 0 ? (
    <>
      <IncomingRequestModal isVisible={!!latestRequest} request={latestRequest} />
      <AstrologerHomeScreenLayout>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FD7A5B"]}
              tintColor="#FD7A5B"
            />
          }
        >
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceCardTop}>
              <View style={styles.balanceLabelRow}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={18}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.balanceLabel}>Available Balance</Text>
              </View>
              <TouchableOpacity
                style={styles.refreshIconButton}
                onPress={() => {
                  if (astrologerId?.length > 0)
                    getWalletBalance(astrologerId, UserRoleEnum.astrologer);
                }}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={22}
                  color="rgba(255,255,255,0.9)"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.amountText}>
              {`₹${Number(wallet?.balance ?? 0).toFixed(2)}`}
            </Text>

            <View style={styles.balanceCardBottom}>
              <Text style={styles.minWithdrawNote}>Min. withdrawal ₹600</Text>
              <TouchableOpacity style={styles.withdrawButton} onPress={claimPayment}>
                <Text style={styles.withdrawText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Promo Code Card */}
          {!!promocode && (
            <View style={styles.promoCard}>
              <View style={styles.promoCardLeft}>
                <MaterialCommunityIcons name="tag-outline" size={20} color="#FD7A5B" />
                <View style={styles.promoTextGroup}>
                  <Text style={styles.promoLabel}>Your Promo Code</Text>
                  <Text style={styles.promoCode}>{promocode}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.shareButton} onPress={sharePromoCode}>
                <MaterialCommunityIcons name="share-variant" size={16} color="#FD7A5B" />
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Requests Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.requestTitleText}>New Requests</Text>
            {astrologerChatRequests?.length > 0 && (
              <View style={styles.requestBadge}>
                <Text style={styles.requestBadgeText}>
                  {astrologerChatRequests.length}
                </Text>
              </View>
            )}
          </View>

          {astrologerChatRequests?.length === 0 ? (
            <View style={styles.emptyContainer}>
              <NoDataComponent message="No chat or call requests" />
            </View>
          ) : (
            <View style={styles.requestList}>
              <RequestList messages={astrologerChatRequests} scrollEnabled={false} />
            </View>
          )}
        </ScrollView>
      </AstrologerHomeScreenLayout>
    </>
  ) : (
    <View style={styles.unverifiedContainer}>
      <MaterialCommunityIcons
        name="account-clock-outline"
        size={80}
        color="#FD7A5B"
        style={styles.unverifiedIcon}
      />
      <Text style={styles.unverifiedText}>Account Not Verified</Text>
      <Text style={styles.unverifiedSubText}>
        Your account is pending verification. Please check back later.
      </Text>
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => dispatch(logOut())}
      >
        <Text style={styles.verifyButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AstrologerHomeScreen;

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AstrologerReviewCard from "../../components/User/astrologerReviewCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { styleConstants } from "../../styles/constants";
import socketServices from "../../hooks/useSocketService";
import { SOCKET_TYPES } from "../../services/socket.types";
import {
  CallType,
  ChatStatus,
  ChatType,
} from "../../components/Chat/astrologyChatUI";
import { IAstrologyChatDetails } from "../../redux/redux.constants";
import {
  updateAstrologyChatDetails,
  updateChatprofileDetails,
  updateCurrentCallDetails,
  updateUserCallDetails,
} from "../../redux/silces/auth.silce";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import LoaderModal from "../../components/Shared/lodarModal";
import useAgora from "../../hooks/useAgora";
import { AGORA_APP_ID } from "../../constants";
import { ActivityIndicator } from "react-native-paper";
import ReviewModal from "../../components/Shared/reviewModal";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import NoDataComponent from "../../components/User/noDataComponent";
import { getSpecalizationNameById } from "../../redux/utils";

const PRIMARY = styleConstants.color.primaryColor;
const FONT = styleConstants.fontFamily;

export default function AstrologerProfilePage() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showReviewModal, setshowReviewModal] = useState<boolean>(false);

  const astrologerDetails = useSelector(
    (state: RootState) => state.auth.currentAstrologerDetails,
  );
  const chatStatus = useSelector(
    (state: RootState) => state.auth.astrologyChatDetails.chatStatus,
  );
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID,
  );
  const astrologerId = useSelector(
    (state: RootState) => state.auth?.currentAstrologerDetails?.id,
  );
  const reviews = useSelector((state: RootState) => state.auth.astroloReview);
  const userWallet = useSelector(
    (state: RootState) => state.auth.userDetails?.wallet,
  );
  const astrologerCategories = useSelector(
    (state: RootState) => state.auth.astrologerCategories,
  );
  const callDetails = useSelector(
    (state: RootState) => state.auth.astrologyCallDetails,
  );

  const { joinChannel, leaveChannel } = useAgora();
  const { getRatingReviewById, loading } = useAstrologyServices();

  const callDetailsRef = useRef(callDetails);
  const astrologerDetailsRef = useRef(astrologerDetails);
  const astrologerIdRef = useRef(astrologerId);

  useEffect(() => { callDetailsRef.current = callDetails; }, [callDetails]);
  useEffect(() => { astrologerDetailsRef.current = astrologerDetails; }, [astrologerDetails]);
  useEffect(() => { astrologerIdRef.current = astrologerId; }, [astrologerId]);

  // Auto-trigger chat or call if navigated from card buttons
  useEffect(() => {
    const autoAction = route.params?.autoAction;
    if (!autoAction) return;
    const timer = setTimeout(() => {
      if (autoAction === "chat") handleRequestChat();
      else if (autoAction === "call") handleRequestCall();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleChatAccepted = (data: any) => {
    if (isNavigating) return;
    try {
      setIsNavigating(true);
      const currentAstrologerDetails = astrologerDetailsRef.current;
      const currentAstrologerId = astrologerIdRef.current;
      const chatState: IAstrologyChatDetails = {
        roomId: data.roomId,
        chatStartTime: Date.now(),
        timer: Date.now(),
        chatStatus: ChatStatus.accepted,
      };
      dispatch(updateChatprofileDetails({
        name: currentAstrologerDetails?.name,
        profilePicture: currentAstrologerDetails?.image,
      }));
      dispatch(updateAstrologyChatDetails(chatState));
      socketServices.emit(SOCKET_TYPES.joinRoom, data.roomId);
      navigation.navigate("astrologychat", { astrologerId: currentAstrologerId });
    } catch (error) {
      notifyMessage("Could not join the chat");
      dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.idle }));
    } finally {
      setIsNavigating(false);
    }
  };

  const handleCallDetails = (data: any) => {
    const details = {
      ...data,
      appId: AGORA_APP_ID,
      userUid: parseInt(data.userUid?.toString(), 10),
      astrologerUid: parseInt(data.astrologerUid?.toString(), 10),
    };
    dispatch(updateCurrentCallDetails(details));
  };

  const handleChatRejected = () => {
    dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.rejected }));
    notifyMessage("Chat request rejected.");
  };

  const handleChatError = (data: any) => {
    dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.error }));
    notifyMessage(data?.message ?? "Could not start the chat");
  };

  const handleRequestChat = () => {
    if (astrologerDetails?.status === "busy") {
      notifyMessage("Astrologer is currently busy.");
      return;
    }
    const chatPrice = astrologerDetails?.price || astrologerDetails?.chat_price || 100;
    if (userWallet?.balance < chatPrice) {
      notifyMessage("Insufficient balance for chat.");
      return;
    }
    dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.waiting }));
    socketServices.emit(SOCKET_TYPES.chatRequested, {
      userId,
      astrologerId,
      chatType: ChatType.text,
    });
  };

  const handleRequestCall = () => {
    if (astrologerDetails?.status === "busy") {
      notifyMessage("Astrologer is currently busy.");
      return;
    }
    const callPrice = astrologerDetails?.callPrice || astrologerDetails?.call_price || 200;
    if (userWallet?.balance < callPrice) {
      notifyMessage("Insufficient balance for voice call.");
      return;
    }
    const channelId = `voicecall_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userUid = parseInt(Math.floor(Math.random() * 100000).toString(), 10);
    dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.waiting }));
    socketServices.emit(SOCKET_TYPES.callRequest, {
      userId,
      astrologerId,
      callType: CallType.voice,
      channelId,
      userUid,
    });
  };

  const handleCallAccepted = async (data: any) => {
    if (isNavigating) return;
    try {
      setIsNavigating(true);
      const currentCallDetails = callDetailsRef.current;
      if (currentCallDetails) {
        const userCallDetails = {
          appId: AGORA_APP_ID,
          channelName: currentCallDetails.channelName,
          clientToken: currentCallDetails.clientToken,
          userUid: currentCallDetails.userUid,
          astrologerUid: currentCallDetails.astrologerUid,
          roomId: data.roomId,
        };
        dispatch(updateUserCallDetails(userCallDetails));
        dispatch(updateAstrologyChatDetails({
          roomId: data.roomId,
          chatStartTime: Date.now(),
          timer: Date.now(),
          chatStatus: ChatStatus.accepted,
        }));
        navigation.navigate("UserVoiceCallScreen");
      } else {
        notifyMessage("Call details not found. Please try again.");
        dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.idle }));
      }
    } catch (error) {
      notifyMessage("Could not join the call");
      dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.idle }));
    } finally {
      setIsNavigating(false);
    }
  };

  const handleCallRejected = (data: any) => {
    dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.rejected }));
    notifyMessage(data?.message || "Call rejected by astrologer");
  };

  const handleCallError = (data: any) => {
    dispatch(updateAstrologyChatDetails({ chatStatus: ChatStatus.idle }));
    notifyMessage(data?.message ?? "Could not start the call");
  };

  useEffect(() => {
    socketServices.on(SOCKET_TYPES.chatAccepted, handleChatAccepted);
    socketServices.on(SOCKET_TYPES.chatRejected, handleChatRejected);
    socketServices.on(SOCKET_TYPES.chatError, handleChatError);
    socketServices.on(SOCKET_TYPES.callDetails, handleCallDetails);
    socketServices.on(SOCKET_TYPES.joinCall, handleCallAccepted);
    socketServices.on(SOCKET_TYPES.callRejected, handleCallRejected);
    socketServices.on(SOCKET_TYPES.callError, handleCallError);
    return () => {
      socketServices.removeListener(SOCKET_TYPES.chatAccepted);
      socketServices.removeListener(SOCKET_TYPES.chatRejected);
      socketServices.removeListener(SOCKET_TYPES.chatError);
      socketServices.removeListener(SOCKET_TYPES.callDetails);
      socketServices.removeListener(SOCKET_TYPES.joinCall);
      socketServices.removeListener(SOCKET_TYPES.callRejected);
      socketServices.removeListener(SOCKET_TYPES.callError);
    };
  }, []);

  useEffect(() => {
    if (astrologerId) getRatingReviewById(astrologerId);
  }, [astrologerId]);

  const getChatPrice = () => astrologerDetails?.price || astrologerDetails?.chat_price || 100;
  const getCallPrice = () => astrologerDetails?.callPrice || astrologerDetails?.call_price || 200;

  const isOnline = astrologerDetails?.status === "Online";

  if (chatStatus === ChatStatus.waiting) {
    return (
      <LoaderModal
        visible={true}
        text="Wait until your astrologer accepts your request"
      />
    );
  }

  if (showReviewModal) {
    return <ReviewModal visible={showReviewModal} onClose={setshowReviewModal} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      {/* ── Hero ── */}
      <View style={styles.hero}>
        {/* Decorative circles */}
        <View style={styles.heroBubble1} />
        <View style={styles.heroBubble2} />

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarRing}>
          <Image
            source={{ uri: astrologerDetails?.image }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? "#4CAF50" : "#F44336" }]} />
        </View>

        {/* Name + status */}
        <Text style={styles.heroName}>{astrologerDetails?.name}</Text>
        <View style={[styles.statusPill, { backgroundColor: isOnline ? "rgba(76,175,80,0.2)" : "rgba(244,67,54,0.2)" }]}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? "#4CAF50" : "#F44336" }]} />
          <Text style={[styles.statusText, { color: isOnline ? "#4CAF50" : "#F44336" }]}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      {/* ── Stats Bar ── */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>
            {astrologerDetails?.rating > 0 ? astrologerDetails?.rating?.toFixed(1) : "—"}
          </Text>
          <View style={styles.statLabelRow}>
            <MaterialCommunityIcons name="star" size={12} color="#FFB800" />
            <Text style={styles.statLabel}> Rating</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{astrologerDetails?.orders ?? 0}</Text>
          <Text style={styles.statLabel}>Consultations</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{astrologerDetails?.yearsOfExperience ?? 0}</Text>
          <Text style={styles.statLabel}>Yrs Exp.</Text>
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Specializations */}
        {Array.isArray(astrologerDetails?.specialisation) && astrologerDetails.specialisation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specializations</Text>
            <View style={styles.chipsRow}>
              {astrologerDetails.specialisation.map((item: string, i: number) => (
                <View key={i} style={[styles.chip, styles.chipSpecial]}>
                  <Text style={styles.chipSpecialText}>
                    {getSpecalizationNameById(item, astrologerCategories ?? [])}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {Array.isArray(astrologerDetails?.language) && astrologerDetails.language.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.chipsRow}>
              {astrologerDetails.language.map((item: string, i: number) => (
                <View key={i} style={[styles.chip, styles.chipLang]}>
                  <MaterialCommunityIcons name="translate" size={12} color="#5C6BC0" />
                  <Text style={styles.chipLangText}> {item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* About */}
        {!!astrologerDetails?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{astrologerDetails.description}</Text>
          </View>
        )}

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity
              style={styles.writeReviewBtn}
              onPress={() => setshowReviewModal(true)}
            >
              <MaterialCommunityIcons name="pencil-outline" size={14} color={PRIMARY} />
              <Text style={styles.writeReviewText}> Write Review</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={PRIMARY} size="small" style={{ marginTop: 20 }} />
          ) : reviews?.length === 0 ? (
            <NoDataComponent message="No reviews yet" />
          ) : (
            reviews?.map((review: any, index: number) => (
              <AstrologerReviewCard
                key={index}
                clientImage={review.clientImage}
                clientName={review.clientName}
                reviewText={review.reviewText}
                rating={review.rating}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* ── Sticky Bottom Action Bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatButton} onPress={handleRequestChat} activeOpacity={0.85}>
          <Image
            source={require("../../assets/AstrologerText1.png")}
            style={styles.actionIcon}
          />
          <View>
            <Text style={styles.btnLabel}>Chat</Text>
            <Text style={styles.btnPrice}>₹{getChatPrice()}/min</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callButton} onPress={handleRequestCall} activeOpacity={0.85}>
          <Image
            source={require("../../assets/AstrologerCall1.png")}
            style={styles.actionIcon}
          />
          <View>
            <Text style={[styles.btnLabel, { color: PRIMARY }]}>Call</Text>
            <Text style={[styles.btnPrice, { color: PRIMARY }]}>₹{getCallPrice()}/min</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  // Hero
  hero: {
    backgroundColor: PRIMARY,
    paddingTop: 52,
    paddingBottom: 28,
    alignItems: "center",
    overflow: "hidden",
  },
  heroBubble1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -60,
    right: -40,
  },
  heroBubble2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -30,
    left: 30,
  },
  backBtn: {
    position: "absolute",
    top: 14,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: PRIMARY,
  },
  heroName: {
    fontSize: 22,
    fontFamily: FONT,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONT,
    fontWeight: "600",
  },

  // Stats
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: 18,
    fontFamily: FONT,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONT,
    color: "#888",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#EEE",
    marginVertical: 4,
  },

  // Scroll
  scroll: {
    flex: 1,
    marginTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  writeReviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  writeReviewText: {
    fontSize: 13,
    fontFamily: FONT,
    fontWeight: "600",
    color: PRIMARY,
  },

  // Chips
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  chipSpecial: {
    backgroundColor: "rgba(216,82,120,0.12)",
  },
  chipSpecialText: {
    fontSize: 13,
    fontFamily: FONT,
    color: "#D85278",
    fontWeight: "600",
  },
  chipLang: {
    backgroundColor: "rgba(92,107,192,0.12)",
  },
  chipLangText: {
    fontSize: 13,
    fontFamily: FONT,
    color: "#5C6BC0",
    fontWeight: "600",
  },

  // Description
  description: {
    fontSize: 14,
    fontFamily: FONT,
    color: "#555",
    lineHeight: 22,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 10,
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: PRIMARY,
    paddingVertical: 13,
    borderRadius: 14,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  actionIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  btnLabel: {
    fontSize: 14,
    fontFamily: FONT,
    fontWeight: "700",
    color: "#fff",
  },
  btnPrice: {
    fontSize: 12,
    fontFamily: FONT,
    color: "rgba(255,255,255,0.8)",
  },
});

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { IAstrologer } from "./astrologerList";
import { useDispatch } from "react-redux";
import { updateActiveAstrologerDetail } from "../../redux/silces/auth.silce";
import { styleConstants } from "../../styles/constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PRIMARY = styleConstants.color.primaryColor;

interface AstrologerCardProps {
  astrologer: IAstrologer;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({ astrologer }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const isOnline = astrologer.status === "Online";
  const languages = astrologer.language?.slice(0, 2).join(", ") ?? "";

  const handlePress = () => {
    dispatch(updateActiveAstrologerDetail(astrologer));
    navigation.navigate("astrologerProfilePage");
  };

  const handleChat = () => {
    dispatch(updateActiveAstrologerDetail(astrologer));
    navigation.navigate("astrologerProfilePage", { autoAction: "chat" });
  };

  const handleCall = () => {
    dispatch(updateActiveAstrologerDetail(astrologer));
    navigation.navigate("astrologerProfilePage", { autoAction: "call" });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.card}>
      {/* Avatar + status */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: astrologer?.image }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={[styles.statusDot, { backgroundColor: isOnline ? "#4CAF50" : "#F44336" }]} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        {/* Name + status pill */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{astrologer.name}</Text>
          <View style={[styles.statusPill, { backgroundColor: isOnline ? "#E8F5E9" : "#FFEBEE" }]}>
            <Text style={[styles.statusText, { color: isOnline ? "#4CAF50" : "#F44336" }]}>
              {astrologer.status}
            </Text>
          </View>
        </View>

        {/* Specialization */}
        {!!astrologer.description && (
          <Text style={styles.specialization} numberOfLines={1}>
            {astrologer.description}
          </Text>
        )}

        {/* Languages */}
        {!!languages && (
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="translate" size={13} color="#888" />
            <Text style={styles.metaText}>{languages}</Text>
          </View>
        )}

        {/* Stats row */}
        <View style={styles.statsRow}>
          {/* Rating */}
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star" size={13} color="#FFB800" />
            <Text style={styles.statValue}>{astrologer.rating?.toFixed(1) ?? "N/A"}</Text>
          </View>
          <View style={styles.dot} />
          {/* Orders */}
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={13} color="#888" />
            <Text style={styles.statValue}>{astrologer.orders ?? 0} Orders</Text>
          </View>
          <View style={styles.dot} />
          {/* Experience */}
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="briefcase-outline" size={13} color="#888" />
            <Text style={styles.statValue}>{astrologer.yearsOfExperience ?? 0} Yrs</Text>
          </View>
        </View>

        {/* Footer: prices + buttons */}
        <View style={styles.footer}>
          <View>
            <View style={styles.priceRow}>
              <MaterialCommunityIcons name="chat-outline" size={12} color={PRIMARY} />
              <Text style={styles.price}> ₹{astrologer.price}/min</Text>
            </View>
            <View style={styles.priceRow}>
              <MaterialCommunityIcons name="phone-outline" size={12} color="#888" />
              <Text style={styles.callPrice}> ₹{astrologer.callPrice ?? astrologer.price}/min</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleChat}
              style={[styles.actionBtn, styles.chatBtn]}
            >
              <MaterialCommunityIcons name="chat-outline" size={14} color="#FFF" />
              <Text style={styles.actionBtnText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCall}
              style={[styles.actionBtn, styles.callBtn]}
            >
              <MaterialCommunityIcons name="phone-outline" size={14} color={PRIMARY} />
              <Text style={[styles.actionBtnText, { color: PRIMARY }]}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "flex-start",
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: "rgba(253,122,91,0.25)",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontFamily: "Poppins-Light",
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Poppins-Light",
    fontWeight: "600",
  },
  specialization: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: "#666",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: "#888",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: "#555",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CCC",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 13,
    fontFamily: "Poppins-Light",
    fontWeight: "700",
    color: PRIMARY,
  },
  callPrice: {
    fontSize: 13,
    fontFamily: "Poppins-Light",
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  chatBtn: {
    backgroundColor: PRIMARY,
  },
  callBtn: {
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    fontWeight: "600",
    color: "#FFF",
  },
});

export default AstrologerCard;

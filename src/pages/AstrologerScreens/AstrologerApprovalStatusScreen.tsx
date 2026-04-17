import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/silces/auth.silce";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { getAstrologerRequestStatus } from "../../services";
import { RootState } from "../../redux";

interface Props {
  navigation: any;
  route: {
    params: {
      status: "pending" | "rejected" | "approved";
      rejectionMessage?: string;
    };
  };
}

const AstrologerApprovalStatusScreen = ({ navigation, route }: Props) => {
  const dispatch = useDispatch();
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.underScoreId
  );

  const { status: initialStatus, rejectionMessage: initialRejectionMessage } =
    route?.params ?? { status: "pending", rejectionMessage: "" };

  const [status, setStatus] = useState<"pending" | "rejected" | "approved">(initialStatus);
  const [rejectionMessage, setRejectionMessage] = useState(
    initialRejectionMessage ?? ""
  );
  const [refreshing, setRefreshing] = useState(false);

  const isPending = status === "pending";
  const isApproved = status === "approved";

  // Auto-check status on mount so an approved astrologer sees the correct
  // screen immediately when reopening the app (without having to pull-to-refresh).
  useEffect(() => {
    checkStatus();
  }, []);

  const handleLogout = () => {
    dispatch(logOut());
    navigation.reset({ index: 0, routes: [{ name: "signinsignup" }] });
  };

  const handleReApply = () => {
    navigation.navigate("astrologerregistration");
  };

  const checkStatus = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    try {
      const response = await getAstrologerRequestStatus(userId);
      const data = response?.data?.data;

      if (data?.status === "approved") {
        setStatus("approved");
        notifyMessage("Congratulations! Your account has been approved.");
        return;
      }

      if (data?.status === "rejected") {
        setStatus("rejected");
        setRejectionMessage(data?.message ?? "");
        notifyMessage("Your application has been rejected.");
        return;
      }

      if (data?.status === "pending") {
        notifyMessage("Your application is still under review.");
      }
    } catch (error) {
      notifyMessage("Could not check status. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, [userId, dispatch, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={checkStatus}
            colors={["#FD7A5B"]}
            tintColor="#FD7A5B"
          />
        }
      >
        {/* Icon */}
        <View
          style={[
            styles.iconCircle,
            isApproved
              ? styles.approvedCircle
              : isPending
              ? styles.pendingCircle
              : styles.rejectedCircle,
          ]}
        >
          <MaterialCommunityIcons
            name={
              isApproved
                ? "check-circle-outline"
                : isPending
                ? "clock-outline"
                : "close-circle-outline"
            }
            size={72}
            color={isApproved ? "#10B981" : isPending ? "#F59E0B" : "#EF4444"}
          />
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            isApproved
              ? styles.approvedTitle
              : isPending
              ? styles.pendingTitle
              : styles.rejectedTitle,
          ]}
        >
          {isApproved
            ? "Application Approved!"
            : isPending
            ? "Application Under Review"
            : "Application Rejected"}
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {isApproved
            ? "Congratulations! Your astrologer profile has been approved by our team."
            : isPending
            ? "Your astrologer profile has been submitted successfully. Our team is reviewing your application."
            : "Unfortunately, your astrologer application was not approved at this time."}
        </Text>

        {/* Approved — logout & re-login instruction */}
        {isApproved && (
          <View style={styles.approvedCard}>
            <MaterialCommunityIcons
              name="information-outline"
              size={18}
              color="#059669"
            />
            <Text style={styles.approvedCardText}>
              Please log out and log back in to activate your account.
            </Text>
          </View>
        )}

        {/* Pull-to-refresh hint */}
        {isPending && (
          <View style={styles.refreshHint}>
            <MaterialCommunityIcons
              name="gesture-swipe-down"
              size={16}
              color="#9CA3AF"
            />
            <Text style={styles.refreshHintText}>
              Pull down to check for updates
            </Text>
          </View>
        )}

        {/* Rejection reason */}
        {status === "rejected" && rejectionMessage ? (
          <View style={styles.reasonCard}>
            <View style={styles.reasonHeader}>
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color="#EF4444"
              />
              <Text style={styles.reasonLabel}>Reason for Rejection</Text>
            </View>
            <Text style={styles.reasonText}>{rejectionMessage}</Text>
          </View>
        ) : null}

        {/* Info steps for pending */}
        {isPending && (
          <View style={styles.stepsCard}>
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, styles.stepDotDone]} />
              <Text style={styles.stepText}>Profile submitted</Text>
            </View>
            <View style={styles.stepConnector} />
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, styles.stepDotActive]} />
              <Text style={styles.stepText}>Admin review in progress</Text>
            </View>
            <View style={styles.stepConnector} />
            <View style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={[styles.stepText, { color: "#9CA3AF" }]}>
                Account activation
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {status === "rejected" && (
            <TouchableOpacity
              style={styles.reApplyButton}
              onPress={handleReApply}
            >
              <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
              <Text style={styles.reApplyButtonText}>Re-apply Now</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={18} color="#6B7280" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  approvedCircle: {
    backgroundColor: "#D1FAE5",
  },
  pendingCircle: {
    backgroundColor: "#FEF3C7",
  },
  rejectedCircle: {
    backgroundColor: "#FEE2E2",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  approvedTitle: {
    color: "#065F46",
  },
  pendingTitle: {
    color: "#92400E",
  },
  rejectedTitle: {
    color: "#991B1B",
  },
  approvedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
    padding: 16,
    marginBottom: 28,
  },
  approvedCardText: {
    flex: 1,
    fontSize: 14,
    color: "#065F46",
    lineHeight: 20,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  refreshHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  refreshHintText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  reasonCard: {
    width: "100%",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
    padding: 16,
    marginBottom: 28,
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 6,
  },
  reasonText: {
    fontSize: 14,
    color: "#7F1D1D",
    lineHeight: 20,
  },
  stepsCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#D1D5DB",
    marginLeft: 4,
  },
  stepDotDone: {
    backgroundColor: "#10B981",
  },
  stepDotActive: {
    backgroundColor: "#F59E0B",
  },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: "#E5E7EB",
    marginLeft: 10,
    marginVertical: 2,
  },
  stepText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 6,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  reApplyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FD7A5B",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  reApplyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  logoutButtonText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 6,
  },
});

export default AstrologerApprovalStatusScreen;

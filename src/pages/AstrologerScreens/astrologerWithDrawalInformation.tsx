import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import AstrologerHomeScreenLayout from "../../components/Layouts/astrologerHomeLayout";
import { astrologerHomeScreenStyle } from "../../styles";
import { Button, Chip, Divider, List } from "react-native-paper";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { withdrawRequest } from "../../services";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { UserRoleEnum } from "../../redux/redux.constants";
import useAuthService from "../../hooks/useAuthServices";
import { walletStyles as styles } from "../../styles";

const AstrologerWithdrawallInformation = () => {
  const astrologerId =
    useSelector((state: RootState) => state.auth.userDetails?.astrologerId) ??
    "";

  const userId =
    useSelector((state: RootState) => state.auth.userDetails?.userID) ?? "";

  const transactionHistoy = useSelector(
    (state: RootState) => state.auth.transactionHistory
  );
  const { getWalletBalance } = useAstrologyServices();
  const { getTransactionHistory } = useAuthService();
  const wallet = useSelector((state: RootState) => state.auth.wallet);

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

  useEffect(() => {
    // //"Wallet Recharge");
    getWalletBalance(astrologerId ?? "", UserRoleEnum.astrologer);
    getTransactionHistory(astrologerId ?? "", UserRoleEnum.astrologer);
  }, [astrologerId]);

  return (
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
        <Text style={styles.header}>Transaction History</Text>

        <ScrollView>
          {transactionHistoy?.map(
            (transaction) =>
              transaction?.amount !== 0 && (
                <View key={transaction._id}>
                  <List.Item
                    title={
                      <Text style={styles.chiptext}>
                        {transaction.description}
                      </Text>
                    }
                    description={
                      <Text style={styles.chiptext}>{`${new Date(
                        transaction.timestamp
                      ).toLocaleString()}`}</Text>
                    }
                    left={() => (
                      <Chip
                        style={[
                          styles.chip,
                          transaction.type === "credit"
                            ? styles.creditChip
                            : styles.debitChip,
                        ]}
                      >
                        <Text style={styles.chiptext}>
                          {transaction.type === "credit" ? "Credit" : "Debit"}
                        </Text>
                      </Chip>
                    )}
                    right={() => (
                      <Text
                        style={[
                          styles.amount,
                          transaction.type === "credit"
                            ? styles.creditAmount
                            : styles.debitAmount,
                        ]}
                      >
                        ₹{transaction.amount}
                      </Text>
                    )}
                    style={styles.listItem}
                  />
                  <Divider />
                </View>
              )
          )}
        </ScrollView>
      </View>
    </AstrologerHomeScreenLayout>
  );
};

export default AstrologerWithdrawallInformation;

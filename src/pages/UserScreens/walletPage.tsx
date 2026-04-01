import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, List, Divider, Chip, Button } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import WalletModal from "../../components/Shared/walletModal";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { UserRoleEnum } from "../../redux/redux.constants";

import { walletStyles as styles } from "../../styles";
import useAuthService from "../../hooks/useAuthServices";
import { withdrawRequest } from "../../services";

type Transaction = {
  _id: string;
  timestamp: string;
  description: string;
  amount: string;
  type: "credit" | "debit"; // Transaction type
};

const PaymentWalletHistory = () => {
  const [openWallet, setopenWallet] = useState<boolean>(false);

  const handleRecharge = () => {
    setopenWallet(true);
    // Logic for wallet recharge can be implemented here
    // //"Wallet Recharge Button Pressed");
  };

  const { getWalletBalance } = useAstrologyServices();
  const wallet = useSelector((state: RootState) => state.auth.wallet);

  const transactionHistoy = useSelector(
    (state: RootState) => state.auth.transactionHistory
  );

  //transactionHistoy);
  const { getTransactionHistory } = useAuthService();
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId
  );

  const fullName = useSelector(
    (state: RootState) => state.auth.userDetails?.fullName
  );
  useEffect(() => {
    // //"Wallet Recharge");
    getWalletBalance(userId ?? "", UserRoleEnum.user);
    getTransactionHistory(userId ?? "", UserRoleEnum.user);
  }, [userId]);

  return openWallet ? (
    <WalletModal visible={openWallet} setVisible={setopenWallet} />
  ) : (
    <View style={styles.container}>
      <Text style={styles.userName}>{`Welcome ${
        fullName?.split(" ")[0] ?? "User"
      }`}</Text>
      <Text style={styles.walletBalance}>
        Wallet Balance: ₹{wallet?.balance?.toFixed(2)}
      </Text>

      <Button
        mode="contained"
        onPress={handleRecharge}
        style={styles.rechargeButton}
        labelStyle={styles.rechargeButtonText}
      >
        Recharge Wallet
      </Button>

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
  );
};

export default PaymentWalletHistory;

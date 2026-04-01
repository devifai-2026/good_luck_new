import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";

import PaymentPage, { PaymentType } from "../../pages/UserScreens/paymentPage";
import useCommonFunctionalities from "../../hooks/useCommonFunctionalities";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

import { walletModalStyles as styles } from "../../styles";

interface WalletOption {
  name: string;
  balance: string;
  features: string[];
  isPopular: boolean;
  amount: number;
}

const walletOptions: WalletOption[] = [
  {
    name: "₹50 Plan",
    balance: "₹50",
    features: ["Exclusive deals", "Premium support"],
    isPopular: false,
    amount: 50,
  },
  {
    name: "₹100 Plan",
    balance: "₹100",
    features: ["Exclusive deals", "Premium support"],
    isPopular: false,
    amount: 100,
  },
  {
    name: "₹200 Plan",
    balance: "₹200",
    features: ["Exclusive deals", "Premium support"],
    isPopular: false,
    amount: 200,
  },
  {
    name: "₹500 Plan",
    balance: "₹500",
    features: ["Exclusive deals", "Premium support"],
    isPopular: false,
    amount: 500,
  },
  {
    name: "₹1,000 Plan",
    balance: "₹1,000",
    features: ["Exclusive deals", "Premium support"],
    isPopular: false,
    amount: 1000,
  },
  {
    name: "₹1,500 Plan",
    balance: "₹1,500",
    features: ["Exclusive deals", "Premium support"],
    isPopular: true, // Keep this as the most popular option
    amount: 1500,
  },
  {
    name: "₹2,000 Plan",
    balance: "₹2,000",
    features: ["Exclusive deals", "Premium support"],
    isPopular: false,
    amount: 2000,
  },
  {
    name: "₹5,000 Plan",
    balance: "₹5,000",
    features: ["Exclusive deals", "Premium support"],
    isPopular: false,
    amount: 5000,
  },
];

const WalletModal = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: any;
}) => {
  const mobileNumber = useSelector(
    (state: RootState) => state.auth.userDetails?.phoneNumber
  );
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(
    null
  );

  const { rechargeWallet } = useCommonFunctionalities();

  const handleWalletSelection = (walletName: WalletOption) => {
    setSelectedWallet(walletName);
  };

  const closeModal = () => {
    setVisible(false);
    setSelectedWallet(null);
  };

  const paymentCallback = async (id: string) => {
    await rechargeWallet(id, "", selectedWallet?.amount ?? 0, closeModal);
  };

  const renderWalletOption = ({ item }: { item: WalletOption }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor:
            selectedWallet?.name === item.name ? "#FFD700" : "#FFFFFF",
        },
      ]}
      onPress={() => handleWalletSelection(item)}
    >
      {selectedWallet?.name === item.name && <Text style={styles.tick}>✓</Text>}
      <Text style={styles.planName}>{item.name}</Text>
      <Text style={styles.balance}>{item.balance}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    setSelectedWallet(walletOptions[0]);
  }, []);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/loginLogo.png")}
              style={styles.logo}
            />
          </View>

          {/* Header Text */}
          <Text style={styles.headerText}>Choose your Wallet Plan</Text>

          {/* Wallet Options */}
          <FlatList
            data={walletOptions}
            keyExtractor={(item) => item.name}
            horizontal
            renderItem={renderWalletOption}
            showsHorizontalScrollIndicator={false}
          />

          {/* Features of Selected Wallet */}
          {selectedWallet && (
            <View style={styles.additionalCard}>
              <View style={styles.additionalCardTop}>
                <Text style={styles.additionalCardText}>
                  Features of {selectedWallet.name}:
                </Text>
              </View>
              {walletOptions
                .find((wallet) => wallet.name === selectedWallet.name)
                ?.features.map((feature, index) => (
                  <Text key={index} style={styles.additionalCardMainText}>
                    ✓ {feature}
                  </Text>
                ))}
            </View>
          )}

          {/* Confirm Button */}

          <PaymentPage
            paymentType={PaymentType.independent}
            callback={paymentCallback}
            amount={selectedWallet?.amount ?? 0}
            mobileNumber={mobileNumber ?? ""}
            buttonState={selectedWallet === null}
          />
        </View>
      </View>
    </Modal>
  );
};

export default WalletModal;

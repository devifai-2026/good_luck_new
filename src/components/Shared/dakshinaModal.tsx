import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Button, Provider } from "react-native-paper";
import { styleConstants } from "../../styles";
import PaymentPage, { PaymentType } from "../../pages/UserScreens/paymentPage";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { postDakshinaPayment } from "../../services";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

interface DakshinaModalProps {
  visible: boolean;
  onClose: any;
  //   onPay: (amount: number) => void;
}

const dakshinaAmounts = [1, 11, 101, 501, 1001, 5001, 10001];

const DakshinaModal: React.FC<DakshinaModalProps> = ({ visible, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1);

  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const callBack = async (id: string) => {
    // call your API to pay with selected amount and id
    // after payment success, setButtonState to false
    try {
      const response = await postDakshinaPayment({
        userId,
        amount: selectedAmount?.toString(),
      });
      onClose(false);
      notifyMessage(
        response?.data?.message ?? "Dakshina received successfully"
      );
    } catch (error: any) {
      console.error(error);
      notifyMessage("Failed to pay with Dakshina");
    }
  };

  return (
    <Provider>
      <Modal transparent visible={visible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Dakshina Amount</Text>

            <FlatList
              data={dakshinaAmounts}
              keyExtractor={(item) => item.toString()}
              numColumns={3}
              contentContainerStyle={styles.amountsContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.amountButton,
                    selectedAmount === item && styles.selectedAmount,
                  ]}
                  onPress={() => setSelectedAmount(item)}
                >
                  <Text
                    style={[
                      styles.amountText,
                      selectedAmount === item && styles.selectedText,
                    ]}
                  >
                    ₹{item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <PaymentPage
              paymentType={PaymentType.independent}
              amount={selectedAmount}
              mobileNumber=""
              callback={callBack}
              buttonState={selectedAmount === undefined}
            />

            <TouchableOpacity
              onPress={() => {
                onClose(false);
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: styleConstants.fontFamily,
    marginBottom: 15,
    color: styleConstants.color.textBlackColor,
  },
  amountsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  amountButton: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    margin: 8,
    borderRadius: 8,
    width: 80,
    alignItems: "center",
  },
  selectedAmount: {
    backgroundColor: styleConstants.color.primaryColor,
  },
  amountText: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: "#333",
  },
  selectedText: {
    color: "white",
  },
  payButton: {
    marginTop: 20,
    width: "100%",
  },
  closeButton: {
    marginTop: 10,
  },
  closeText: {
    color: styleConstants.color.deepRed,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",

    fontFamily: styleConstants.fontFamily,
  },
});

export default DakshinaModal;

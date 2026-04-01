import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import {
  Modal,
  Portal,
  Button,
  Provider,
  ActivityIndicator,
} from "react-native-paper";
import { styleConstants } from "../../styles";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { notifyMessage } from "../../hooks/useDivineShopServices";

interface OTPVerificationModalProps {
  visible: boolean;

  setModalVisible: any;
  //   onVerify: (otp: string) => void;
  //   resendOTP: () => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  visible,
  setModalVisible,
  //   onVerify,
  //   resendOTP,
}) => {
  const [otp, setOtp] = useState("");

  const phone = useSelector(
    (state: RootState) => state.auth.userDetails?.phoneNumber
  );

  const astrologerDetails = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerDetails
  );

  // Handle Resend Timer

  const { verifyOTPForProfileUpdate, loading } = useAstrologyServices();

  const handleVerifyOTP = async () => {
    if (otp.length === 4) {
      await verifyOTPForProfileUpdate(
        { otp: parseInt(otp), phone },
        astrologerDetails?.authId ?? "",
        setModalVisible
      );
    } else {
      notifyMessage("Please enter a valid OTP");
    }
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => {
            setModalVisible();
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Verify OTP</Text>
          <Text style={styles.modalSubText}>
            Enter the OTP sent to your registered phone number.
          </Text>
          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
              keyboardType="number-pad"
              placeholder="Enter OTP"
              placeholderTextColor={styleConstants.color.textGrayColor}
            />
          </View>
          <Button
            mode="contained"
            style={styles.verifyButton}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator
                  size={"small"}
                  color={styleConstants.color.textWhiteColor}
                />
              ) : (
                "Verify OTP"
              )}
            </Text>
          </Button>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: styleConstants.color.textWhiteColor,
    padding: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
    marginBottom: 16,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    borderRadius: 8,
    padding: 8,
    textAlign: "center",
    fontSize: 18,
    color: styleConstants.color.textBlackColor,
    width: "60%",
  },
  verifyButton: {
    backgroundColor: styleConstants.color.primaryColor,
    marginBottom: 8,
    width: "45%",
  },

  buttonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    textAlign: "center",
  },
});

export default OTPVerificationModal;

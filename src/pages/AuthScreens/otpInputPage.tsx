import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
} from "react-native";
import Layout from "../../components/Layouts/authLayOut";

import { ActivityIndicator, Button } from "react-native-paper";
import { otpInputStyle as styles } from "../../styles";
import useAuthService, { bypassNumbers } from "../../hooks/useAuthServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { styleConstants } from "../../styles/constants";
import { getInitialRouteName } from "../../redux/utils";
import { UserRoleEnum } from "../../redux/redux.constants";

const OTPPage = ({ navigation }: { navigation: any }) => {
  const [otpData, setOtpData] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(true);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { handleVerifyOTP, handleResendOTP } = useAuthService();

  const phoneNumber = useSelector(
    (state: RootState) => state.auth.userDetails?.phoneNumber
  );

  const verificationId = useSelector(
    (state: RootState) => state.auth.userDetails?.verificationId
  );

  const { otpFlow, isLoading, isAuthenticated, userDetails } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (timer > 0) {
      timeout = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && resendEnabled) {
      setResendEnabled(false);
    }
    return () => clearTimeout(timeout);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otpData];
    newOtp[index] = value.replace(/[^0-9]/g, ""); // Only allow digits
    setOtpData(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    handleResendOTP();
    setTimer(60);
    setResendEnabled(true);
  };

  const handleSignUp = () => {
    // Implement sign up logic here
    const otpString = otpData[0] + otpData[1] + otpData[2] + otpData[3];
    if (otpString.length < 4) {
      notifyMessage("Enter valid otp");
      return;
    }
    handleVerifyOTP(
      {
        otp: parseInt(otpString),
        phone: phoneNumber,
        verificationId: bypassNumbers.includes(phoneNumber ?? "")
          ? "1234567"
          : verificationId,
      },
      navigation
    ); // Replace with your target page
  };

  useEffect(() => {
    return () => {
      setOtpData(["", "", "", ""]);
      setTimer(60);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const route = getInitialRouteName(
        userDetails?.role as UserRoleEnum,
        userDetails?.astrologerId ?? undefined
      );
      navigation.navigate(route);
    }
  }, []);
  return (
    <Layout
      navigation={() => {}}
      headerTextLineOne="Enter OTP"
      headerTextLineTwo=""
      textColor="black"
    >
      <View style={styles.container}>
        <Text
          style={styles.otpText}
        >{`Code has been sent to +91${phoneNumber}`}</Text>
        <View style={styles.otpContainer}>
          {otpData.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  backgroundColor: digit
                    ? styleConstants.color.primaryColor
                    : "transparent",
                },
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  handleChange(index, "");
                }
              }}
              onFocus={() =>
                Keyboard.addListener("keyboardDidHide", () =>
                  inputRefs.current[index]?.blur()
                )
              }
            />
          ))}
        </View>
        <View>
          <Text style={styles.timerText}>
            {resendEnabled ? (
              <Text>
                Resend in <Text style={styles.timerContainer}>{timer}s</Text>
              </Text>
            ) : (
              <Button mode="text" onPress={handleResend}>
                <Text style={styles.resendButtonText}>Resend OTP</Text>
              </Button>
            )}
          </Text>
        </View>
        <TouchableOpacity
          disabled={isLoading}
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          {isLoading ? (
            <ActivityIndicator
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              color={styleConstants.color.backgroundWhiteColor}
            />
          ) : (
            <Text style={styles.signUpButtonText}>
              {otpFlow === "signin" ? "Sign in" : "Sign up"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default OTPPage;

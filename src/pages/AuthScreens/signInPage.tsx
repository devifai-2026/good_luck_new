import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import Layout from "../../components/Layouts/authLayOut";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { signInPageStyle as styles } from "../../styles";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import useAuthService from "../../hooks/useAuthServices";
import { useDispatch, useSelector } from "react-redux";
import { logOut, setOtpFlow } from "../../redux/silces/auth.silce";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { RootState } from "../../redux";
import { styleConstants } from "../../styles/constants";
import { getInitialRouteName } from "../../redux/utils";
import { UserRoleEnum } from "../../redux/redux.constants";

const LoginPage = ({ navigation }: any) => {
  const { handleSendOTP } = useAuthService();

  const { isAuthenticated, userDetails, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = () => {
    if (phoneNumber.length < 10) {
      notifyMessage("Enter valid phone number");
      return;
    }
    dispatch(setOtpFlow("signin"));
    handleSendOTP({ phone: phoneNumber });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (isAuthenticated) {
      const route = getInitialRouteName(
        userDetails?.role as UserRoleEnum,
        userDetails?.astrologerId ?? undefined
      );
      navigation.navigate(route);
    }
    return () => {
      setPhoneNumber("");
    };
  }, []);

  return (
    <Layout
      navigation={handleBack}
      headerTextLineOne="Sign In To"
      headerTextLineTwo="Your Account"
      textColor="black"
      shouldShowOverLay={false}
    >
      <View style={styles.container}>
        <TextInput
          maxLength={10}
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={styleConstants.color.textGrayColor}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TouchableOpacity
          disabled={isLoading}
          style={styles.loginButton}
          onPress={handleLogin}
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
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default LoginPage;

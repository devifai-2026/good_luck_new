import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import Layout from "../../components/Layouts/authLayOut";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useAuthService from "../../hooks/useAuthServices";
import { createAccountStyle as styles } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { logOut, setOtpFlow } from "../../redux/silces/auth.silce";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import { RootState } from "../../redux";
import { getInitialRouteName } from "../../redux/utils";
import { UserRoleEnum } from "../../redux/redux.constants";

const SignUp = ({ navigation }: any) => {
  const [checked, setChecked] = useState<
    "user" | "affiliatemarketer" | "astrologer"
  >("user");

  const [phoneNumber, setPhoneNumber] = useState("");

  const { handleRegisterNewUser } = useAuthService();

  const { isAuthenticated, userDetails, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();

  const handleSignUp = () => {
    // Implement your sign-up logic here
    if (phoneNumber.length < 10) {
      notifyMessage("Enter valid phone number");
      return;
    }
    dispatch(setOtpFlow("signup"));

    handleRegisterNewUser({ phone: phoneNumber, checked });
  };

  const handleBack = () => {
    navigation.navigate("signinsignup");
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
      headerTextLineOne="Create Your"
      headerTextLineTwo="Account"
      textColor="black"
      shouldShowOverLay={false}
    >
      <View style={styles.container}>
        <View style={styles.selectRoleButtons}>
          <View style={styles.radioButton}>
            <RadioButton
              color={styleConstants.color.primaryColor}
              value="user"
              status={checked === "user" ? "checked" : "unchecked"}
              onPress={() => setChecked("user")}
            />
            <Text style={{ fontFamily: styleConstants.fontFamily }}>User</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              color={styleConstants.color.primaryColor}
              value="Astrologer"
              status={checked === "astrologer" ? "checked" : "unchecked"}
              onPress={() => setChecked("astrologer")}
            />
            <Text style={{ fontFamily: styleConstants.fontFamily }}>
              Astrologer
            </Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              color={styleConstants.color.primaryColor}
              value="affiliatemarketer"
              status={checked === "affiliatemarketer" ? "checked" : "unchecked"}
              onPress={() => setChecked("affiliatemarketer")}
            />
            <Text style={{ fontFamily: styleConstants.fontFamily }}>
              Affiliate Marketer
            </Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={styleConstants.color.textGrayColor}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
        {/* <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={styleConstants.color.textGrayColor}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color={styleConstants.color.textGrayColor} // saffron color
            />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={styleConstants.color.textGrayColor}
            secureTextEntry={!passwordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color={styleConstants.color.textGrayColor} // saffron color
            />
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
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
            <Text style={styles.loginButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default SignUp;

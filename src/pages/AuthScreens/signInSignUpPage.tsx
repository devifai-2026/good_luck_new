import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useEffect } from "react";
import Layout from "../../components/Layouts/authLayOut";
import { signSignUpStyle as styles } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { getInitialRouteName } from "../../redux/utils";
import { UserRoleEnum } from "../../redux/redux.constants";
import { logOut } from "../../redux/silces/auth.silce";

export type RootStackParamList = {
  signin: undefined;
  signup: undefined;
  // Add other routes here if needed
};
const SignInSignUp = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { isAuthenticated, userDetails } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      const route = getInitialRouteName(
        userDetails?.role as UserRoleEnum,
        userDetails?.astrologerId ?? undefined
      );
      navigation.navigate(route);
    }
  }, []);

  useEffect(() => {
    dispatch(logOut());
  }, []);

  const handleSignIn = () => {
    navigation.navigate("signin");
  };

  const handleSignUp = () => {
    navigation.navigate("signup");
  };

  return (
    <Layout
      navigation={() => {}}
      headerTextLineOne="Welcome To"
      headerTextLineTwo="Good Luck"
      hideButton
      shouldShowOverLay
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default SignInSignUp;

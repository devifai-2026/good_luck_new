import { View, StyleSheet, ImageBackground, Image, StatusBar, Platform } from "react-native";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { authLayOutStyle as styles } from "../../styles";
import { useNavigation } from "@react-navigation/native";

// Get status bar height for proper top padding
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 30;

export interface Props {
  children: React.ReactNode;
  navigation: any;
  headerTextLineOne?: string;
  headerTextLineTwo?: string;
  hideButton?: boolean;
  shouldShowOverLay?: boolean;
  textColor?: string;
}

const Layout = (props: Props) => {
  const theme = useTheme();
  const {
    children,

    headerTextLineOne,
    headerTextLineTwo,
    hideButton,
    shouldShowOverLay,
    textColor,
  } = props;
  const navigation = useNavigation<any>();
  const handleBackButtonClick = () => {
    navigation.goBack();
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ImageBackground
        source={require("../../assets/loginBackGround.png")}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <View
          style={{
            ...styles.overlay,
            backgroundColor: shouldShowOverLay
              ? "rgba(253, 122, 91, 0.55)"
              : "rgba(211, 211, 211, 0.5)",
          }}
        >
          {!hideButton && (
            <Icon
              name="arrow-left"
              size={24}
              color={theme.colors.onSurface}
              onPress={handleBackButtonClick}
              style={[styles.icon, { top: STATUSBAR_HEIGHT + 10 }]}
            />
          )}
          {headerTextLineOne && (
            <Text
              style={{
                ...styles.headerTextLineOne,
                color: textColor ?? "#FFF",
                top: STATUSBAR_HEIGHT + 10,
              }}
            >
              {headerTextLineOne}
            </Text>
          )}
          {headerTextLineTwo && (
            <Text
              style={{
                ...styles.headerTextLineTwo,
                color: textColor ?? "#FFF",
                top: STATUSBAR_HEIGHT + 60,
              }}
            >
              {headerTextLineTwo}
            </Text>
          )}
          <View style={styles.contentContainer}>
            <View style={styles.logoImageContainer}>
              <Image
                style={styles.logoImageStyle}
                source={require("../../assets/loginLogo.png")}
              />
            </View>
            <View style={styles.inputsContainer}>{children}</View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Layout;

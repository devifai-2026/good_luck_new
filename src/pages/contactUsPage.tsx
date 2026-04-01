import React from "react";
import { View, Image, StyleSheet, Linking, Alert } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreenLayout from "../components/Layouts/homeLayOut";
import AstrologerHomeScreenLayout from "../components/Layouts/astrologerHomeLayout";
import { styleConstants } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { UserRoleEnum } from "../redux/redux.constants";

const ContactUsPage: React.FC = () => {
  const navigation = useNavigation();
  const role = useSelector((state: RootState) => state.auth.userDetails?.role);

  const Layout =
    role === UserRoleEnum.astrologer
      ? AstrologerHomeScreenLayout
      : HomeScreenLayout;

  const openWhatsApp = () => {
    const url = "https://wa.me/message/PJYT5MKLKQYDD1";
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "WhatsApp is not installed or link is invalid");
    });
  };

  const openEmail = () => {
    const email = "goodluck19861993@gmail.com";
    const subject = "Customer Support";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "No email app found");
    });
  };

  const openWebsite = () => {
    const url = "https://gooodluck.in/";
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open website");
    });
  };

  const openYouTube = () => {
    const url = "https://youtube.com/@goodluck2025su?si=6ePsxh1I-7NLdjCL";
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open YouTube");
    });
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* Back Button and Header */}
        <View style={styles.backButtonWrapper}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor={styleConstants.color.textBlackColor}
          />
          <Text style={styles.headerTextStyle}>
            Welcome to Goodluck Support
          </Text>
        </View>

        {/* Logo */}
        <Image
          source={require("../assets/loginLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            icon={() => (
              <Icon
                name="whatsapp"
                size={20}
                color={styleConstants.color.primaryColor}
              />
            )}
            mode="outlined"
            onPress={openWhatsApp}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.labelStyle}
            theme={{ colors: { primary: styleConstants.color.primaryColor } }}
          >
            WhatsApp
          </Button>

          <Button
            icon="email"
            mode="outlined"
            onPress={openEmail}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.labelStyle}
            theme={{ colors: { primary: styleConstants.color.primaryColor } }}
          >
            Email
          </Button>

          <Button
            icon="web"
            mode="outlined"
            onPress={openWebsite}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.labelStyle}
            theme={{ colors: { primary: styleConstants.color.primaryColor } }}
          >
            Website
          </Button>

          <Button
            icon="youtube"
            mode="outlined"
            onPress={openYouTube}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.labelStyle}
            theme={{ colors: { primary: styleConstants.color.primaryColor } }}
          >
            YouTube
          </Button>
        </View>
      </View>
    </Layout>
  );
};

export default ContactUsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  backButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTextStyle: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    flexShrink: 1,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: "center",
    gap: 14,
  },
  button: {
    borderRadius: 25,
    borderWidth: 1.5,
    width: 200,
    alignSelf: "center",
    borderColor: styleConstants.color.primaryColor,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  labelStyle: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.primaryColor,
  },
});

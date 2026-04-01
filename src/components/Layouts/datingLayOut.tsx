// DatingScreenLayout.tsx
import React from "react";
import { View, StyleSheet, Text, Dimensions, Pressable } from "react-native";
import { Avatar, IconButton, Button } from "react-native-paper";
import { homeLayOutStyle as styles } from "../../styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ProfileType } from "../../services/constants";
import { dummyImageURL } from "../../constants";

const DatingScreenLayout: React.FC<{
  children: React.ReactNode;
  navigation?: any;
  showHeader?: boolean;
  showFooter?: boolean;
  isChatUI?: boolean;
  chatname?: string;
  chatProfilePicture?: string;
}> = ({
  children,
  showHeader,
  showFooter,
  isChatUI,
  chatProfilePicture,
  chatname,
}) => {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const routeParams = route.params;

  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  const currentFlow = useSelector(
    (state: RootState) => state.auth.userDetails?.currentFlow
  );
  const handleProfileClick = () => {
    if (routeParams?.type && routeParams?.type === ProfileType.matrimony)
      navigation.navigate("mymatrimonyprofile");
    else navigation.navigate("mydatingprofile");
  };

  const handleMatchesClick = () => {
    if (routeParams?.type && routeParams?.type === ProfileType.matrimony)
      navigation.navigate("matrimonymatches");
    else navigation.navigate("datingmatches");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {!showHeader && (
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={styles.headerLeft}>
              <Avatar.Image
                size={width * 0.1}
                source={{
                  uri: isChatUI
                    ? chatProfilePicture
                    : userDetails?.profilePicture ?? dummyImageURL,
                }} // Corrected `uri` usage
              />

              <Text style={styles.welcomeText}>
                {chatname
                  ? chatname
                  : `Welcome ${
                      userDetails?.fullName?.split(" ")[0] ?? "User!"
                    }`}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Footer */}
      {!showFooter && (
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <IconButton
              icon="home"
              size={width * 0.08}
              iconColor="white"
              onPress={() => {
                console.log(currentFlow, "flow");
                if (currentFlow === ProfileType.dating)
                  navigation.navigate("datingdashboard");
                else if (currentFlow === ProfileType.matrimony)
                  navigation.naviagte("matrimonydashboard");
              }}
            />
            {/* <Text style={styles.footerButtonText}>Land</Text> */}
          </View>
          {routeParams?.type && routeParams?.type === ProfileType.dating && (
            <View style={styles.footerButton}>
              <IconButton
                icon="message"
                size={width * 0.08}
                iconColor="white"
                onPress={() => {
                  navigation.navigate("datingmessage");
                }}
              />
            </View>
          )}

          <View style={styles.footerButton}>
            <IconButton
              icon="heart-pulse"
              size={width * 0.08}
              iconColor="white"
              onPress={handleMatchesClick}
            />
          </View>

          <View style={styles.footerButton}>
            <IconButton
              icon="account"
              size={width * 0.08}
              iconColor="white"
              onPress={handleProfileClick}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default DatingScreenLayout;

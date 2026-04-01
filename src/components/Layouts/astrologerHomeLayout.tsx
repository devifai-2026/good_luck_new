import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import Modal from "react-native-modal";
import {
  Avatar,
  IconButton,
  Drawer,
  ActivityIndicator,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styleConstants } from "../../styles/constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logOut, updateAstrologerState } from "../../redux/silces/auth.silce";
import socketServices from "../../hooks/useSocketService";
import { SOCKET_TYPES } from "../../services/socket.types";
import { RootState } from "../../redux";
import { dummyImageURL } from "../../constants";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { updateAstrologerActiveState } from "../../services";
import useAuthService from "../../hooks/useAuthServices";
import DeleteModal from "../Shared/deleteModal";

const AstrologerHomeScreenLayout: React.FC<{
  children: React.ReactNode;
  hideFooter?: boolean;
}> = ({ children, hideFooter = false }) => {
  const { width } = Dimensions.get("window");
  const dispatch = useDispatch();

  const routes = useRoute<any>();

  const [showDeleteodal, setshowDeleteodal] = useState(false);

  const astrologerId =
    useSelector((state: RootState) => state.auth.userDetails?.astrologerId) ??
    "";

  const astrologerState =
    useSelector((state: RootState) => state.auth.userDetails?.isToggleon) ??
    false;
  const astrologerStateLoading =
    useSelector(
      (state: RootState) => state.auth.userDetails?.astrologerStateLoading
    ) ?? false;

  const astrologerDetails = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerDetails
  );

  const { handleDeleteAccount, handleLogOut } = useAuthService();

  // State to control the drawer visibility
  // console.log(astrologerDetails, "astrologer details");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Toggle state for the header right button
  // const [isToggleOn, setIsToggleOn] = useState(false);

  // Function to toggle drawer visibility
  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const navigation = useNavigation<any>();

  const handleButtonClick = async () => {
    setIsLoading(true);
    const body = {
      astrologerId,
      isActive: !astrologerState,
    };
    try {
      const response = await updateAstrologerActiveState(body);
      dispatch(updateAstrologerState(!astrologerState));
      if (astrologerState) {
        socketServices.disConnect();
      } else {
        if (socketServices.socketId?.length === 0) {
          socketServices.initializeSocket(() => {
            // setIsToggleOn(true);
          });
          socketServices.emit(SOCKET_TYPES.registerAstrologer, astrologerId);
        } else {
          socketServices.emit(SOCKET_TYPES.registerAstrologer, astrologerId);
        }
      }
      if (astrologerState) notifyMessage("You are offline!");
      else notifyMessage("You are online!");
    } catch (error) {
      console.error("Error while toggling astrologer state: ", error);
      notifyMessage("Cannot update astrologer state");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight ?? 0) + 10
                : 15,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          {/* Profile Avatar */}
          <Avatar.Image
            size={width * 0.1}
            source={{
              uri: astrologerDetails?.profile_picture ?? dummyImageURL,
            }}
            onTouchEnd={toggleDrawer}
          />
          <Text style={styles.welcomeText}>{`Welcome ${astrologerDetails?.Fname ?? "User"
            }!`}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Toggle Button */}

          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={styleConstants.color.textWhiteColor}
              style={{ alignSelf: "center" }}
            />
          ) : (
            <TouchableOpacity
              style={[
                styles.toggleButton,
                astrologerState && {
                  backgroundColor: styleConstants.color.deepGreen,
                },
              ]}
              onPress={handleButtonClick}
            >
              <Text
                style={[
                  styles.toggleText,
                  astrologerState && {
                    color: styleConstants.color.textWhiteColor,
                  },
                ]}
              >
                {astrologerState ? "Online" : "Offline"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Drawer Modal */}
      <Modal
        isVisible={drawerVisible}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        onBackdropPress={toggleDrawer}
        style={styles.modal}
        backdropOpacity={0}
      >
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.drawerOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.drawerContainer}>
          <Drawer.Section>
            <Drawer.Item
              theme={{
                fonts: {
                  labelLarge: {
                    fontWeight: "600",
                    fontSize: 15,
                    fontFamily: styleConstants.fontFamily,
                  },
                },
              }}
              icon="account"
              label="Edit Profile"
              onPress={() => {
                toggleDrawer();
                navigation.navigate("astrologerprofileedit");
              }}
            />
            <Drawer.Item
              theme={{
                fonts: {
                  labelLarge: {
                    fontWeight: "600",
                    fontSize: 15,
                    fontFamily: styleConstants.fontFamily,
                  },
                },
              }}
              icon="package-variant"
              label="Withdraw Information"
              onPress={() => {
                navigation.navigate("withdrawinformation");
                toggleDrawer();
              }}
            />
            <Drawer.Item
              theme={{
                fonts: {
                  labelLarge: {
                    fontWeight: "600",
                    fontSize: 15,
                    fontFamily: styleConstants.fontFamily,
                  },
                },
              }}
              icon="phone"
              label="Contact Us"
              onPress={() => {
                toggleDrawer();
                navigation.navigate("contactus");
              }}
            />
            <Drawer.Item
              theme={{
                fonts: {
                  labelLarge: {
                    fontWeight: "600",
                    fontSize: 15,
                    fontFamily: styleConstants.fontFamily,
                  },
                },
              }}
              icon="logout"
              label="Log out"
              onPress={() => {
                handleLogOut();
                toggleDrawer();
              }}
            />
            <Drawer.Item
              theme={{
                fonts: {
                  labelLarge: {
                    fontWeight: "600",
                    fontSize: 15,
                    fontFamily: styleConstants.fontFamily,
                  },
                },
              }}
              icon={() => (
                <MaterialCommunityIcons
                  color={styleConstants.color.textBlackColor}
                  name="delete"
                  size={30}
                />
              )}
              label="Delete account"
              onPress={() => {
                setshowDeleteodal(true), toggleDrawer();
              }}
            />
          </Drawer.Section>
        </View>
      </Modal>

      {/* Content */}
      <View style={styles.content}>
        {showDeleteodal ? (
          <DeleteModal
            visible={showDeleteodal}
            onClose={() => {
              setshowDeleteodal(false);
            }}
            type={"accountdelete"}
          />
        ) : (
          children
        )}
      </View>

      {/* Footer */}
      {!hideFooter && (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("astrologerhomeascreen")}
          >
            <View style={styles.footerButton}>
              <MaterialCommunityIcons
                name="home"
                color={
                  routes?.name === "astrologerhomeascreen"
                    ? styleConstants.color.backgroundWhiteColor
                    : styleConstants.color.deactivatedButtonColor
                }
                size={30}
              />
              <Text style={styles.footerButtonText}>Home</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("astrologerrequestscreen")}
          >
            <View style={styles.footerButton}>
              <MaterialCommunityIcons
                name="account"
                color={
                  routes?.name === "astrologerrequestscreen"
                    ? styleConstants.color.backgroundWhiteColor
                    : styleConstants.color.deactivatedButtonColor
                }
                size={30}
              />
              <Text style={styles.footerButtonText}>History</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("astrologermyprofile")}
          >
            <View style={styles.footerButton}>
              <MaterialCommunityIcons
                name="account-circle"
                color={
                  routes?.name === "astrologermyprofile"
                    ? styleConstants.color.backgroundWhiteColor
                    : styleConstants.color.deactivatedButtonColor
                }
                size={30}
              />
              <Text style={styles.footerButtonText}>Profile</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("subproducts")}>
            <View style={styles.footerButton}>
              <MaterialCommunityIcons
                name="cart"
                color={
                  routes?.name === "subproducts" ||
                    routes?.name === "productlisting"
                    ? styleConstants.color.backgroundWhiteColor
                    : styleConstants.color.deactivatedButtonColor
                }
                size={30}
              />
              <Text style={styles.footerButtonText}>Divine Shop</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AstrologerHomeScreenLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: styleConstants.color.primaryColor,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
  },
  headerRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: styleConstants.color.textWhiteColor,
  },
  toggleText: {
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: styleConstants.color.primaryColor,
    paddingHorizontal: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 80,
  },
  footerButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 14,
    marginTop: 5,
    fontFamily: styleConstants.fontFamily,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-start",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContainer: {
    width: "70%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: 40,
    paddingLeft: 10,
    position: "absolute",
    left: 0,
    top: 0,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Share,
} from "react-native";
import Modal from "react-native-modal";
import Svg, { Path } from "react-native-svg";
import { Avatar, IconButton, Drawer, Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { homeLayOutStyle as styles } from "../../styles";
import { styleConstants } from "../../styles/constants";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { dummyImageURL } from "../../constants";
import useAuthService from "../../hooks/useAuthServices";
import { RootState } from "../../redux";
import ProfileRequestPopup from "../Shared/createMyProfileRequestModal";
import { UserRoleEnum } from "../../redux/redux.constants";
import DeleteModal from "../Shared/deleteModal";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const drawerItemTheme = {
  fonts: {
    labelLarge: {
      fontWeight: "600" as const,
      fontSize: 15,
      fontFamily: styleConstants.fontFamily,
    },
  },
};

const drawerItemThemeDanger = {
  fonts: {
    labelLarge: {
      fontWeight: "600" as const,
      fontSize: 15,
      fontFamily: styleConstants.fontFamily,
      color: "#E53935",
    },
  },
};

const HomeScreenLayout: React.FC<{
  children: React.ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
}> = ({ children, hideFooter = false, hideHeader = false }) => {
  const { width } = Dimensions.get("window");

  const routes = useRoute<any>();
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showDeleteodal, setshowDeleteodal] = useState<boolean>(false);
  const profileCreated = useSelector(
    (state: RootState) => state.auth.userDetails?.isProfileCreated
  );

  const role = useSelector((state: RootState) => state.auth.userDetails?.role);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const navigation = useNavigation<any>();

  const { handleLogOut } = useAuthService();
  const [showProfileCreation, setShowProfileCreation] = useState<boolean>(false);

  const handleMyProfileClick = () => {
    if (profileCreated) {
      navigation.navigate("userprofile");
    } else {
      setShowProfileCreation(true);
    }
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out this amazing app! Download it here: https://play.google.com/store/apps/details?id=com.app.goodluckapp",
      });
      if (result.action === Share.sharedAction) {
        console.log(result.activityType ? `Shared via ${result.activityType}` : "Shared successfully");
      }
    } catch (error) {
      console.error("Error sharing the app:", error);
    } finally {
      toggleDrawer();
    }
  };

  const firstName = userDetails?.fullName?.split(" ")[0] ?? "User";

  const isActive = (name: string) => routes?.name === name;
  const activeIconColor = styleConstants.color.textWhiteColor;
  const inactiveIconColor = "rgba(255,255,255,0.45)";

  return (
    <View style={styles.container}>
      {/* Header */}
      {!hideHeader && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.avatarWrapper}>
              <Avatar.Image
                size={width * 0.11}
                source={{ uri: userDetails?.profilePicture ?? dummyImageURL }}
              />
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{getGreeting()},</Text>
              <Text style={styles.welcomeText}>{firstName}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.walletButton}
            onPress={() => navigation.navigate("walletpage")}
          >
            <MaterialCommunityIcons name="wallet" size={width * 0.055} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Drawer Modal */}
      <Modal
        isVisible={drawerVisible}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        onBackdropPress={toggleDrawer}
        style={styles.modal}
        backdropOpacity={0.45}
      >
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.drawerOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContainer}>
          {/* Profile header */}
          <View style={styles.drawerHeader}>
            <Avatar.Image
              size={68}
              source={{ uri: userDetails?.profilePicture ?? dummyImageURL }}
              style={styles.drawerHeaderAvatar}
            />
            <Text style={styles.drawerUserName} numberOfLines={1}>
              {userDetails?.fullName ?? "User"}
            </Text>
            <View style={styles.drawerRoleBadge}>
              <Text style={styles.drawerRoleText}>
                {role === UserRoleEnum.affiliateMarketer ? "Partner" : "Member"}
              </Text>
            </View>
          </View>

          <Divider style={styles.drawerDivider} />

          <Drawer.Section>
            {role === UserRoleEnum.user && (
              <>
                <Drawer.Item
                  icon={() => (
                    <MaterialCommunityIcons
                      color={styleConstants.color.primaryColor}
                      name="package-variant"
                      size={26}
                    />
                  )}
                  theme={drawerItemTheme}
                  label="My Orders"
                  onPress={() => { toggleDrawer(); navigation.navigate("orderListing"); }}
                />
                <Drawer.Item
                  icon={() => (
                    <MaterialCommunityIcons
                      color={styleConstants.color.primaryColor}
                      name="chat"
                      size={26}
                    />
                  )}
                  theme={drawerItemTheme}
                  label="Astrology Chats"
                  onPress={() => { toggleDrawer(); navigation.navigate("astrologychatlisting"); }}
                />
              </>
            )}

            <Drawer.Item
              theme={drawerItemTheme}
              icon={() => (
                <MaterialCommunityIcons
                  color={styleConstants.color.primaryColor}
                  name="account"
                  size={26}
                />
              )}
              label="My Account"
              onPress={() => { handleMyProfileClick(); toggleDrawer(); }}
            />
            <Drawer.Item
              theme={drawerItemTheme}
              icon={() => (
                <MaterialCommunityIcons
                  color={styleConstants.color.primaryColor}
                  name="phone"
                  size={26}
                />
              )}
              label="Contact Us"
              onPress={() => { toggleDrawer(); navigation.navigate("contactus"); }}
            />
            <Drawer.Item
              theme={drawerItemTheme}
              icon={() => (
                <MaterialCommunityIcons
                  color={styleConstants.color.primaryColor}
                  name="share-variant"
                  size={26}
                />
              )}
              label="Share App"
              onPress={shareApp}
            />

            <Divider style={{ marginVertical: 6 }} />

            <Drawer.Item
              theme={drawerItemThemeDanger}
              icon={() => (
                <MaterialCommunityIcons color="#E53935" name="logout" size={26} />
              )}
              label="Log Out"
              onPress={() => { handleLogOut(); toggleDrawer(); }}
            />
            <Drawer.Item
              theme={drawerItemThemeDanger}
              icon={() => (
                <MaterialCommunityIcons color="#E53935" name="delete" size={26} />
              )}
              label="Delete Account"
              onPress={() => { setshowDeleteodal(true); toggleDrawer(); }}
            />
          </Drawer.Section>

          <View style={styles.drawerFooter}>
            <Text style={styles.drawerFooterText}>Designed by Devifai</Text>
            <Text style={styles.drawerVersionText}>v1.0.0</Text>
          </View>
        </View>
      </Modal>

      {/* Content */}
      <View style={styles.content}>
        {showProfileCreation ? (
          <ProfileRequestPopup
            visible={showProfileCreation}
            onSkip={setShowProfileCreation}
          />
        ) : showDeleteodal ? (
          <DeleteModal
            visible={showDeleteodal}
            onClose={() => setshowDeleteodal(false)}
            type={"accountdelete"}
          />
        ) : (
          children
        )}
      </View>

      {/* Footer */}
      {!hideFooter && (
        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("servicepage")}>
              <View style={[styles.footerButton, isActive("servicepage") && styles.footerButtonActive]}>
                <Svg width={width * 0.07} height={width * 0.09} viewBox="0 0 24 30" fill="none">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.4766 25.9473C16.1118 27.4439 14.5225 28.7842 12.7378 29.8682C12.5181 30.0293 12.2202 30.0489 11.9761 29.8926C9.33941 28.2154 7.12508 26.2012 5.38437 24.0113C2.98204 20.9987 1.47083 17.6588 0.953252 14.4411C0.425912 11.1794 0.919072 8.03977 2.54259 5.48853C3.18224 4.48023 4.0001 3.56227 4.99619 2.76882C7.28621 0.945107 9.90093 -0.0192402 12.5083 0.000290907C15.0181 0.019822 17.4961 0.954873 19.6372 2.91042C20.3891 3.59401 21.0214 4.3777 21.539 5.2273C23.2846 8.10325 23.6606 11.7702 22.894 15.486C22.1372 19.1578 20.2573 22.8883 17.4766 25.94V25.9473ZM12.0103 5.80102C15.106 5.80102 17.6133 8.31077 17.6133 11.404C17.6133 14.4997 15.1035 17.007 12.0103 17.007C8.91461 17.007 6.40731 14.4997 6.40731 11.404C6.40487 8.30833 8.91461 5.80102 12.0103 5.80102Z"
                    fill={isActive("servicepage") ? activeIconColor : inactiveIconColor}
                  />
                </Svg>
                <Text style={[styles.footerButtonText, isActive("servicepage") && styles.footerButtonTextActive]}>Property</Text>
                <Text style={[styles.footerButtonText, isActive("servicepage") && styles.footerButtonTextActive]}>Jobs</Text>
                {isActive("servicepage") && <View style={styles.activeTab} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("pujapage")}>
              <View style={[styles.footerButton, isActive("pujapage") && styles.footerButtonActive]}>
                <Svg width={width * 0.08} height={width * 0.09} viewBox="0 0 27 32" fill="none">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.33032 4.19271H8.6298V3.82813H9.04907V3.38802H9.34855V0.226563C9.34855 0.101563 9.45011 0 9.57511 0C9.70011 0 9.80168 0.101563 9.80168 0.226563V0.572917C12.2236 1.88021 12.4423 -1.22656 14.8928 1.01302C14.01 0.989583 13.3459 1.40365 12.5725 1.84896C11.8173 2.28385 11.0829 2.69271 10.1897 2.70052C10.0334 2.70313 9.90063 2.69271 9.79907 2.68229V3.38542H10.0881V3.82552H10.5074V4.1901H10.8069V5.1875H11.1897C13.3954 8.57813 14.6194 11.2161 15.0855 15.2161C15.0933 15.2813 15.1012 15.3464 15.1064 15.4115C15.6506 13.8177 16.51 12.3906 17.5881 10.7344H18.0439V9.9375H18.2834V9.64583H18.6194V9.29427H18.8147V6.76563C18.8147 6.64063 18.9163 6.53906 19.0413 6.53906C19.1663 6.53906 19.2678 6.64063 19.2678 6.76563V7.06771C21.1611 8.04948 21.3512 5.61719 23.2965 7.39583C22.5907 7.3776 22.0595 7.70833 21.4423 8.0651C20.8381 8.41406 20.2496 8.73958 19.536 8.7474C19.4345 8.7474 19.3433 8.74479 19.2704 8.73698V9.29427H19.4579V9.64583H19.7939V9.9375H20.0334V10.7344H20.3381C22.1012 13.4479 23.0829 15.5547 23.4527 18.7578C23.5387 19.5078 23.5855 20.2813 23.5777 21.0833L24.6428 21.6797H24.9788V21.8984H25.3459V22.1172H25.5959L25.5855 22.3333H24.3459L23.898 22.7891C23.8485 23.0573 23.8564 23.2526 23.898 23.401H24.1637V23.5833C23.6584 23.849 23.5022 24.3307 23.5022 24.862L23.635 24.9505C23.5647 25.1432 23.4683 25.2995 23.3381 25.4036V26.2188H23.6038V26.6354H23.3303C23.3303 28.4922 23.3303 27.5339 23.3303 29.2214H24.0387V29.8385H24.8199V30.5104H25.6194V31H26.4918V32C17.622 32 8.91366 31.9349 0.0646973 31.9349V30.6823H1.15584V30.0677H2.15584V29.2266H3.13241V28.4531H4.01782C4.01782 26.3438 4.01782 27.3802 4.01782 25.0573H3.67668V24.5339H4.00741V23.5156C3.84334 23.388 3.72355 23.1927 3.63501 22.9505L3.80168 22.8411C3.80168 22.1771 3.60636 21.5755 2.97355 21.2422V21.0156H3.30688C3.35897 20.8307 3.36678 20.5859 3.30688 20.25L2.74959 19.6823H1.20011L1.17928 19.4167H1.49178V19.1432H1.95272V18.8698H2.37459L3.70532 18.1224C3.69491 17.1172 3.7548 16.151 3.86418 15.2135C4.32772 11.2109 5.55428 8.57552 7.76001 5.1849H8.33032V4.19271ZM9.79126 20.737L10.747 22.4922L11.3902 20.6198C11.4397 20.612 11.4892 20.6068 11.5387 20.599C13.6272 23.0859 12.7756 25.5547 12.7756 28.9193H6.22355C6.22355 26.013 5.46834 22.9974 7.38761 20.5339C7.39282 20.5365 7.39803 20.5365 7.40324 20.5391C7.54386 20.5677 7.68709 20.5964 7.83553 20.6172L8.59855 22.3255L9.39282 20.737C9.44491 20.737 9.49959 20.737 9.55168 20.737C9.6298 20.7396 9.71053 20.7396 9.79126 20.737ZM11.3407 20.3802C10.7887 20.4531 10.1715 20.4948 9.54907 20.4948C8.86157 20.4948 8.17147 20.4401 7.56209 20.3203C8.03605 19.7839 8.65584 19.3464 9.46313 19.0547C10.2496 19.4271 10.8616 19.8724 11.3407 20.3802ZM18.9371 21.6693C22.4423 23.3307 21.4736 25.487 21.4736 28.9193H16.4553C16.4553 26.0964 15.5439 22.9063 18.9371 21.6693Z"
                    fill={isActive("pujapage") ? activeIconColor : inactiveIconColor}
                  />
                </Svg>
                <Text style={[styles.footerButtonText, isActive("pujapage") && styles.footerButtonTextActive]}>Puja</Text>
                {isActive("pujapage") && <View style={styles.activeTab} />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            {role === UserRoleEnum.user && (
              <View style={[styles.footerButton, isActive("livepuja") && styles.footerButtonActive]}>
                <Svg width={width * 0.09} height={width * 0.09} viewBox="0 0 34 32" fill="none">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.923578 8.6345H13.7114L11.501 4.76894C11.7143 3.69354 12.3348 3.33177 13.3639 3.68335L16.1956 8.6345H17.313L22.3514 0.0979194C23.3236 -0.152983 24.0442 0.0337024 24.2152 1.18344L19.821 8.6345H33.0764C33.5848 8.6345 34 9.05379 34 9.56679V31.0677C34 31.5801 33.5845 32 33.0764 32H0.923777C0.416035 32 0 31.5801 0 31.0677V9.56679C0 9.05379 0.416035 8.6345 0.923578 8.6345Z"
                    fill={isActive("livepuja") ? activeIconColor : inactiveIconColor}
                    onPress={() => navigation.navigate("livepuja")}
                  />
                </Svg>
                <Text style={[styles.footerButtonText, isActive("livepuja") && styles.footerButtonTextActive]}>Amrit Vani</Text>
                {isActive("livepuja") && <View style={styles.activeTab} />}
              </View>
            )}

            {role === UserRoleEnum.user && (
              <TouchableOpacity onPress={() => navigation.navigate("talkToAstrologer")}>
                <View style={[styles.footerButton, isActive("talkToAstrologer") && styles.footerButtonActive]}>
                  <Svg width={width * 0.08} height={width * 0.08} viewBox="0 0 28 28" fill="none">
                    <Path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.6521 22.2592L6.92933 27.701C6.80686 27.8363 6.64592 27.9317 6.46771 27.9746C6.2895 28.0175 6.10236 28.0059 5.93095 27.9412C5.75954 27.8766 5.61189 27.762 5.50744 27.6126C5.40299 27.4631 5.34664 27.2858 5.34581 27.104V22.2592H2.32127C1.70675 22.2557 1.11842 22.012 0.683882 21.5812C0.249342 21.1503 0.00361848 20.567 0 19.9577L0 2.30158C0.00480767 1.69264 0.250913 1.10999 0.685197 0.679386C1.11948 0.248785 1.70712 0.0047669 2.32127 0L25.6787 0C26.2933 0.00358779 26.8816 0.247227 27.3161 0.678082C27.7507 1.10894 27.9964 1.69227 28 2.30158V19.9577C27.9964 20.567 27.7507 21.1503 27.3161 21.5812C26.8816 22.012 26.2933 22.2557 25.6787 22.2592H12.6521ZM6.32718 8.34266C6.09521 8.33106 5.8766 8.23153 5.71655 8.06463C5.55651 7.89774 5.46726 7.67625 5.46726 7.44595C5.46726 7.21566 5.55651 6.99417 5.71655 6.82728C5.8766 6.66038 6.09521 6.56085 6.32718 6.54925H21.6728C21.7954 6.54312 21.918 6.56177 22.0331 6.60407C22.1482 6.64636 22.2534 6.71142 22.3424 6.79529C22.4314 6.87916 22.5022 6.98009 22.5506 7.09194C22.599 7.2038 22.624 7.32424 22.624 7.44595C22.624 7.56767 22.599 7.68811 22.5506 7.79997C22.5022 7.91182 22.4314 8.01275 22.3424 8.09662C22.2534 8.18049 22.1482 8.24555 22.0331 8.28784C21.918 8.33014 21.7954 8.34879 21.6728 8.34266H6.32718ZM6.32718 14.165C6.09521 14.1534 5.8766 14.0538 5.71655 13.8869C5.55651 13.7201 5.46726 13.4986 5.46726 13.2683C5.46726 13.038 5.55651 12.8165 5.71655 12.6496C5.8766 12.4827 6.09521 12.3832 6.32718 12.3716H18.8459C19.0779 12.3832 19.2965 12.4827 19.4566 12.6496C19.6166 12.8165 19.7059 13.038 19.7059 13.2683C19.7059 13.4986 19.6166 13.7201 19.4566 13.8869C19.2965 14.0538 19.0779 14.1534 18.8459 14.165H6.32718Z"
                      fill={isActive("talkToAstrologer") ? activeIconColor : inactiveIconColor}
                    />
                  </Svg>
                  <Text style={[styles.footerButtonText, { fontSize: 12 }, isActive("talkToAstrologer") && styles.footerButtonTextActive]}>Talk to</Text>
                  <Text style={[styles.footerButtonText, { fontSize: 12 }, isActive("talkToAstrologer") && styles.footerButtonTextActive]}>Astrologer</Text>
                  {isActive("talkToAstrologer") && <View style={styles.activeTab} />}
                </View>
              </TouchableOpacity>
            )}

            {role === UserRoleEnum.affiliateMarketer && (
              <TouchableOpacity onPress={() => navigation.navigate("localServicesHomePage")}>
                <View style={[styles.footerButton, isActive("localServicesHomePage") && styles.footerButtonActive]}>
                  <MaterialCommunityIcons
                    name="map"
                    color={isActive("localServicesHomePage") ? activeIconColor : inactiveIconColor}
                    size={28}
                  />
                  <Text style={[styles.footerButtonText, isActive("localServicesHomePage") && styles.footerButtonTextActive]}>Local Services</Text>
                  {isActive("localServicesHomePage") && <View style={styles.activeTab} />}
                </View>
              </TouchableOpacity>
            )}

            {role === UserRoleEnum.affiliateMarketer && (
              <TouchableOpacity onPress={() => navigation.navigate("subproducts")}>
                <View style={[styles.footerButton, (isActive("subproducts") || isActive("productlisting")) && styles.footerButtonActive]}>
                  <MaterialCommunityIcons
                    name="cart"
                    color={(isActive("subproducts") || isActive("productlisting")) ? activeIconColor : inactiveIconColor}
                    size={28}
                  />
                  <Text style={[styles.footerButtonText, (isActive("subproducts") || isActive("productlisting")) && styles.footerButtonTextActive]}>Divine Shop</Text>
                  {(isActive("subproducts") || isActive("productlisting")) && <View style={styles.activeTab} />}
                </View>
              </TouchableOpacity>
            )}
          </View>

          {role === UserRoleEnum.user && (
            <View style={styles.homeIconContainer}>
              <View style={styles.homeIcon}>
                <IconButton
                  icon="home"
                  size={width * 0.08}
                  iconColor={isActive("home") ? activeIconColor : "rgba(255,255,255,0.65)"}
                  onPress={() => navigation.navigate("home")}
                />
              </View>
              <View style={styles.overlay} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default HomeScreenLayout;

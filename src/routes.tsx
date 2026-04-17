import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInSignUp from "./pages/AuthScreens/signInSignUpPage";
import LoginPage from "./pages/AuthScreens/signInPage";
import SignUp from "./pages/UserScreens/createAccount";
import OTPPage from "./pages/AuthScreens/otpInputPage";
import HomePage from "./pages/UserScreens/homePage";
import Subcategories from "./pages/UserScreens/subCategories";
import ProductList from "./pages/UserScreens/productlist";
import CreateProfile from "./pages/UserScreens/createProfile";
import PlanSelectionComponent from "./pages/UserScreens/plans";
import DatingMatrimonyDashBoard from "./pages/UserScreens/datingMatrimonyDashboard";
import DatingMessageList from "./pages/UserScreens/datingMesagesComponent";
import DatingChatComponent from "./components/Chat/datingChatUI";
import MyProfilePage from "./pages/UserScreens/myProfile";
import ProductDetail from "./pages/UserScreens/productDetail";
import PaymentDetail from "./pages/UserScreens/paymentDetail";
import ConfirmPayment from "./pages/UserScreens/paymentConfirm";
import Matches from "./pages/UserScreens/matches";
import ViewProfile from "./pages/UserScreens/viewProfile";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import OrderListingPage from "./pages/UserScreens/orderListing";
import OrderDetailsPage from "./pages/UserScreens/orderDetails";
import LocalServicesPage from "./pages/UserScreens/localServicesPage";

import TalkToAstrologerPage from "./pages/UserScreens/talkToAstrologerPage";
import TopAstrologerPage from "./pages/UserScreens/topAstrologerPage";
import AtrologerProfilePage from "./pages/UserScreens/astrologerProfilePage";
import { ProfileType } from "./services/constants";
import { UserRoleEnum } from "./redux/redux.constants";
import AstrologerHomeScreen from "./pages/AstrologerScreens/astrologerHomeScreen";
import AstrologerRequestScreen from "./pages/AstrologerScreens/astrologerRequestScreen";

import PaymentWalletHistory from "./pages/UserScreens/walletPage";
import AstrologyChatComponent from "./components/Chat/astrologyChatUI";
import AstrologerForm from "./pages/AstrologerScreens/astrologerForm";
import ServicesHomePage from "./pages/UserScreens/servicesScreen";
import AddPostForLandandJob from "./pages/UserScreens/addPostForLandandJob";
import SellJobListingPage from "./pages/UserScreens/sellJobListingPage";
import SubscriptionModal from "./pages/UserScreens/getSubscriptions";
import AdDetailsPage from "./pages/UserScreens/adDetailsPage";
import VoiceCallPage from "./pages/UserScreens/voiceCall";
import AstrologerEditProfile from "./pages/AstrologerScreens/astrologerEditProfile";
import AstrologerMyProfilePage from "./pages/AstrologerScreens/astrologerMyProfile";
import MyProfileEdit from "./components/Shared/myProfileCreate";
import MyprofilePage from "./pages/UserScreens/myProfilePage";
import EditMyProfile from "./pages/UserScreens/editMyProfile";
import VideoPlayer from "./pages/UserScreens/videoPlayer";
import AstrologerWithdrawallInformation from "./pages/AstrologerScreens/astrologerWithDrawalInformation";
import janamKundaliMatchmakingPage from "./pages/UserScreens/janamKundaliMatchMatingPage";
import Panchang from "./pages/UserScreens/panchangPage";
import AstrologyChatHistory from "./pages/UserScreens/astrologerUserChatListing";
import PujaPage from "./pages/UserScreens/pujaPage";
import LocalServicesHomePage from "./pages/UserScreens/localServicesHomepage";
import { getInitialRouteName } from "./redux/utils";
import AffiliatearketerHomePage from "./pages/affiliateMarketer";
import ContactUsPage from "./pages/contactUsPage";
import VoiceCallScreen from "./pages/UserScreens/VoiceCallScreen";
import AstrologerVoiceCallScreen from "./pages/AstrologerScreens/AstrologerVoiceCallScreen";
import UserVoiceCallScreen from "./pages/UserScreens/UserVoiceCallScreen";
import AstrologerApprovalStatusScreen from "./pages/AstrologerScreens/AstrologerApprovalStatusScreen";

const Routes = () => {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated, userDetails } = useSelector(
    (state: RootState) => state.auth
  );
  // console.log("User: ", userDetails?.role);

  // console.log("isAuthenticated: ", getInitialRouteName());

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRouteName(
          userDetails?.role as UserRoleEnum,
          userDetails?.astrologerId ?? undefined,
          userDetails?.astrologerDetails,
          userDetails?.astrologerRequest ?? undefined
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Group>
          <Stack.Screen name="signinsignup" component={SignInSignUp} />
          <Stack.Screen name="signin" component={LoginPage} />
          <Stack.Screen name="signup" component={SignUp} />
          <Stack.Screen name="otpverify" component={OTPPage} />
          <Stack.Screen
            name="home"
            component={isAuthenticated ? HomePage : SignInSignUp}
          />

          <Stack.Screen
            name="affiliateMarketerhome"
            component={
              isAuthenticated ? AffiliatearketerHomePage : SignInSignUp
            }
          />

          <Stack.Screen
            name="contactus"
            component={isAuthenticated ? ContactUsPage : SignInSignUp}
          />

          <Stack.Screen
            name="userprofile"
            component={isAuthenticated ? MyprofilePage : SignInSignUp}
          />

          <Stack.Screen
            name="myprofileedit"
            component={isAuthenticated ? EditMyProfile : SignInSignUp}
          />

          <Stack.Screen
            name="astrologerhomeascreen"
            component={isAuthenticated ? AstrologerHomeScreen : SignInSignUp}
          />
          <Stack.Screen
            name="astrologerregistration"
            component={isAuthenticated ? AstrologerForm : SignInSignUp}
          />
          <Stack.Screen
            name="astrologerpendingstatus"
            component={isAuthenticated ? AstrologerApprovalStatusScreen : SignInSignUp}
          />
          <Stack.Screen
            name="astrologerprofileedit"
            component={isAuthenticated ? AstrologerEditProfile : SignInSignUp}
          />

          <Stack.Screen
            name="astrologermyprofile"
            component={isAuthenticated ? AstrologerMyProfilePage : SignInSignUp}
          />
          <Stack.Screen
            name="astrologerrequestscreen"
            component={isAuthenticated ? AstrologerRequestScreen : SignInSignUp}
          />
          <Stack.Screen
            name="subproducts"
            component={isAuthenticated ? Subcategories : SignInSignUp}
          />
          <Stack.Screen
            name="productlisting"
            component={isAuthenticated ? ProductList : SignInSignUp}
            initialParams={{ id: null }}
          />
          <Stack.Screen
            name="createdatingprofile"
            component={isAuthenticated ? CreateProfile : SignInSignUp}
            initialParams={{ type: ProfileType.dating }}
          />

          <Stack.Screen
            name="creatematrimonyprofile"
            component={isAuthenticated ? CreateProfile : SignInSignUp}
            initialParams={{ type: ProfileType.matrimony }}
          />

          <Stack.Screen
            name="matrimonyplans"
            component={isAuthenticated ? PlanSelectionComponent : SignInSignUp}
            initialParams={{ type: ProfileType.matrimony }}
          />
          <Stack.Screen
            name="datingplans"
            component={isAuthenticated ? PlanSelectionComponent : SignInSignUp}
            initialParams={{ type: ProfileType.dating }}
          />
          <Stack.Screen
            name="datingdashboard"
            component={
              isAuthenticated ? DatingMatrimonyDashBoard : SignInSignUp
            }
            initialParams={{ type: ProfileType.dating }}
          />
          <Stack.Screen
            name="matrimonydashboard"
            component={
              isAuthenticated ? DatingMatrimonyDashBoard : SignInSignUp
            }
            initialParams={{ type: ProfileType.matrimony }}
          />

          <Stack.Screen
            name="datingmessage"
            component={isAuthenticated ? DatingMessageList : SignInSignUp}
            initialParams={{ type: ProfileType.dating }}
          />
          <Stack.Screen
            name="datingmessagechat"
            component={isAuthenticated ? DatingChatComponent : SignInSignUp}
          />
          <Stack.Screen
            name="mydatingprofile"
            component={isAuthenticated ? MyProfilePage : SignInSignUp}
            initialParams={{ type: "owndatingprofile" }}
          />
          <Stack.Screen
            name="mymatrimonyprofile"
            component={isAuthenticated ? MyProfilePage : SignInSignUp}
            initialParams={{ type: "ownmatrimonyprofile" }}
          />
          <Stack.Screen
            name="datingprofile"
            component={isAuthenticated ? MyProfilePage : SignInSignUp}
            initialParams={{ type: "datingprofile" }}
          />
          <Stack.Screen
            name="matrimonyprofile"
            component={isAuthenticated ? MyProfilePage : SignInSignUp}
            initialParams={{ type: "matrimonyprofile" }}
          />
          <Stack.Screen
            name="buyProduct"
            component={isAuthenticated ? ProductDetail : SignInSignUp}
          />
          <Stack.Screen
            name="checkout"
            component={isAuthenticated ? PaymentDetail : SignInSignUp}
          />
          <Stack.Screen
            name="paymentConfirm"
            component={isAuthenticated ? ConfirmPayment : SignInSignUp}
          />
          <Stack.Screen
            name="datingmatches"
            component={isAuthenticated ? Matches : SignInSignUp}
            initialParams={{ type: ProfileType.dating }}
          />
          <Stack.Screen
            name="matrimonymatches"
            component={isAuthenticated ? Matches : SignInSignUp}
            initialParams={{ type: ProfileType.matrimony }}
          />
          <Stack.Screen
            name="viewProfile"
            component={isAuthenticated ? ViewProfile : SignInSignUp}
          />
          <Stack.Screen
            name="orderListing"
            component={isAuthenticated ? OrderListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="orderdetails"
            component={isAuthenticated ? OrderDetailsPage : SignInSignUp}
          />
          <Stack.Screen
            name="servicepage"
            component={isAuthenticated ? ServicesHomePage : SignInSignUp}
          />
          <Stack.Screen
            name="subscriptionpage"
            component={isAuthenticated ? SubscriptionModal : SignInSignUp}
          />
          <Stack.Screen
            name="localservicesubscriptionpage"
            component={isAuthenticated ? SubscriptionModal : SignInSignUp}
          />
          <Stack.Screen
            name="landhomelocalservicespage"
            component={isAuthenticated ? LocalServicesPage : SignInSignUp}
          />
          <Stack.Screen
            name="joblocalservicespage"
            component={isAuthenticated ? LocalServicesPage : SignInSignUp}
          />
          <Stack.Screen
            name="otherlocalservicepage"
            component={isAuthenticated ? SellJobListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="landSellPage"
            component={isAuthenticated ? SellJobListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="homeSellPage"
            component={isAuthenticated ? SellJobListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="govtjobPage"
            component={isAuthenticated ? SellJobListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="privatejobPage"
            component={isAuthenticated ? SellJobListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="showYourLandPosts"
            component={isAuthenticated ? SellJobListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="showYourJobPosts"
            component={isAuthenticated ? SellJobListingPage : SignInSignUp}
          />
          <Stack.Screen
            name="addPostForLand"
            component={isAuthenticated ? AddPostForLandandJob : SignInSignUp}
          />

          <Stack.Screen
            name="addDetailsPage"
            component={isAuthenticated ? AdDetailsPage : SignInSignUp}
          />
          <Stack.Screen
            name="editHomeAdd"
            component={isAuthenticated ? AddPostForLandandJob : SignInSignUp}
          />
          <Stack.Screen
            name="editJobAdd"
            component={isAuthenticated ? AddPostForLandandJob : SignInSignUp}
          />

          <Stack.Screen
            name="addPostForJob"
            component={isAuthenticated ? AddPostForLandandJob : SignInSignUp}
          />

          <Stack.Screen
            name="localServicesHomePage"
            component={isAuthenticated ? LocalServicesHomePage : SignInSignUp}
          />
          <Stack.Screen
            name="talkToAstrologer"
            component={isAuthenticated ? TalkToAstrologerPage : SignInSignUp}
          />
          <Stack.Screen
            name="topAstrologerPage"
            component={isAuthenticated ? TopAstrologerPage : SignInSignUp}
          />
          <Stack.Screen
            name="astrologerProfilePage"
            component={isAuthenticated ? AtrologerProfilePage : SignInSignUp}
          />

          <Stack.Screen
            name="astrologychat"
            component={isAuthenticated ? AstrologyChatComponent : SignInSignUp}
          />
          <Stack.Screen
            name="astrologychathistory"
            component={isAuthenticated ? AstrologyChatComponent : SignInSignUp}
          />
          <Stack.Screen
            name="astrologychatlisting"
            component={isAuthenticated ? AstrologyChatHistory : SignInSignUp}
          />
          <Stack.Screen
            name="voicecall"
            component={isAuthenticated ? VoiceCallPage : SignInSignUp}
          />
          <Stack.Screen
            name="VoiceCallScreen"
            component={isAuthenticated ? VoiceCallScreen : SignInSignUp}
          />
          <Stack.Screen
            name="UserVoiceCallScreen"
            component={isAuthenticated ? UserVoiceCallScreen : SignInSignUp}
          />
          <Stack.Screen
            name="AstrologerVoiceCallScreen"
            component={isAuthenticated ? AstrologerVoiceCallScreen : SignInSignUp}
          />
          <Stack.Screen
            name="walletpage"
            component={isAuthenticated ? PaymentWalletHistory : SignInSignUp}
          />

          <Stack.Screen
            name="pujapage"
            component={isAuthenticated ? PujaPage : SignInSignUp}
          />

          <Stack.Screen
            name="livepuja"
            component={isAuthenticated ? VideoPlayer : SignInSignUp}
          />



          <Stack.Screen
            name="withdrawinformation"
            component={
              isAuthenticated ? AstrologerWithdrawallInformation : SignInSignUp
            }
          />
          <Stack.Screen
            name="matchmaking"
            component={
              isAuthenticated ? janamKundaliMatchmakingPage : SignInSignUp
            }
          />
          <Stack.Screen
            name="janamkundali"
            component={
              isAuthenticated ? janamKundaliMatchmakingPage : SignInSignUp
            }
          />

          <Stack.Screen
            name="panchangpage"
            component={isAuthenticated ? Panchang : SignInSignUp}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

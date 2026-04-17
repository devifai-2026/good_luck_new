import { useDispatch, useSelector } from "react-redux";
import {
  authFailed,
  authRequested,
  authSuccess,
  logOut,
  otpRequested,
  otpSuccess,
  otpFailed,
  updateAstrologerCategories,
  updateTransactionHistory,
  updateUserData,
} from "../redux/silces/auth.silce";

import { IUserDetails, UserRoleEnum } from "../redux/redux.constants";
import {
  addNewUser,
  deleteExistingUser,
  getAllCategoryAstrologer,
  getTransactionHistoryById,
  reSendOTP,
  sendOTP,
  updateOwnProfile,
  verifyOTP,
} from "../services";

import { clearOrder } from "../redux/silces/order.slice";
import { clearProductS } from "../redux/silces/product.slice";

import { RootState } from "../redux";
import { notifyMessage } from "./useDivineShopServices";
import { useNavigation } from "@react-navigation/native";
import useAstrologyServices from "./useAstrologyServices";
import socketServices from "./useSocketService";
import { useState } from "react";
import { dummyImageURL } from "../constants";
import { ProfileType } from "../services/constants";

export const bypassNumbers = [
  "7872358979",
  "7874447788",
  "9733524164",
  // "7679039012",
];

const useAuthService = () => {
  const dispatch = useDispatch();
  const verificationType = useSelector(
    (state: RootState) => state.auth.otpFlow
  );
  const phoneNumber = useSelector(
    (state: RootState) => state.auth.userDetails?.phoneNumber
  );

  const { getAstrologer, astrologerDetails } = useAstrologyServices();

  const [loading, setloading] = useState<boolean>(false);

  const [transactionHistoy, setTransactionHistoy] = useState<any[]>([]);

  const navigation = useNavigation<any>();
  const handleVerifyOTP = async (payload: any, navigation: any) => {
    dispatch(authRequested());
    // ("verifying");

    try {
      setloading(true);
      const response = await verifyOTP({
        payload,
        verificationType,
      });

      console.log(payload);

      const data = response?.data?.data;

      console.log(data, "after verifying");
      notifyMessage(response?.data?.message);
      if (response?.data?.data?.accessToken?.length > 0) {
        dispatch(
          authSuccess({
            fullName: `${data?.userDetails?.Fname ?? ""} ${data?.userDetails?.Lname ?? ""
              }`,

            phoneNumber: data?.phone,
            profilePicture:
              data?.userDetails?.profile_picture?.length > 0
                ? data?.userDetails?.profile_picture
                : dummyImageURL,
            gender: data?.userDetails?.gender,

            dateOfBirth: data?.userDetails?.date_of_birth,
            isProfileCreated: data?.userDetails?.Fname?.length > 0,
            accessToken: data?.accessToken,
            userID: data?.userId,
            matrimonyID: data?.matrimonyID,
            datingID: data?.datingID,
            isDatingSubscribed: data?.isDatingSubscribed ?? false,
            isMatrimonySubscribed: data?.isMatrimonySubscribed ?? false,
            role: data.role ?? UserRoleEnum.user,
            isAstrologerVerified:
              data?.astrologer_id !== undefined || data?.astrologer_id !== null,
            astrologerId: data?.astrologer?._id,
            underScoreId: data?._id,
            astrologerDetails: data?.astrologer,
            isSubscribed: data?.ads_subsCription?.isSubscribed,
            supernote: data?.superNote?.toString(),
            promocode: data?.promo_code,

            isLocalServiceSubscribed:
              data?.localSubscription?.isSubscribed ?? false,
            astrologerRequest: data?.astrologerRequest ?? null,
          })
        );
        const astrologerCategory = await getAllCategoryAstrologer();
        dispatch(updateAstrologerCategories(astrologerCategory?.data?.data));
        if (
          data?.role === UserRoleEnum.astrologer &&
          data?.astrologer?._id?.length > 0
        ) {
          navigation.reset({ index: 0, routes: [{ name: "astrologerhomeascreen" }] });
        } else if (data?.role === UserRoleEnum.astrologer && !data?.astrologer?._id) {
          const requestStatus = data?.astrologerRequest?.request_status;
          if (requestStatus === "pending") {
            navigation.reset({
              index: 0,
              routes: [{ name: "astrologerpendingstatus", params: { status: "pending" } }],
            });
          } else if (requestStatus === "rejected") {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "astrologerpendingstatus",
                  params: {
                    status: "rejected",
                    rejectionMessage: data?.astrologerRequest?.request_status_message || "",
                  },
                },
              ],
            });
          } else {
            // No pending/rejected request — astrologer hasn't submitted the form yet
            navigation.reset({ index: 0, routes: [{ name: "astrologerregistration" }] });
          }
        }
        else if (data?.role === UserRoleEnum.affiliateMarketer) {
          navigation.reset({ index: 0, routes: [{ name: "affiliateMarketerhome" }] });
        } else navigation.reset({ index: 0, routes: [{ name: "home" }] });
      } else {
        dispatch(authFailed("Something went wrong"));
      }
    } catch (error: any) {
      dispatch(authFailed("Something went wrong"));
      // Show actual error message from server if available
      const errorMessage = error?.response?.data?.message || "Wrong OTP";
      notifyMessage(errorMessage);
      console.log("OTP verification error:", error?.response?.data || error.message);
    } finally {
      setloading(false);
    }
  };

  const handleSendOTP = async (payload: any) => {
    try {
      setloading(true);
      dispatch(otpRequested());

      const response = await sendOTP(payload);

      const data = response?.data?.data;
      console.log(data);
      navigation.navigate("otpverify");
      dispatch(
        otpSuccess({
          phoneNumber: payload?.phone,
          verificationId: data?.otpData?.data?.verificationId,
        })
      );
      notifyMessage(response?.data?.message);

      //data);
    } catch (error: any) {
      {
        notifyMessage("User not registered");
        navigation.navigate("signup");
        dispatch(otpFailed(error));
      }
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setloading(true);
      if (verificationType === "signin") {
        const response = await reSendOTP({ phone: phoneNumber });
        // (response?.data?.data);
        notifyMessage(response?.data?.message);
        dispatch(
          otpSuccess({
            // phoneNumber: payload?.phone,
            verificationId: response?.data?.data?.otpData?.data?.verificationId,
          })
        );
      } else {
        handleRegisterNewUser({ phone: phoneNumber });
      }
    } catch (error: any) {
      notifyMessage(error?.data?.message);
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleRegisterNewUser = async (payload: any) => {
    try {
      setloading(true);
      dispatch(authRequested());

      // ("here");
      const response = await addNewUser({
        ...payload,
        isActive: true,
        isAstrologer: payload.checked === "astrologer",
        isAffiliate_marketer: payload.checked === "affiliatemarketer",
        isAdmin: false,
      });
      console.log(response?.data?.data);
      notifyMessage(response?.data?.message);
      dispatch(
        otpSuccess({
          phoneNumber: payload?.phone,
          verificationId: response?.data?.data?.otpData?.data?.verificationId,
        })
      );
      navigation.navigate("otpverify");

      // (response?.data?.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "User already registered";
      notifyMessage(errorMessage);
      // If user is already registered, navigate to signin
      if (error?.response?.status === 409) {
        navigation.navigate("signin");
      }
      dispatch(authFailed("Something went wrong"));
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const getTransactionHistory = async (userId: string, type: UserRoleEnum) => {
    try {
      setloading(true);
      let response;

      response = await getTransactionHistoryById(userId, type);
      if (type === UserRoleEnum.user)
        dispatch(
          updateTransactionHistory(
            response?.data?.data?.transactionHistory?.reverse()
          )
        );
      else
        dispatch(
          updateTransactionHistory(
            response?.data?.data?.transactions?.reverse()
          )
        );
      // setTransactionHistoy(response?.data?.data?.transactionHistory?.reverse());
    } catch (error: any) {
      console.error(error?.message);
    } finally {
      setloading(false);
    }
  };

  const updateProfile = async (userId: string, body: any) => {
    try {
      setloading(true);
      const response = await updateOwnProfile(userId, body);
      const data = response?.data?.data;
      const newData: Partial<IUserDetails> = {
        fullName: `${data?.Fname} ${data?.Lname}`,

        phoneNumber: data?.phone,
        profilePicture: data?.profile_picture,
        gender: data?.gender,

        dateOfBirth: data?.date_of_birth,
        isProfileCreated: true,
      };
      dispatch(updateUserData(newData));
      navigation.navigate("userprofile");
    } catch (error: any) {
      console.error(error?.message);
    } finally {
      setloading(false);
    }
  };

  const handleLogOut = () => {
    dispatch(logOut());

    dispatch(clearOrder());
    dispatch(clearProductS());
    socketServices.disConnect(() => {
      console.log("Closed socket for logout");
    });

    notifyMessage("Logged out successfully");
  };

  const handleDeleteAccount = async (userId: string, callBack?: any) => {
    try {
      setloading(true);
      const response = await deleteExistingUser(userId);
      console.log(response?.data?.data);
      notifyMessage(response?.data?.message);
      if (callBack) callBack();
      handleLogOut();
      navigation.navigate("signup");
    } catch (error: any) {
      console.error(error?.message);
    } finally {
      setloading(false);
    }
  };

  return {
    handleVerifyOTP,
    handleLogOut,
    handleSendOTP,
    handleRegisterNewUser,
    handleResendOTP,
    getTransactionHistory,
    updateProfile,
    handleDeleteAccount,
    loading,
    transactionHistoy,
  };
};

export default useAuthService;

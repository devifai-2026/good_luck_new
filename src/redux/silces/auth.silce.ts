import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  IAstrologyChatDetails,
  IAuthState,
  IAuthStateInitialState,
  IUserDetails,
  IUserDetailsInitialState,
} from "../redux.constants";
import { ProfileType } from "../../services/constants";

export const authSlice = createSlice({
  name: "auth",
  initialState: IAuthStateInitialState,

  reducers: {
    otpRequested: (state: IAuthState) => {
      return {
        ...state,
        isLoading: true,
      };
    },

    otpSuccess: (
      state: IAuthState,
      action: PayloadAction<Partial<IUserDetails>>
    ) => {
      return {
        ...state,
        isLoading: false,
        userDetails: { ...state.userDetails, ...action.payload },
      };
    },

    otpFailed: (state: IAuthState, action: PayloadAction<any>) => {
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        userDetails: {
          ...IUserDetailsInitialState,
          phoneNumber: state.userDetails?.phoneNumber,
        },
        errormessege: action.payload,
      };
    },
    authRequested: (state: IAuthState) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    authSuccess: (
      state: IAuthState,
      action: PayloadAction<Partial<IUserDetails>>
    ) => {
      // console.log(action.payload);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        userDetails: {
          ...state.userDetails,
          profilePicture: action.payload.profilePicture,
          fullName: action.payload.fullName,
          dateOfBirth: action.payload.dateOfBirth,
          gender: action.payload.gender,
          isProfileCreated: action.payload.isProfileCreated,
          email: action.payload.email,
          verificationId: action.payload.verificationId,
          phoneNumber: state.userDetails?.phoneNumber,
          userID: action.payload.userID,
          accessToken: action.payload.accessToken,
          matrimonyID: action.payload.matrimonyID,
          datingID: action.payload.datingID,
          role: action.payload.role,
          isDatingSubscribed: action.payload.isDatingSubscribed,
          isMatrimonySubscribed: action.payload.isMatrimonySubscribed,
          isAstrologerVerified: action.payload.isAstrologerVerified,
          astrologerId: action.payload.astrologerId,
          underScoreId: action.payload.underScoreId,
          isSubscribed: action.payload.isSubscribed,
          astrologerDetails: action.payload.astrologerDetails,
          supernote: action.payload.supernote,
          promocode: action.payload.promocode,
          isLocalServiceSubscribed: action.payload.isLocalServiceSubscribed,
          astrologerRequest: action.payload.astrologerRequest,
        },
      };
    },
    authFailed: (state: IAuthState, action: PayloadAction<any>) => {
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,

        userDetails: {
          ...IUserDetailsInitialState,
          phoneNumber: state.userDetails?.phoneNumber,
          verificationId: state.userDetails?.verificationId,
        },
        errormessege: action.payload,
      };
    },

    logOut: (state: IAuthState) => {
      return {
        ...IAuthStateInitialState,
      };
    },

    setOtpFlow: (
      state: IAuthState,
      action: PayloadAction<"signin" | "signup">
    ) => {
      return {
        ...state,
        otpFlow: action.payload,
      };
    },

    updateUserData: (
      state: IAuthState,
      action: PayloadAction<Partial<IUserDetails>>
    ) => {
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          ...action.payload,
        },
      };
    },

    updateProfileType: (
      state: IAuthState,
      action: PayloadAction<ProfileType>
    ) => {
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          currentFlow: action.payload,
        },
      };
    },

    updateActiveId: (
      state: IAuthState,
      action: PayloadAction<{ id: string }>
    ) => {
      // (action.payload, "inside slice");
      return {
        ...state,
        currentProfileId: action.payload.id,
      };
    },

    updateActiveMatchId: (
      state: IAuthState,
      action: PayloadAction<{ id: string }>
    ) => {
      // (action.payload, "inside slice");
      return {
        ...state,
        currentMatchId: action.payload.id,
      };
    },

    updateSocketState: (state: IAuthState) => {
      return {
        ...state,
        isSocketConnected: !state.isSocketConnected,
      };
    },

    updateActiveAstrologerDetail: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      // (action.payload, "inside slice");
      return {
        ...state,
        currentAstrologerDetails: action.payload,
      };
    },

    updateAstrologyChatDetails: (
      state: IAuthState,
      action: PayloadAction<Partial<IAstrologyChatDetails>>
    ) => {
      return {
        ...state,
        astrologyChatDetails: {
          ...state.astrologyChatDetails,
          ...action.payload,
        },
      };
    },

    addNewChatRequestinList: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        astrologerChatRequests: [
          ...state.astrologerChatRequests,
          action.payload,
        ],
      };
    },
    removeChatRequestFromList: (
      state: IAuthState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        astrologerChatRequests: state.astrologerChatRequests.filter(
          (req) => req?.id !== action.payload
        ),
      };
    },

    updateCurrentAdDetails: (state: IAuthState, action: PayloadAction<any>) => {
      return {
        ...state,
        currentAdDetails: action.payload,
      };
    },

    updateCurrentCallDetails: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        astrologyCallDetails: action.payload,
      };
    },

    addNewCallRequestInList: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        astrologerCallRequests: [
          action.payload,
          ...state.astrologerCallRequests,
        ],
      };
    },

    removeCallRequestFromList: (
      state: IAuthState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        astrologerCallRequests: state.astrologerCallRequests.filter(
          (req) => req?.id !== action.payload
        ),
      };
    },

    updateMatrimonyProfileSeenCount: (
      state: IAuthState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        matrimonyProfileSeenCount: action.payload,
      };
    },
    updateDatingProfileSeenCount: (
      state: IAuthState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        datingProfileSeenCount: action.payload,
      };
    },

    updateCurrentProfileDetails: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        profileDetails: action.payload,
      };
    },

    updateWallet: (state: IAuthState, action: PayloadAction<any>) => {
      return {
        ...state,
        wallet: action.payload,
      };
    },

    updateTransactionHistory: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        transactionHistory: action.payload,
      };
    },

    updateCurrentAstrologerReviews: (
      state: IAuthState,
      action: PayloadAction<any[]>
    ) => {
      return {
        ...state,
        astroloReview: action.payload,
      };
    },

    updateAstrologerCategories: (
      state: IAuthState,
      action: PayloadAction<any[]>
    ) => {
      return {
        ...state,
        astrologerCategories: action.payload,
      };
    },

    updateChatprofileDetails: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        currentChatUserDetails: action.payload,
      };
    },

    updateChatDuration: (state: IAuthState, action: PayloadAction<number>) => {
      return {
        ...state,
        astrologyChatDetails: {
          ...state.astrologyChatDetails,
          chatStartTime: action.payload + 1,
        },
      };
    },

    updateAstrologerState: (
      state: IAuthState,
      action: PayloadAction<boolean>
    ) => {
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          isToggleon: action.payload,
        },
      };
    },

    updateCurrentLocalServiceCategory: (
      state: IAuthState,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      return {
        ...state,
        currentLocalServiceCategory: action.payload,
      };
    },

    updateUserCallDetails: (state: IAuthState, action: PayloadAction<any>) => {
      return {
        ...state,
        userCallDetails: action.payload,
      };
    },

    updateAstrologyCallDetails: (
      state: IAuthState,
      action: PayloadAction<any>
    ) => {
      return {
        ...state,
        astrologyCallDetails: action.payload,
      };
    },

    clearUserCallDetails: (state: IAuthState) => {
      return {
        ...state,
        userCallDetails: null,
      };
    },

    clearAstrologyCallDetails: (state: IAuthState) => {
      return {
        ...state,
        astrologyCallDetails: null,
      };
    },
  },
});
export const {
  authRequested,
  authSuccess,
  authFailed,
  otpRequested,
  otpSuccess,
  otpFailed,
  setOtpFlow,
  logOut,
  updateUserData,
  updateProfileType,
  updateActiveId,
  updateActiveMatchId,
  updateActiveAstrologerDetail,
  updateSocketState,
  updateAstrologyChatDetails,
  updateAstrologyCallDetails,
  addNewChatRequestinList,
  removeChatRequestFromList,
  updateCurrentAdDetails,
  updateCurrentCallDetails,
  addNewCallRequestInList,
  removeCallRequestFromList,
  updateDatingProfileSeenCount,
  updateMatrimonyProfileSeenCount,
  updateCurrentProfileDetails,
  updateWallet,
  updateTransactionHistory,
  updateCurrentAstrologerReviews,
  updateAstrologerCategories,
  updateChatprofileDetails,
  updateChatDuration,
  updateAstrologerState,
  updateCurrentLocalServiceCategory,
  updateUserCallDetails,
  clearUserCallDetails,
  clearAstrologyCallDetails,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

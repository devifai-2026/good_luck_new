import { ChatStatus } from "../components/Chat/astrologyChatUI";
import { PostCategory, PostType } from "../hooks/useAdvertisementService";
import { ProfileType } from "../services/constants";

export enum ChipValue {
  address = "address",
  city = "city",
  state = "state",
  pincode = "pincode",
}
export interface IAstrologyChatDetails {
  roomId: string;
  chatStatus: ChatStatus;
  chatStartTime: any;
  timer: number;
}
export interface IAuthState {
  otpFlow: "signin" | "signup";
  isLoading: boolean;
  isAuthenticated: boolean;
  userDetails: IUserDetails | null;
  currentProfileId?: string | null;
  currentMatchId?: string | null;
  currentAstrologerDetails?: any;
  isSocketConnected: boolean;
  socketId: string;
  astrologyChatDetails: IAstrologyChatDetails;
  astrologyCallDetails: any;
  astrologerChatRequests: any[];
  astrologerCallRequests: any[];
  currentAdCategory?: PostCategory;
  currentPostType?: PostType;
  currentAdPostDetails?: any;
  currentAdDetails?: any;
  matrimonyProfileSeenCount?: number;
  datingProfileSeenCount?: number;
  profileDetails?: any;
  wallet?: any;
  transactionHistory?: any[];
  astroloReview?: any[];
  astrologerCategories?: any[]; //
  currentChatUserDetails?: any;
  currentLocalServiceCategory?: { id: string; name: string };
  userCallDetails: any;
}

export enum UserRoleEnum {
  user = "user",
  astrologer = "astrologer",
  affiliateMarketer = "affiliate_marketer",
}

export interface IUserDetails {
  profilePicture?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  verificationId?: string;
  userID?: string | null;
  accessToken?: string | null;
  userName?: string;
  supernote?: string;
  promocode?: string;
  email?: string;
  phoneNumber?: string;
  datingID?: string | null;
  matrimonyID?: string | null;
  datingProfileDetails?: any;
  matrimonyProfileDetails?: any;
  isMatrimonySubscribed?: boolean;
  isDatingSubscribed?: boolean;
  currentFlow?: ProfileType;
  role?: UserRoleEnum;
  socketID?: string;
  isAstrologerVerified?: boolean;
  astrologerId?: string;
  underScoreId?: string;
  astrologerDetails?: any;
  isSubscribed?: boolean;
  isProfileCreated?: boolean;
  isToggleon?: boolean;
  astrologerStateLoading?: boolean;
  isLocalServiceSubscribed?: boolean;
  selectedChipValue?: ChipValue;
  searchText?: string;
  wallet?: any;
}

export const IChatInitialState: IAstrologyChatDetails = {
  roomId: "",
  chatStatus: ChatStatus.idle,
  chatStartTime: 0,
  timer: 0,
};

export const IUserDetailsInitialState: IUserDetails = {
  userID: null,
  accessToken: null,
  userName: "",

  email: "",
  phoneNumber: "",
  currentFlow: ProfileType?.own,
  role: UserRoleEnum.user,
  isSubscribed: false,
  isProfileCreated: false,
  astrologerStateLoading: false,
  selectedChipValue: ChipValue.address,
};

export const IAuthStateInitialState: IAuthState = {
  astroloReview: [],
  otpFlow: "signin",
  isLoading: false,
  isAuthenticated: false,
  userDetails: IUserDetailsInitialState,
  isSocketConnected: false,
  socketId: "",
  astrologyChatDetails: IChatInitialState,
  astrologerChatRequests: [],
  astrologerCallRequests: [],
  astrologyCallDetails: null,
  userCallDetails: null,
};

export interface IOrderState {
  currentOrderDetails: any;

  disableButton: boolean;
}

export interface IProductState {
  isLoading: boolean;

  productDetails: any;
}

export const productInitialState: IProductState = {
  isLoading: false,

  productDetails: null,
};

export const orderInitialState: IOrderState = {
  currentOrderDetails: null,

  disableButton: false,
};

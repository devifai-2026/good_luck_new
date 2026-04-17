import axios from "axios";
import { endPoints, enviornment, ProfileType, URLs } from "./constants";
import { authClient, baseClient } from "./services.clients";
import {
  HomeLandCategory,
  JobCategory,
} from "../hooks/useAdvertisementService";
import { UserRoleEnum } from "../redux/redux.constants";

export const verifyOTP = (payload: any) => {
  // (payload?.payload, payload?.verificationType);

  return authClient.post(
    payload?.verificationType === "signin"
      ? endPoints.verifyOTP
      : endPoints.newUserVerifyOTP,
    payload?.payload
  );
};

export const sendOTP = (payload: any) => {
  return authClient.post(endPoints.getOTP, payload);
};

export const reSendOTP = (payload: any) => {
  return authClient.post(endPoints.resendOTP, payload);
};

export const addNewUser = (payload: any) => {
  // ("again and again");
  return baseClient.post(endPoints.addNewUser, payload);
};

export const deleteExistingUser = (userId: string) => {
  return baseClient.delete(endPoints.deleteUser + "/" + userId);
};

export const getTransactionHistoryById = (
  userId: string,
  type: UserRoleEnum
) => {
  console.log(userId);
  return baseClient.get(
    type === UserRoleEnum.user
      ? endPoints.getTranstactionHistory + "/" + userId
      : endPoints.getAstrologerTransactionHistory + "/" + userId
  );
};

export const validatePromoCode = (body: any) => {
  return baseClient.post(endPoints.validatePromoCode, body);
};

export const withdrawRequest = (payload: any) => {
  return baseClient.post(endPoints.withDrawRequest, payload);
};

export const updateOwnProfile = (userId: string, body: any) => {
  return baseClient.patch(endPoints.updateProfile + "/" + userId, body);
};

export const getCategoryList = () => {
  return baseClient.get(endPoints.categoryList);
};

export const getAllProductList = () => {
  return baseClient.get(endPoints.productList);
};

export const getProductListbyCategory = (params: string) => {
  return baseClient.get(endPoints.productListByCategory + "/" + params);
};

export const getProductDetailsById = (params: string) => {
  return baseClient.get(endPoints.productDetailsById + "/" + params);
};

export const createOrder = (payload: any) => {
  return baseClient.post(endPoints.createOrder, payload);
};

export const addProduct = (payload: any) => {
  return baseClient.post(endPoints.addProduct, payload);
};

export const getOrderList = (params?: string) => {
  return baseClient.get(endPoints.orderList + "/" + params);
};

export const getOrderDetails = (params: any) => {
  return baseClient.get(endPoints.orderDetails + "/" + params);
};

export const addNewCategory = (payload: any) => {
  return baseClient.post(endPoints.addCategory, payload);
};

export const createRazorPayOrder = (payload: any) => {
  return baseClient.post(endPoints.createRazorPayorder, payload);
};

export const createMatrimonyProfile = (payload: any, userId: string) => {
  return baseClient.post(
    endPoints.createMatrimonyProfile + "/" + userId,
    payload
  );
};

export const updateMatrimonyProfile = (payload: any, userId: string) => {
  return baseClient.patch(
    endPoints.updateMatrimonyProfile + "/" + userId,
    payload
  );
};

export const getMatrimonyProfiles = (id: string) => {
  return baseClient.get(endPoints.getAllMatrimonyProfile + "/" + id);
};

export const getTopFiveBrideProfiles = () => {
  return baseClient.get(endPoints.getTopFiveBrideProfile);
};

export const getTopFiveGroomProfiles = () => {
  return baseClient.get(endPoints.getTopFiveGroomProfile);
};

export const getMatrimonyProfileDetails = (userId: string) => {
  // (userId, "inside services")
  return baseClient.get(endPoints.getMatrimonyProfileById + "/" + userId);
};

export const subsCribeForMatrimony = (body: any) => {
  return baseClient.post(endPoints.matrimonySubscribe, body);
};

export const createDatingProfile = (payload: any, userId: string) => {
  return baseClient.post(endPoints.createDatingProfile + "/" + userId, payload);
};

export const updateDatingProfile = (payload: any, userId: string) => {
  return baseClient.patch(
    endPoints.updateDatingProfile + "/" + userId,
    payload
  );
};

export const getDatingProfiles = (id: string) => {
  return baseClient.get(endPoints.getAllDatingProfile + "/" + id);
};

export const getDatingProfileDetails = (userId: string) => {
  // (userId, "inside services")
  return baseClient.get(endPoints.getDatingProfileById + "/" + userId);
};

export const subscribeForDating = (body: any) => {
  return baseClient.post(endPoints.datingSubscribe, body);
};

export const getAllPlans = (type: ProfileType | "ads" | "localservices") => {
  return baseClient.get(
    type === ProfileType.dating
      ? endPoints.getDatingPlans
      : type === ProfileType.matrimony
      ? endPoints.getMatrimonyPlans
      : type === "ads"
      ? endPoints.getAllsubscribtionForads
      : endPoints.getLocalServicePlans
  );
};

export const getAstrologyChatList = (userId: string) => {
  return baseClient.get(endPoints.getAstrologerChatList + "/" + userId);
};

export const getAstrologyChatDetails = (
  userId: string,
  astrologerId: string
) => {
  console.log(userId, astrologerId);
  return baseClient.get(
    endPoints.getAstrologerChatDetailsByUserAndAstrologerId +
      "/" +
      userId +
      "/" +
      astrologerId
  );
};

export const getAllMatrimonySendLikes = (body: string) => {
  return baseClient.get(endPoints.getMatrimonySentLikes + "/" + body);
};

export const getAllMatrimonyRecivedLikes = (body: string) => {
  return baseClient.get(endPoints.getMatrimonyReceivedLikes + "/" + body);
};

export const getAllDatingSendLikes = (body: string) => {
  return baseClient.get(endPoints.getDatingSentLikes + "/" + body);
};

export const getAllDatingRecivedLikes = (body: string) => {
  return baseClient.get(endPoints.getDatingRecivedLikes + "/" + body);
};

export const sendDatingLikeByProfileId = (userId: string, likeId: string) => {
  return baseClient.post(
    endPoints.sendDatingLike + "/" + userId + "/" + likeId
  );
};

export const sendMatrimonyLikeByProfileId = (
  userId: string,
  likeId: string
) => {
  return baseClient.post(
    endPoints.sendMatrimonyLike + "/" + userId + "/" + likeId
  );
};

export const getAllMatches = (userId: string) => {
  return baseClient.get(endPoints.getAllMatches + "/" + userId);
};

export const getAllMessagesByMatchesID = (matchId: string) => {
  return baseClient.get(endPoints.getAllMessagesByMatchesID + "/" + matchId);
};

export const postCreateChatRoomByUserId = (body: {
  user1: string;
  user2: string;
}) => {
  return baseClient.post(endPoints.createChatRoomByProfileId, body);
};

export const getAllAstrologerList = () => {
  return baseClient.get(endPoints.getAllAstrologer);
};

export const getFilteredAstrologerList = (body: any) => {
  return baseClient.post(endPoints.getFilteredAsrologer, body);
};

export const getAstrologerDetailsById = (astrologerId: string) => {
  return baseClient.get(endPoints.getAstrologerById + "/" + astrologerId);
};

export const createNewAstrologer = (body: any) => {
  return baseClient.post(endPoints.createAstrologer, body);
};

export const updateAstrologer = (body: any, userId: string) => {
  return baseClient.post(endPoints.updateAstrologer + "/" + userId, body);
};

export const updateAstrologerOTPVerify = (body: any, userId: string) => {
  return baseClient.patch(endPoints.updateProfileOTP + "/" + userId, body);
};

export const postReviewRatingForAstrologer = (
  body: any,
  astrologerId: string
) => {
  return baseClient.post(
    endPoints.postReviewRatingForAstrologer + "/" + astrologerId,
    body
  );
};

export const getReviewRatingByAstrologerId = (astrologerId: string) => {
  return baseClient.get(
    endPoints.getReviewRatingForAstrologer + "/" + astrologerId
  );
};

export const addMoneyInWalletById = (
  id: string,
  payload: { amount: number; description: string; transactionid: string }
) => {
  return baseClient.patch(endPoints.addMoneyInWallet + "/" + id, payload);
};

export const getAstrologerWallet = (id: string) => {
  return baseClient.get(endPoints.getAstroWalletBalance + "/" + id);
};

export const getUserWallet = (id: string) => {
  return baseClient.get(endPoints.getWalletBalance + "/" + id);
};

// Job Banner Post Functions
export const createJobBannerPost = (body: any) => {
  return baseClient.post(endPoints.createJobBannerPost, body);
};

export const getAllJobBannerPosts = (type: JobCategory) => {
  return baseClient.get(endPoints.getAllJobBannerPostByType + "/" + type);
};

export const getDashBoardAds = () => {
  return baseClient.get(endPoints.getDashboardAds);
};

export const getJobBannerPostById = (id: string) => {
  return baseClient.get(endPoints.getAllJobBannerPostById + "/" + id);
};

export const getJobBannerDetailsById = (id: string) => {
  return baseClient.get(endPoints.getJobBannerDetailsById + "/" + id);
};

export const updateJobBannerPost = (id: string, body: any) => {
  return baseClient.patch(endPoints.updateJobBannerPost + "/" + id, body);
};

export const deleteJobBannerPost = (userId: string, id: string) => {
  return baseClient.delete(
    endPoints.deleteJobBannerPost + "/" + userId + "/" + id
  );
};

// Job Text Post Functions
export const createJobTextPost = (body: any) => {
  return baseClient.post(endPoints.createJobTextPost, body);
};

export const getAllJobTextPosts = (type: JobCategory) => {
  return baseClient.get(endPoints.getAllJobTextPostByType + "/" + type);
};

export const getJobTextPostById = (id: string) => {
  return baseClient.get(endPoints.getAllJobTextPostById + "/" + id);
};

export const getJobTextDetailsById = (id: string) => {
  return baseClient.get(endPoints.getJobTextDetailsById + "/" + id);
};

export const updateJobTextPost = (id: string, body: any) => {
  return baseClient.patch(endPoints.updateJobTextPost + "/" + id, body);
};

export const deleteJobTextPost = (userId: string, id: string) => {
  return baseClient.delete(
    endPoints.deleteJobTextPost + "/" + userId + "/" + id
  );
};

// Home and Land Banner Post Functions
export const createHomeAndLandBannerPost = (body: any) => {
  return baseClient.post(endPoints.createHomeAndLandBannerPost, body);
};

export const getAllHomeAndLandBannerPosts = (type: HomeLandCategory) => {
  return baseClient.get(
    endPoints.getAllHomeAndLandBannerPostByType + "/" + type
  );
};

export const getHomeAndLandBannerPostById = (id: string) => {
  return baseClient.get(endPoints.getAllHomeAndLandBannerPostById + "/" + id);
};

export const getHomeAndLandBannerDetailsById = (id: string) => {
  return baseClient.get(endPoints.getHomeAndLandBannerDetailsById + "/" + id);
};

export const updateHomeAndLandBannerPost = (id: string, body: any) => {
  return baseClient.patch(
    endPoints.updateHomeAndLandBannerPost + "/" + id,
    body
  );
};

export const deleteHomeAndLandBannerPost = (userId: string, id: string) => {
  return baseClient.delete(
    endPoints.deleteHomeAndLandBannerPost + "/" + userId + "/" + id
  );
};

// Home and Land Text Post Functions
export const createHomeAndLandTextPost = (body: any) => {
  return baseClient.post(endPoints.createHomeAndLandTextPost, body);
};

export const getAllHomeAndLandTextPosts = (type: HomeLandCategory) => {
  return baseClient.get(endPoints.getAllHomeAndLandTextPostByType + "/" + type);
};

export const getHomeAndLandTextPostById = (id: string) => {
  return baseClient.get(endPoints.getAllHomeAndLandTextPostById + "/" + id);
};

export const getHomeAndLandTextDetailsById = (id: string) => {
  return baseClient.get(endPoints.getHomeAndLandTextDetailsById + "/" + id);
};

export const updateHomeAndLandTextPost = (id: string, body: any) => {
  return baseClient.patch(endPoints.updateHomeAndLandTextPost + "/" + id, body);
};

export const deleteHomeAndLandTextPost = (userId: string, id: string) => {
  return baseClient.delete(
    endPoints.deleteHomeAndLandTextPost + "/" + userId + "/" + id
  );
};

export const subscribeForAdvertisement = (payload: {
  userId: string;
  planType: "one_month_plan" | "one_year_plan";
  transactionid: string;
}) => {
  //payload, endPoints.subscribeForAdvertisement);
  return baseClient.post(endPoints.subscribeForAdvertisement, payload);
};

export const getAllCategoryAstrologer = () => {
  return baseClient.get(endPoints.getAstrologerAllCategory);
};

export const getAstrologerRequestStatus = (userId: string) => {
  return baseClient.get(endPoints.getAstrologerRequestStatus + "/" + userId);
};

export const postCreateMatchMaking = (userId: string, body: any) => {
  return baseClient.post(endPoints.createMatchMaking + "/" + userId, body);
};

export const postCreateKundali = (userId: string, body: any) => {
  return baseClient.post(endPoints.createKundaliRequest + "/" + userId, body);
};

export const getPanchangByDate = (date: string) => {
  return baseClient.get(endPoints.getPanchangByDate + "/" + date);
};

export const getRashifalByDate = (date: string) => {
  return baseClient.get(endPoints.rashiFalGetByDate + "/" + date);
};

export const getCalender = () => {
  return baseClient.get(endPoints.calenderGetAll);
};

export const getDakshina = () => {
  return baseClient.get(endPoints.dakshinaGetAll);
};

export const getLiveTV = () => {
  return baseClient.get(endPoints.getLiveTV);
};

export const getCalenderEventsByType = (type: string) => {
  return baseClient.get(endPoints.getCalenderEventsByType + "/" + type);
};

export const postDakshinaPayment = (body: any) => {
  return baseClient.post(endPoints.postDakshinaPayment, body);
};

export const updateAstrologerActiveState = (body: any) => {
  return baseClient.patch(endPoints.toogleAstrologerState, body);
};

export const getAllLocalServiceCategory = () => {
  return baseClient.get(endPoints.getAllLocalServiceCategory);
};

export const getLocalServiceByCategory = (categoryId: string) => {
  return baseClient.get(
    endPoints.getAllLocalServiceByCategory + "/" + categoryId
  );
};

export const createLocalServiceRequest = (body: any) => {
  return baseClient.post(endPoints.createLocalService, body);
};

export const subscribeForLocalService = (body: any) => {
  return baseClient.post(endPoints.subscribeForLocalService, body);
};

export const getLocalServicePlans = () => {
  return baseClient.get(endPoints.getLocalServicePlans);
};

export const filterLocalService = (params: any) => {
  return baseClient.get(endPoints.filterLocalService + "?" + params);
};

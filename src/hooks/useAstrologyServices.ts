import {
  getAstrologyChatDetails,
  getAstrologyChatList,
  getFilteredAstrologerList,
  getReviewRatingByAstrologerId,
  postReviewRatingForAstrologer,
  updateAstrologer,
  updateAstrologerOTPVerify,
} from "./../services/index";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  createNewAstrologer,
  getAllAstrologerList,
  getAstrologerDetailsById,
  getAstrologerWallet,
  getUserWallet,
} from "../services";
import { IAstrologer } from "../components/User/astrologerList";

import { useDispatch, useSelector } from "react-redux";
import {
  updateCurrentAstrologerReviews,
  updateUserData,
  updateWallet,
} from "../redux/silces/auth.silce";
import { UserRoleEnum } from "../redux/redux.constants";
import { useNavigation } from "@react-navigation/native";
import { notifyMessage } from "./useDivineShopServices";
import { RootState } from "../redux";
import { dummyImageURL } from "../constants";

interface Astrologer {
  id: number;
  name: string;
  // Add other relevant fields here
}

const useAstrologyServices = () => {
  const [astrologerList, setAstrologerList] = useState<IAstrologer[]>([]);
  const [filteredastrologerList, setFilteredAstrologerList] = useState<
    IAstrologer[]
  >([]);

  // const [wallet, setwallet] = useState<any>(null);

  const [astrologerDetails, setAstrologerDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // const [reviews, setreviews] = useState<any[]>([]);

  const [astrologyChatList, setastrologyChatList] = useState<any[]>([]);

  const [astrologyMessageList, setAstrologyMessageList] = useState<any[]>([]);

  const navigation = useNavigation<any>();

  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const astrologerId = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerId
  );
  const reviews =
    useSelector((state: RootState) => state.auth.astroloReview) ?? [];
  const dispatch = useDispatch();

  const getAstrologerList = async (filter: string) => {
    setLoading(true);
    try {
      // //filter);
      setAstrologerList([]);
      let response;
      if (filter?.length === 0) response = await getAllAstrologerList();
      else
        response = await getFilteredAstrologerList({
          specializations: [filter],
        });
      // //response?.data?.data, "getting response");
      const updatedAstrologerList = response?.data?.data.map((profile: any) =>
        formatAstrologerProfileForList(profile)
      );
      // //updatedAstrologerList);
      setAstrologerList(updatedAstrologerList);
    } catch (error) {
      console.error("Error fetching astrologer list:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAstrologer = async (id: string) => {
    setLoading(true);
    try {
      const response = await getAstrologerDetailsById(id);
      const formattedData = formatAstrologerProfileForList(
        response?.data?.data
      );
      setAstrologerDetails(formattedData);
    } catch (error) {
      console.error("Error fetching astrologer:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAstrologer = async (astrologer: any) => {
    setLoading(true);
    try {
      // //astrologer);
      const response = await createNewAstrologer(astrologer);
      // //response?.data?.data);
      // setAstrologerList([...astrologerList, response.data]);

      dispatch(
        updateUserData({
          astrologerId: undefined,
          isAstrologerVerified: false,
        })
      );
      navigation.navigate("astrologerhomeascreen");
    } catch (error) {
      console.error("Error creating astrologer:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWalletBalance = async (id: string, type: UserRoleEnum) => {
    try {
      if (type === UserRoleEnum.astrologer) {
        const response = await getAstrologerWallet(id);

        dispatch(updateWallet(response?.data?.data));
      } else {
        // //"user wallet");
        const response = await getUserWallet(id);
        dispatch(updateWallet(response?.data?.data));
        // //response?.data?.data);
      }
    } catch (error: any) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const updateAstrologerProfile = async (
    body: any,
    userId: string,
    openModal: any
  ) => {
    setLoading(true);
    try {
      const response = await updateAstrologer(body, userId);
      notifyMessage(response?.data?.message);
      // openModal();
      //response?.data?.data);
      // dispatch(updateUserData({ astrologerDetails: response.data?.data }));
    } catch (error: any) {
      console.error(error?.message);
      notifyMessage(error?.message ?? "Unable to update astrologer profile");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPForProfileUpdate = async (
    body: any,
    userId: any,
    openModal: any
  ) => {
    setLoading(true);
    try {
      const response = await updateAstrologerOTPVerify(body, userId);
      notifyMessage(response?.data?.message);
      dispatch(
        updateUserData({ astrologerDetails: response.data?.data?.astrologer })
      );
      openModal();
      navigation.goBack();
    } catch (error: any) {
      console.error(error?.message);
      notifyMessage(error?.message ?? "Wrong OTP");
    } finally {
      setLoading(false);
    }
  };

  const giveRatingAndReview = async (
    body: {
      rating: number;
      comment: string;
    },
    astrologerId: string,
    successCallBack: any
  ) => {
    setLoading(true);
    try {
      const response = await postReviewRatingForAstrologer(
        { ...body, userId },
        astrologerId
      );
      notifyMessage(response?.data?.message);
      //response?.data?.data);
      // dispatch(updateUserData({ astrologerDetails: response.data?.data }));
      successCallBack();
      dispatch(
        updateCurrentAstrologerReviews([
          formatReviewForListing(response?.data?.data),
          ...reviews,
        ])
      );
    } catch (error: any) {
      console.error(error?.message);
      notifyMessage(error?.message ?? "Unable to post review");
    } finally {
      setLoading(false);
    }
  };

  const getRatingReviewById = async (astrologerId: string) => {
    try {
      setLoading(true);
      const response = await getReviewRatingByAstrologerId(astrologerId);
      //response?.data?.data);
      dispatch(
        updateCurrentAstrologerReviews(
          response?.data?.data.reverse().map(formatReviewForListing)
        )
      );
      // setreviews(response?.data?.data.reverse().map(formatReviewForListing));
    } catch (error: any) {
      console.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const astrologerChatListById = async (userId: string) => {
    try {
      setLoading(true);
      const response = await getAstrologyChatList(userId);
      //response?.data?.data);
      setastrologyChatList(response?.data?.data?.map(formatMessageListing));
      //response?.data?.data?.map(formatMessageListing));
    } catch (error) {
      console.error("Error fetching astrologer chat list:", error);
    } finally {
      setLoading(false);
    }
  };

  const astrologerMessageListing = async (
    userId: string,
    anotherUserId: string,
    isAstrologer: boolean
  ) => {
    try {
      setLoading(true);
      console.log("getting astrologerid ", anotherUserId);
      console.log("userId ", userId);
      const response = await getAstrologyChatDetails(userId, anotherUserId);
      console.log(response?.data?.data[0]?.messages, "getting all message");
      const updatedMessageList = [];
      for (const message of response?.data?.data[0]?.messages) {
        updatedMessageList.push(formatMessage(message, isAstrologer));
      }
      setAstrologyMessageList(updatedMessageList);
    } catch (error) {
      console.error("Error fetching astrologer message listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAstrologerProfileForList = (profile: any) => {
    //profile, "profile for astrologer");
    return {
      name: profile?.Fname + " " + profile.Lname,
      image: profile?.profile_picture,
      status: profile?.status === "available" ? "Online" : "busy",
      route: "astrologerProfilePage",
      color: profile?.status === "available" ? "green" : "red",
      description: profile?.description,
      orders: profile?.total_number_service_provide,
      rating: profile?.rating,
      price: profile?.chat_price,
      callPrice: profile?.call_price,
      id: profile?._id,
      language: profile?.language,
      certificaations: profile?.certificaations,
      yearsOfExperience: profile?.years_of_experience,
      specialisation: profile?.specialisation,
    };
  };

  const filterAstrologerByName = (text: string) => {
    const filteredList = astrologerList.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAstrologerList(filteredList);
  };

  const formatMessageListing = (message: any, index: number) => {
    console.log(message, "getting message");
    return {
      id: index,
      userId: message?.userId ?? message?.astrologerId,
      astrologerId: message?.astrologerId,
      userName: message?.Fname ? message?.Fname + " " + message?.Lname : "User",
      profilePicture: message?.profile_picture ?? dummyImageURL,
      totalChatTime: message?.totalChatTime,
    };
  };

  const formatMessage = (message: any, isAstrologer: boolean) => {
    console.log(
      userId,
      isAstrologer
        ? message?.senderModel === "Astrologer"
        : message?.senderModel === "User",
      "getting message"
    );
    return {
      id: message?._id,
      message: message?.message,
      timestamp: message?.timestamp,
      isOwnMessage: isAstrologer
        ? message?.senderModel === "Astrologer"
        : message?.senderModel === "User",
    };
  };

  const formatReviewForListing = (review: any) => {
    return {
      id: review?._id,
      clientImage: review?.profile_picture ?? dummyImageURL,
      clientName: review?.Fname ? review?.Fname + " " + review?.Lname : "User",
      rating: review.rating,
      reviewText: review.comment,
      date: new Date(review.createdAt).toLocaleString(),
    };
  };

  return {
    astrologerList,
    astrologerDetails,
    // wallet,
    // reviews,
    astrologyChatList,
    astrologyMessageList,
    filteredastrologerList,
    loading,
    getAstrologerList,
    getAstrologer,
    createAstrologer,
    getWalletBalance,
    updateAstrologerProfile,
    verifyOTPForProfileUpdate,
    giveRatingAndReview,
    getRatingReviewById,
    astrologerMessageListing,
    astrologerChatListById,
    setAstrologyMessageList,
    filterAstrologerByName,
  };
};

export default useAstrologyServices;

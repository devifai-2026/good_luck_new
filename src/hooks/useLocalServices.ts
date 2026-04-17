import React, { useState } from "react";
import {
  createLocalServiceRequest,
  filterLocalService,
  getAllLocalServiceCategory,
  getLocalServiceByCategory,
  getLocalServicePlans,
  subscribeForLocalService,
} from "../services";
import { notifyMessage } from "./useDivineShopServices";
import { styleConstants } from "../styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux";
import { updateUserData } from "../redux/silces/auth.silce";
import { useNavigation } from "@react-navigation/native";
import { PostCategory } from "./useAdvertisementService";

const useLocalServices = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const searchText = useSelector(
    (state: RootState) => state.auth.userDetails?.searchText
  );
  const selectedChipValue = useSelector(
    (state: RootState) => state.auth.userDetails?.selectedChipValue
  );

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [localServicesCategory, setlocalServicesCategory] = useState<any[]>([]);
  const [localServices, setLocalServices] = useState<any[]>([]);
  // const [localServicePlans, setlocalServicePlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAllCategoryLocalServices = async () => {
    setIsLoading(true);
    try {
      const response = await getAllLocalServiceCategory();

      setlocalServicesCategory(
        response?.data?.data?.map((item: any) => ({
          id: item._id,
          name: item.name,
          icon: item.icon ?? null,
          color: item.color ?? styleConstants.color.backgroundGrayColor,
        }))
      );

      console.log(response?.data?.data);
    } catch (error) {
      console.error("Error fetching local services categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalServiceByCategoryId = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getLocalServiceByCategory(id);
      setLocalServices(formatLocalServices(response?.data?.data));
    } catch (error) {
      console.error("Error fetching local services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocalServices = async () => {
    setIsLoading(true);
    try {
      const filter = `${selectedChipValue}=${searchText}&page=1&limit=1000`;
      const response = await filterLocalService(filter);
      setLocalServices(formatLocalServices(response?.data?.data));
    } catch (error) {
      console.error("Error fetching local services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const getPlansForLOcalService = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getLocalServicePlans();
  //     setlocalServicePlans(response?.data?.data);
  //   } catch (error) {
  //     console.error("Error fetching local services:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const subscribeForLocalServices = async (
    planType: "one_month_plan" | "one_year_plan",
    razorpayData: { paymentId: string; orderId: string; signature: string },
    promoCode?: string
  ) => {
    try {
      const payload = {
        userId: userId ?? "",
        planType,
        razorpay_payment_id: razorpayData.paymentId,
        razorpay_order_id: razorpayData.orderId,
        razorpay_signature: razorpayData.signature,
        ...(promoCode && promoCode?.length > 0
          ? { promoCode: parseInt(promoCode) }
          : {}),
      };
      const response = await subscribeForLocalService(payload);
      //response);
      notifyMessage(response?.data?.message);
      //response?.data?.data);
      dispatch(updateUserData({ isLocalServiceSubscribed: true }));
      navigation.goBack();
    } catch (error: any) {
      console.log("Error subscribing to local services:", error?.message);
      if (error?.response?.data?.message) {
        notifyMessage(error?.response?.data?.message);
      } else notifyMessage(error?.message);
    }
  };

  const createLocalService = async (body: any, callback: any) => {
    setIsLoading(true);
    try {
      const response = await createLocalServiceRequest({ ...body, userId });
      console.log(response, "response for local service creation");
      notifyMessage(response?.data?.message);
      callback();
    } catch (error) {
      console.error("Error fetching local services:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const formatLocalServices = (localServices: any[]) => {
    return localServices.map((service) => ({
      id: service._id,
      type: PostCategory.Banner,
      image: service.image,
      isAvilable: service.isAvilable,
      phone: service.contact,
      category: service.category.name,
      addres: `${service.address}, ${service.city}, ${service.state} - ${service.pinCode}`,
    }));
  };
  return {
    localServicesCategory,
    isLoading,
    getAllCategoryLocalServices,
    getLocalServiceByCategoryId,
    localServices,
    createLocalService,
    subscribeForLocalServices,
    filterLocalServices,
  };
};

export default useLocalServices;

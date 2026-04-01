import { useState, useCallback } from "react";
import {
  createJobBannerPost,
  getAllJobBannerPosts,
  getJobBannerPostById,
  updateJobBannerPost,
  deleteJobBannerPost,
  createJobTextPost,
  getAllJobTextPosts,
  getJobTextPostById,
  updateJobTextPost,
  deleteJobTextPost,
  createHomeAndLandBannerPost,
  getAllHomeAndLandBannerPosts,
  getHomeAndLandBannerPostById,
  updateHomeAndLandBannerPost,
  deleteHomeAndLandBannerPost,
  createHomeAndLandTextPost,
  getAllHomeAndLandTextPosts,
  getHomeAndLandTextPostById,
  updateHomeAndLandTextPost,
  deleteHomeAndLandTextPost,
  subscribeForAdvertisement,
  getAllPlans,
  getDashBoardAds,
} from "../services"; // Replace with your actual API function imports
import { notifyMessage } from "./useDivineShopServices";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux";
import {
  updateCurrentAdDetails,
  updateUserData,
} from "../redux/silces/auth.silce";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IFormData } from "../components/User/addAdvertisement";
import {
  jobpages,
  landSellpages,
} from "../pages/UserScreens/sellJobListingPage";

// Enums for type safety
export enum PostType {
  HomeLand = "HomeLand",
  Job = "Job",
}

export enum PostCategory {
  Banner = "Banner",
  Text = "Text",
}

export enum HomeLandCategory {
  Home = "Home",
  Land = "Land",
}

export enum JobCategory {
  Private = "Private",
  Govt = "Govt",
}

// Hook implementation
export const useAdvertisementService = () => {
  // Loading states

  const route = useRoute<any>();
  const [listLoading, setListLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);

  const [allAdvertisementList, setallAdvertisementList] = useState<any[]>([]);

  const [dashboardAds, setDashboardAds] = useState<any[]>([]);

  const [plans, setplans] = useState<any[]>([]);

  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const dispatch = useDispatch();

  const navigation = useNavigation<any>();

  // Function to determine the appropriate API function based on type and category
  const getApiFunctions = (type: PostType, category: PostCategory) => {
    if (type === PostType.HomeLand) {
      if (category === PostCategory.Banner)
        return {
          create: createHomeAndLandBannerPost,
          getAll: getAllHomeAndLandBannerPosts,
          getById: getHomeAndLandBannerPostById,
          update: updateHomeAndLandBannerPost,
          delete: deleteHomeAndLandBannerPost,
        };
      else {
        return {
          create: createHomeAndLandTextPost,
          getAll: getAllHomeAndLandTextPosts,
          getById: getHomeAndLandTextPostById,
          update: updateHomeAndLandTextPost,
          delete: deleteHomeAndLandTextPost,
        };
      }
    } else if (type === PostType.Job) {
      if (category === PostCategory.Banner) {
        return {
          create: createJobBannerPost,
          getAll: getAllJobBannerPosts,
          getById: getJobBannerPostById,
          update: updateJobBannerPost,
          delete: deleteJobBannerPost,
        };
      } else {
        return {
          create: createJobTextPost,
          getAll: getAllJobTextPosts,
          getById: getJobTextPostById,
          update: updateJobTextPost,
          delete: deleteJobTextPost,
        };
      }
    }
    throw new Error("Invalid type or category");
  };

  // Create a post
  const createPost = async (
    type: PostType,
    category: PostCategory,
    body: any
  ) => {
    const { create } = getApiFunctions(type, category);
    // //type, category);
    setItemLoading(true);
    try {
      const response = await create(body);
      notifyMessage(response?.data?.data?.message ?? "Ad created successfully");
      // //response?.data?.data);
      if (type === PostType.Job) navigation.navigate("showYourJobPosts");
      else {
        navigation.navigate("showYourLandPosts");
      }
      //   return response;
    } catch (error: any) {
      console.error(error, "Failed to create posts");
      notifyMessage(error.message ?? "Failed to create ad");
    } finally {
      setItemLoading(false);
    }
  };

  // Get all posts
  const getAllPosts = async (type: HomeLandCategory | JobCategory | "") => {
    setListLoading(true);

    try {
      if (landSellpages.includes(route.name)) {
        console.log("jsdhasjdh");
        // Fetch banner ads
        const homeLandbannerAdResponse = await getAllHomeAndLandBannerPosts(
          type as HomeLandCategory
        );
        const levelHomeBannerAdResponse = homeLandbannerAdResponse?.data?.data;

        // Format banner ads
        const formattedHomeLandBannerPosts = levelHomeBannerAdResponse?.map(
          (adv: any) => formatHomeLandAdForCommonList(adv, PostCategory.Banner)
        );

        // Fetch text ads
        const homeLandTextAdResponse = await getAllHomeAndLandTextPosts(
          type as HomeLandCategory
        );
        const levelHomeTextAdResponse = homeLandTextAdResponse?.data?.data;

        // Format text ads
        const formattedHomeLandTextPosts = levelHomeTextAdResponse?.map(
          (adv: any) => formatHomeLandAdForCommonList(adv, PostCategory.Text)
        );

        // Return both sets of ads
        setallAdvertisementList([
          ...formattedHomeLandBannerPosts,
          ...formattedHomeLandTextPosts,
        ]);
      } else if (jobpages.includes(route.name)) {
        // Fetch job banner ads
        const jobBannerAdResponse = await getAllJobBannerPosts(
          type as JobCategory
        );
        const levelJobBannerAdResponse = jobBannerAdResponse?.data?.data;

        // Format job banner ads
        const formattedJobBannerPosts = levelJobBannerAdResponse?.map(
          (adv: any) => formatJobAdForCommonList(adv, PostCategory.Banner)
        );

        // Fetch job text ads
        const jobTextAdResponse = await getAllJobTextPosts(type as JobCategory);
        const levelJobTextAdResponse = jobTextAdResponse?.data?.data;

        // Format job text ads
        const formattedJobTextPosts = levelJobTextAdResponse?.map((adv: any) =>
          formatJobAdForCommonList(adv, PostCategory.Text)
        );

        // Return both sets of ads

        setallAdvertisementList([
          ...formattedJobBannerPosts,
          ...formattedJobTextPosts,
        ]);
      } else {
        // Fetch all posts by the user
        if (route.name === "showYourJobPosts") {
          // Fetch banner ads
          const homeLandbannerAdResponse = await getJobBannerPostById(
            userId ?? ""
          );
          const levelHomeBannerAdResponse =
            homeLandbannerAdResponse?.data?.data;

          // Format banner ads
          const formattedHomeLandBannerPosts = levelHomeBannerAdResponse?.map(
            (adv: any) =>
              formatJobAdForCommonList(adv, PostCategory.Banner, true)
          );

          // Fetch text ads
          const homeLandTextAdResponse = await getJobTextPostById(userId ?? "");
          const levelHomeTextAdResponse = homeLandTextAdResponse?.data?.data;

          // Format text ads
          const formattedHomeLandTextPosts = levelHomeTextAdResponse?.map(
            (adv: any) => formatJobAdForCommonList(adv, PostCategory.Text, true)
          );

          // Return both sets of ads
          setallAdvertisementList([
            ...formattedHomeLandBannerPosts,
            ...formattedHomeLandTextPosts,
          ]);
        } else if (route.name === "showYourLandPosts") {
          // Fetch job banner ads
          const homeLandBannerAdResponse = await getHomeAndLandBannerPostById(
            userId ?? ""
          );
          const levelhomeLandBannerAdResponse =
            homeLandBannerAdResponse?.data?.data;

          // Format job banner ads
          const formattedHomeLandannerPosts =
            levelhomeLandBannerAdResponse?.map((adv: any) =>
              formatHomeLandAdForCommonList(adv, PostCategory.Banner, true)
            );

          // Fetch job text ads
          const homeLandTextAdResponse = await getHomeAndLandTextPostById(
            userId ?? ""
          );
          const levelHomeLandTextAdResponse =
            homeLandTextAdResponse?.data?.data;

          // Format job text ads
          const formattedHomeLandTextPosts = levelHomeLandTextAdResponse?.map(
            (adv: any) =>
              formatHomeLandAdForCommonList(adv, PostCategory.Text, true)
          );

          // Return both sets of ads

          setallAdvertisementList([
            ...formattedHomeLandannerPosts,
            ...formattedHomeLandTextPosts,
          ]);
        }
        console.log(allAdvertisementList, "getting ads");
      }
    } catch (error) {
      console.error("Failed to get posts", error);
      // return [];
    } finally {
      setListLoading(false);
    }
  };

  // Get a post by user ID
  const getPostsByUserId = async (
    type: PostType,
    category: PostCategory,
    userId: string
  ) => {
    const { getById } = getApiFunctions(type, category);
    setItemLoading(true);
    try {
      const response = await getById(userId);
      return response;
    } catch (error) {
      console.error(error, "Failed to get posts");
      return [];
    } finally {
      setItemLoading(false);
    }
  };

  // Update a post
  const updatePost = async (
    type: PostType,
    category: PostCategory,
    postId: string,
    body: any
  ) => {
    // //type, category);
    const { update } = getApiFunctions(type, category);
    setItemLoading(true);
    try {
      const response = await update(postId, body);
      navigation.goBack();
      dispatch(
        updateCurrentAdDetails(
          type === PostType.HomeLand
            ? formatHomeLandAdForCommonList(
                response?.data?.data,
                category,
                true
              )
            : formatJobAdForCommonList(response?.data?.data, category, true)
        )
      );
      notifyMessage(response?.data?.message);
    } catch (error: any) {
      notifyMessage(error.message);
    } finally {
      setItemLoading(false);
    }
  };

  // Delete a post
  const deletePost = async (
    type: PostType,
    category: PostCategory,
    postId: string,
    modalClose: any
  ) => {
    // //type, category);
    const { delete: deleteFunc } = getApiFunctions(type, category);

    setItemLoading(true);
    try {
      const response = await deleteFunc(userId ?? "", postId);
      setallAdvertisementList(
        allAdvertisementList?.filter((ad) => ad.id !== postId)
      );
      notifyMessage(response?.data?.message);
      navigation.navigate(
        PostType.HomeLand ? "landhomelocalservicespage" : "joblocalservicespage"
      );
      modalClose();
    } catch (error: any) {
      notifyMessage(error.message);
    } finally {
      setItemLoading(false);
    }
  };

  // Subscribe for advertisement

  const getAllAdvertisementPlans = async (type: "ads" | "localservices") => {
    setItemLoading(true);
    try {
      const response = await getAllPlans(type);
      // //response);
      const oneMonthPrice = response.data?.data?.one_month_plan;
      const oneYearPrice = response.data?.data?.one_year_plan;

      const subscriptionOptions = [
        {
          name: "1 Month",
          price: `₹${oneMonthPrice}`,
          duration: "1 Month",
          features: ["Full access", "Priority support", "Exclusive content"],
          amount: 99,
          key: "one_month_plan",
        },
        {
          name: "12 months",
          price: `₹${oneYearPrice}`,
          duration: "12 Months",
          features: ["Full access", "Priority support", "Exclusive content"],
          amount: 999,
          key: "one_year_plan",
        },
      ];
      setplans(subscriptionOptions);
    } catch (error: any) {
      console.error(error);
      // return [];
    } finally {
      setItemLoading(false);
    }
  };

  const subscribeForHomeLandJobAdvertisement = async (
    planType: "one_month_plan" | "one_year_plan",
    transactionid: string,
    promoCode: string
  ) => {
    try {
      // //"calling");
      const payload = {
        userId: userId ?? "",
        planType,
        transactionid,
        ...(promoCode?.length > 0 ? { promoCode: parseInt(promoCode) } : {}),
      };
      const response = await subscribeForAdvertisement(payload);
      //response);
      notifyMessage(response?.data?.message);
      //response?.data?.data);
      dispatch(updateUserData({ isSubscribed: true }));
      navigation.goBack();
    } catch (error: any) {
      notifyMessage(error?.message);
    }
  };

  const createAdvertisementPostBody = (
    formData: IFormData,
    category: PostCategory,
    type: PostType,
    userId: string,
    imageUrl: string
  ) => {
    // Common fields
    let baseBody: any = {
      userId,
      title: formData.title,
      category: formData?.postFor,
      phone: formData?.phone,
      city: formData?.city,
      state: formData?.state,
      pincode: formData?.pin,
    };
    if (formData?.adId) {
      baseBody = { ...baseBody, adId: formData?.adId };
    }

    if (type === PostType.HomeLand) {
      if (category === PostCategory.Banner) {
        return {
          ...baseBody,
          description: formData.description,
          banner_url: imageUrl,
          price: formData?.price,
        };
      } else {
        return {
          ...baseBody,
          total_character: formData.description?.length,
          text_ad_description: formData.description,
          price: formData?.price,
        };
      }
    } else {
      if (category === PostCategory.Banner) {
        return {
          ...baseBody,
          company_name: formData.companyName,
          website: formData.website,
          banner_url: imageUrl,
          address: formData.address,
          category: formData?.postFor === "Government job" ? "Govt" : "Private",
          salary: formData?.salary,
          work_location: formData?.workLocation,
        };
      } else {
        return {
          ...baseBody,
          company_name: formData.companyName,
          address: formData.address,
          salary: formData?.salary,
          total_character: formData.description?.length,
          text_ad_description: formData.description,
          price: formData?.price,
          website: formData?.website,
          work_location: formData?.workLocation,
          category: formData?.postFor === "Government job" ? "Govt" : "Private",
        };
      }
    }
  };

  const formatJobAdForCommonList = (
    adv: any,
    type: PostCategory,
    isOwn?: boolean
  ) => {
    //adv);
    return {
      ...(isOwn ? { isOwn } : {}),
      isNew: adv?.isNew,
      category: PostType.Job,
      type,
      id: adv._id,
      title: adv.title,
      image: adv.banner_url,
      companyName: adv.company_name,
      salary: adv.salary,
      phone: adv.phone,
      workLocation: adv.work_location,
      address: adv.address,
      addressTwo: `${adv.city},${adv.state},${adv.pincode}`,
      website: adv.website,
      description: adv.text_ad_description,
      city: adv?.city,
      state: adv?.state,
      pin: adv?.pincode,
    };
  };

  const formatHomeLandAdForCommonList = (
    adv: any,
    type: PostCategory,
    isOwn?: boolean
  ) => {
    //adv);
    return {
      isNew: adv?.isNew,
      category: PostType.HomeLand,
      type,
      ...(isOwn ? { isOwn } : {}),
      id: adv._id,
      title: adv.title,
      image: adv.banner_url ?? adv.image,
      price: adv.price,
      phone: adv.phone,
      address: `${adv.city},${adv.state},${adv.pincode}`,
      description: adv.text_ad_description,
      city: adv?.city,
      state: adv?.state,
      pin: adv?.pincode,
    };
  };

  const validateAdvertisementPostBody = (
    formData: any,
    uploadedImages: string,
    category: PostCategory,
    type: PostType
  ): string | true => {
    if (!formData) return "Form data is missing.";

    // Check common fields
    //formData, uploadedImages, category, type);
    if (!formData.title || formData.title.length === 0) {
      return "Title is required.";
    }
    if (!formData.phone || formData.phone.length !== 10) {
      return "Phone number must be 10 digits.";
    }
    if (!formData.city || formData.city.length === 0) {
      return "City is required.";
    }
    if (!formData.state || formData.state.length === 0) {
      return "State is required.";
    }
    if (!formData.pin || formData.pin.length !== 6) {
      return "PIN code must be 6 digits.";
    }

    if (type === PostType.HomeLand) {
      if (category === PostCategory.Banner) {
        // Validate HomeLand Banner Post
        if (!uploadedImages || uploadedImages.length === 0) {
          return "At least one image is required.";
        }
        if (!formData.price || formData.price.length === 0) {
          return "Price is required.";
        }
      } else {
        // Validate HomeLand Text Post
        if (!formData.description || formData.description.length === 0) {
          return "Description is required.";
        }
        if (!formData.price || formData.price.length === 0) {
          return "Price is required.";
        }
      }
    } else {
      if (category === PostCategory.Banner) {
        // Validate Job Banner Post
        if (!uploadedImages || uploadedImages.length === 0) {
          return "At least one image is required.";
        }
        if (!formData.companyName || formData.companyName.length === 0) {
          return "Company name is required.";
        }
        if (!formData.website || formData.website.length === 0) {
          return "Website is required.";
        }
        if (!formData.address || formData.address.length === 0) {
          return "Address is required.";
        }
        if (!formData.salary || formData.salary.length === 0) {
          return "Salary is required.";
        }
        if (!formData.workLocation || formData.workLocation.length === 0) {
          return "Work location is required.";
        }
      } else {
        // Validate Job Text Post
        if (!formData.address || formData.address.length === 0) {
          return "Address is required.";
        }
        if (!formData.salary || formData.salary.length === 0) {
          return "Salary is required.";
        }
        if (!formData.description || formData.description.length === 0) {
          return "Description is required.";
        }
        if (!formData.website || formData.website.length === 0) {
          return "Website is required.";
        }
        if (!formData.workLocation || formData.workLocation.length === 0) {
          return "Work location is required.";
        }
      }
    }

    return true; // Validation successful
  };

  const getHomePageAdvertisement = async () => {
    try {
      setListLoading(true);
      const response = await getDashBoardAds();
      console.log(response?.data, "dashboard ads");
      const formattedDashBoardAdd = response?.data?.data?.map((adv: any) =>
        formatHomeLandAdForCommonList(adv, PostCategory.Banner)
      );

      setDashboardAds(formattedDashBoardAdd);
      setListLoading(false);
    } catch (error) {
      setListLoading(false);
      console.error("Failed to get dashboard ads", error);
      // return [];
    }
  };

  return {
    createPost,
    getAllPosts,
    getAllAdvertisementPlans,
    plans,
    getPostsByUserId,
    updatePost,
    deletePost,
    subscribeForHomeLandJobAdvertisement,
    allAdvertisementList,
    listLoading,
    itemLoading,
    dashboardAds,
    getHomePageAdvertisement,
    createAdvertisementPostBody,
    validateAdvertisementPostBody,
  };
};

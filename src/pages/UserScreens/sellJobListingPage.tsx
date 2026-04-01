import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut.tsx";
import { landPageStyle } from "../../styles/landPage.styles.ts";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BannerCard from "../../components/User/bannerCard.tsx";
import { styleConstants } from "../../styles/constants.ts";
import TextCard from "../../components/User/textCard.tsx";
import {
  HomeLandCategory,
  JobCategory,
  PostCategory,
  useAdvertisementService,
} from "../../hooks/useAdvertisementService.ts";
import { ActivityIndicator, FAB } from "react-native-paper";
import NoDataComponent from "../../components/User/noDataComponent.tsx";
import useLocalServices from "../../hooks/useLocalServices.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/index.ts";
import CreateLocalServiceModal from "../../components/Shared/createLocalServiceModal.tsx";
import SearchWithFilter from "../../components/Shared/searchBar.tsx";

const HeadersBasedonRoute = {
  landSellPage: "Lands",
  homeSellPage: "Home",
  govtjobPage: "Government Jobs",
  privatejobPage: "Private Jobs",
  showYourLandPosts: "Your Home and Land Ads",
  showYourJobPosts: "Your Jobs Ads",
  otherlocalservicepage: "Local Services",
};

const filterNonPermissableRoutes = ["showYourLandPosts", "showYourJobPosts"];

export const landSellpages = ["homeSellPage", "landSellPage", "home"];

export const jobpages = ["privatejobPage", "govtjobPage"];

export default function SellJobListingPage() {
  const navigation = useNavigation<any>();
  const routes = useRoute<any>();

  const localServiceName = useSelector(
    (state: RootState) => state.auth.currentLocalServiceCategory?.name
  );

  const isLocalServiceSuscribed = useSelector(
    (state: RootState) => state.auth.userDetails?.isLocalServiceSubscribed
  );

  const [showableAds, setshowableAds] = useState<any[]>([]);

  const [showModal, setshowModal] = useState<boolean>(false);

  const { getAllPosts, listLoading, allAdvertisementList } =
    useAdvertisementService();

  const { getLocalServiceByCategoryId, localServices } = useLocalServices();
  const isNotlocalservices = routes?.name !== "otherlocalservicepage";

  const handleCreateLocalServicebuttonClick = () => {
    if (isLocalServiceSuscribed) {
      // TODO: open modal for creating local services
      setshowModal(true);
    } else {
      navigation.navigate("localservicesubscriptionpage");
    }
  };

  useEffect(() => {
    const type =
      routes?.name === "landSellPage"
        ? HomeLandCategory.Land
        : routes?.name === "homeSellPage"
        ? HomeLandCategory.Home
        : routes?.name === "govtjobPage"
        ? JobCategory.Govt
        : routes?.name === "privatejobPage"
        ? JobCategory.Private
        : routes?.name === "otherlocalservicepage"
        ? "otherlocalservicepage"
        : "";
    // if (type?.length !== 0 && type)
    {
      if (type !== "otherlocalservicepage") getAllPosts(type);
      else {
        const localServiceId = routes?.params?.localServiceId;
        if (localServiceId) {
          getLocalServiceByCategoryId(localServiceId);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isNotlocalservices) {
      setshowableAds(allAdvertisementList);
    } else {
      console.log(localServices, "getting local services");
      setshowableAds(localServices);
    }
  }, [localServices, allAdvertisementList]);

  return (
    <View style={{ height: "100%" }}>
      {showModal ? (
        <CreateLocalServiceModal
          onClose={() => {
            setshowModal(false);
          }}
          visible={showModal}
          title={`Create ${localServiceName} service`}
        />
      ) : (
        <HomeScreenLayout>
          {listLoading ||
          ((localServices?.length > 0 || allAdvertisementList?.length > 0) &&
            showableAds?.length === 0) ? (
            <ActivityIndicator
              style={landPageStyle.loadingIndicator}
              size={"large"}
              color={styleConstants.color.primaryColor}
            />
          ) : showableAds?.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={landPageStyle.container}>
                <View style={landPageStyle.headerContainer}>
                  <View style={landPageStyle.headerSubContainer}>
                    <Icon
                      onPress={() => {
                        navigation.goBack();
                      }}
                      name="arrow-back"
                      size={24}
                      color="black"
                      style={{ top: -2, zIndex: 10000000 }}
                    />
                    <Text style={landPageStyle.title}>
                      {isNotlocalservices
                        ? HeadersBasedonRoute[
                            routes.name as keyof typeof HeadersBasedonRoute
                          ]
                        : localServiceName}
                    </Text>
                  </View>
                  {!filterNonPermissableRoutes.includes(routes.name) && (
                    <View style={landPageStyle.headerSubContainer}>
                      {/* <Icon
                      onPress={() => {
                        navigation.goBack();
                      }}
                      name="tune"
                      size={24}
                      color={styleConstants.color.primaryColor}
                      style={{ top: -2, zIndex: 10000000 }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        color: styleConstants.color.primaryColor,
                        paddingBottom: 6,
                        marginLeft: 4,
                      }}
                    >
                      Filter
                    </Text> */}
                    </View>
                  )}
                </View>
                <SearchWithFilter />
                <View style={landPageStyle.LandListContainer}>
                  {/* {landSellpages.includes(routes?.name) ? ( */}
                  <View>
                    {showableAds?.map((item: any) =>
                      item?.type === PostCategory.Banner ? (
                        <BannerCard
                          key={item?.id}
                          title={item?.title}
                          phone={item?.phone}
                          location={item?.work_location ?? item?.address}
                          price={item?.price ?? item?.salary}
                          imageUrl={item?.image}
                          description={item?.description ?? ""}
                          isNew={item?.isNew ?? false}
                          isown={item?.isOwn ?? false}
                          bannerData={item}
                          isLocalService={isNotlocalservices ? false : true}
                        />
                      ) : (
                        <TextCard
                          key={item?.id}
                          title={item?.title}
                          location={item?.work_location ?? item?.address}
                          price={item?.price ?? item?.salary}
                          chipOptions={[]}
                          phone={item?.phone}
                          isNew={item?.isNew ?? false}
                          logo={""}
                          description={item?.description}
                          isown={item?.isOwn ?? false}
                          textData={item}
                        />
                      )
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <NoDataComponent message="No advertisement avilable" />
          )}
          {!isNotlocalservices && (
            <FAB
              icon="plus"
              color="white"
              size="large" // Ensures a larger icon size
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                backgroundColor: styleConstants.color.primaryColor, // Primary color
                width: 65,
                height: 65,
                borderRadius: 65 / 2, // Ensures a perfectly round shape
                justifyContent: "center",
                alignItems: "center",
                elevation: 5, // Adds shadow for better visibility
              }}
              onPress={handleCreateLocalServicebuttonClick}
            />
          )}
        </HomeScreenLayout>
      )}
    </View>
  );
}

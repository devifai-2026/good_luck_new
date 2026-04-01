import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, ScrollView, BackHandler, Alert, FlatList, RefreshControl, Dimensions, Text } from "react-native";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import ScrollableMenu, {
  IMenuItem,
} from "../../components/Shared/scrollableTopMenu";
import Sound from "react-native-sound";
import { styleConstants, homePageStyle as styles } from "../../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

import { ActivityIndicator } from "react-native-paper";
import DakshinaModal from "../../components/Shared/dakshinaModal";
import TextCard from "../../components/User/textCard";
import BannerCard from "../../components/User/bannerCard";
import {
  HomeLandCategory,
  PostCategory,
  useAdvertisementService,
} from "../../hooks/useAdvertisementService";
import NoDataComponent from "../../components/User/noDataComponent";
import PujaPageComponent from "../../components/User/pujaPageComponent";

const screenWidth = Dimensions.get("window").width;
const ADS_SLIDE_INTERVAL = 3000;

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [showModal, setshowModal] = useState<boolean>(false);
  const adsRef = useRef<FlatList>(null);
  const [currentAdsIndex, setCurrentAdsIndex] = useState(0);
  const matrimonyID = useSelector(
    (state: RootState) => state.auth.userDetails?.matrimonyID
  );
  const datingID = useSelector(
    (state: RootState) => state.auth.userDetails?.datingID
  );
  // const { dakshinaImages, getDakshinaAll, loading } = usePanchang();

  const [refreshing, setRefreshing] = useState(false);
  const { getHomePageAdvertisement, dashboardAds, listLoading } =
    useAdvertisementService();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getHomePageAdvertisement();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!dashboardAds?.length) return;
    const interval = setInterval(() => {
      setCurrentAdsIndex((prev) => {
        const next = prev + 1 >= dashboardAds.length ? 0 : prev + 1;
        adsRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, ADS_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [dashboardAds]);
  const menuItems: IMenuItem[] = [
    {
      id: "1",
      title: "Divine Shop",
      icon: require("../../assets/divineShop.png"),
      route: "subproducts",
    },
    {
      id: "5",
      title: "Local Services",
      icon: require("../../assets/localService.jpg"),
      route: "localServicesHomePage",
    },
    {
      id: "2",
      title: "Matrimony",
      icon: require("../../assets/matrimony.png"),
      route: matrimonyID ? "matrimonydashboard" : "creatematrimonyprofile",
    },
    {
      id: "3",
      title: "Panchang Calendar",
      icon: require("../../assets/panchangLogo.png"),
      route: "panchangpage",
    },
    {
      id: "4",
      title: "Love & Friends",
      icon: require("../../assets/friends.png"),
      route: datingID ? "datingdashboard" : "createdatingprofile",
    },
  ];
  useEffect(() => {
    playBellSound();

    getHomePageAdvertisement();
  }, []);
  const playBellSound = () => {
    const bell = new Sound("bell.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        // ("Failed to load the sound", error);
        return;
      }
      bell.play((success) => {
        if (!success) {
          // ("Playback failed due to audio decoding errors");
        }
      });
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // prevent default back action
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove(); // cleanup on unmount
    }, [])
  );

  console.log(dashboardAds, "dashboard ads in home page");
  return (
    <HomeScreenLayout>
      {showModal ? (
        <DakshinaModal visible={showModal} onClose={setshowModal} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          nestedScrollEnabled
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[styleConstants.color.primaryColor]}
            />
          }
        >
          <View style={styles.container}>
            <ScrollableMenu navigation={navigation} menuItems={menuItems} />

            <PujaPageComponent />

            {listLoading ? (
              <ActivityIndicator
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "50%",
                }}
                size={"large"}
                color={styleConstants.color.primaryColor}
              />
            ) : dashboardAds?.length > 0 ? (
              <View style={{ width: "100%", marginTop: 6 }}>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  marginBottom: 6,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: styleConstants.fontFamily,
                    color: styleConstants.color.textBlackColor,
                    fontWeight: "700",
                  }}>
                    Featured Ads
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: styleConstants.fontFamily,
                    color: styleConstants.color.primaryColor,
                  }}>
                    {currentAdsIndex + 1} / {dashboardAds.length}
                  </Text>
                </View>

                <FlatList
                  ref={adsRef}
                  horizontal
                  pagingEnabled
                  data={dashboardAds}
                  keyExtractor={(item: any) => item?.id?.toString()}
                  showsHorizontalScrollIndicator={false}
                  getItemLayout={(_data, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                  })}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                      e.nativeEvent.contentOffset.x / screenWidth
                    );
                    setCurrentAdsIndex(index);
                  }}
                  renderItem={({ item }: { item: any }) => (
                    <View style={{ width: screenWidth, paddingHorizontal: 16, justifyContent: "center" }}>
                      {item?.type === PostCategory.Banner ? (
                        <BannerCard
                          title={item?.title}
                          phone={item?.phone}
                          location={item?.work_location ?? item?.address}
                          price={item?.price ?? item?.salary}
                          imageUrl={item?.image}
                          description={item?.description ?? ""}
                          isNew={item?.isNew ?? false}
                          isown={item?.isOwn ?? false}
                          bannerData={item}
                          isLocalService
                        />
                      ) : (
                        <TextCard
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
                      )}
                    </View>
                  )}
                />

                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 6,
                  gap: 5,
                }}>
                  {dashboardAds.map((_: any, index: number) => (
                    <View
                      key={index}
                      style={{
                        width: currentAdsIndex === index ? 20 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          currentAdsIndex === index
                            ? styleConstants.color.primaryColor
                            : "#D0D0D0",
                      }}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <NoDataComponent message="No ads found" />
            )}
          </View>
        </ScrollView>
      )}
    </HomeScreenLayout>
  );
};

export default HomeScreen;

import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  BackHandler,
} from "react-native";
import React from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import HomeScreenLayout from "../../components/Layouts/homeLayOut.tsx";
import { landPageStyle } from "../../styles/landPage.styles.ts";
import { HomeScreenOptions } from "../../constants.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/index.ts";

export default function LocalServicesPage() {
  const navigation = useNavigation<any>();

  const isSubscribed = useSelector(
    (state: RootState) => state.auth.userDetails?.isSubscribed
  );

  const routes = useRoute<any>();

  const options =
    routes?.name === "landhomelocalservicespage"
      ? HomeScreenOptions.landhomelocalservicespage
      : HomeScreenOptions.joblocalservicespage;
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("servicepage");
        return true; // Prevent default behavior (exit app)
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  return (
    <View style={{ height: "100%" }}>
      <HomeScreenLayout>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={landPageStyle.container}>
            <View style={landPageStyle.OptionContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(options.optionOne.navigation)
                }
              >
                <View style={landPageStyle.homeSellContainer}>
                  <View style={landPageStyle.iconContainer}>
                    <Image
                      style={landPageStyle.icon}
                      source={
                        routes?.name === "landhomelocalservicespage"
                          ? require("../../assets/homeSell.png")
                          : require("../../assets/govtJobs.png")
                      }
                    />
                  </View>
                  <View>
                    <Text style={landPageStyle.text}>
                      {options.optionOne.title}
                    </Text>
                  </View>
                  <View>
                    {/* <Image source={require("../../assets/rightArrow.png")} /> */}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(options.optionTwo.navigation)
                }
              >
                <View style={landPageStyle.landSellContainer}>
                  <View style={landPageStyle.iconContainer}>
                    <Image
                      style={landPageStyle.icon}
                      source={
                        routes?.name === "landhomelocalservicespage"
                          ? require("../../assets/landSell.png")
                          : require("../../assets/privateJob.png")
                      }
                    />
                  </View>
                  <View>
                    <Text style={landPageStyle.text}>
                      {options.optionTwo.title}
                    </Text>
                  </View>
                  <View>
                    {/* <Image source={require("../../assets/rightArrow.png")} /> */}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    isSubscribed
                      ? options.optionThree.navigation
                      : "subscriptionpage",
                    routes?.name === "landhomelocalservicespage"
                      ? { type: "addPostForLand" }
                      : { type: "addPostForJob" }
                  )
                }
              >
                <View style={landPageStyle.adContainer}>
                  <View style={landPageStyle.iconContainer}>
                    <Image
                      style={landPageStyle.icon}
                      source={
                        routes?.name === "landhomelocalservicespage"
                          ? require("../../assets/adPost.png")
                          : require("../../assets/jobAd.png")
                      }
                    />
                  </View>
                  <View>
                    <Text style={landPageStyle.text}>
                      {options.optionThree.title}
                    </Text>
                  </View>
                  <View style={landPageStyle.rightArrowContainer}>
                    {/* <Image source={require("../../assets/rightArrow.png")} /> */}
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(options.optionFour.navigation)
                }
              >
                <View style={landPageStyle.adContainer}>
                  <View style={landPageStyle.iconContainer}>
                    <Image
                      style={landPageStyle.icon}
                      source={
                        routes?.name === "landhomelocalservicespage"
                          ? require("../../assets/adPost.png")
                          : require("../../assets/jobAd.png")
                      }
                    />
                  </View>
                  <View>
                    <Text style={landPageStyle.text}>
                      {options.optionFour.title}
                    </Text>
                  </View>
                  <View style={landPageStyle.rightArrowContainer}>
                    {/* <Image source={require("../../assets/rightArrow.png")} /> */}
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ paddingTop: 20 }}>
              <View style={landPageStyle.imageContainer}>
                {/* <Image
                  source={require("../../assets/landAdImage.png")}
                  style={landPageStyle.menuImage}
                /> */}
              </View>

              <View style={landPageStyle.imageContainer}>
                {/* <Image
                  source={require("../../assets/landAdImage2.png")}
                  style={landPageStyle.menuImage}
                /> */}
              </View>
            </View>
          </View>
        </ScrollView>
      </HomeScreenLayout>
    </View>
  );
}

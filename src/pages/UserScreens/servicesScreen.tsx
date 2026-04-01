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

export default function ServicesHomePage(props: {
  hideHeaderandFooter?: boolean;
}) {
  const { hideHeaderandFooter } = props;
  const navigation = useNavigation<any>();

  const routes = useRoute<any>();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (routes.name !== "affiliateMarketerhome")
          navigation.navigate("home");
        return true; // Prevent default behavior (exit app)
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation]),
  );

  const shouldHideFooter = routes.name === "affiliateMarketerhome";

  return (
    <View style={{ height: "100%" }}>
      <HomeScreenLayout
        hideHeader={hideHeaderandFooter}
        hideFooter={shouldHideFooter}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={landPageStyle.container}>
            <View style={landPageStyle.OptionContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("landhomelocalservicespage")}
              >
                <View style={landPageStyle.homeSellContainer}>
                  <View style={landPageStyle.iconContainer}>
                    <Image
                      style={landPageStyle.icon}
                      source={require("../../assets/adPost.png")}
                    />
                  </View>
                  <Text style={landPageStyle.text}>Buy or sell property</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("joblocalservicespage")}
              >
                <View style={landPageStyle.landSellContainer}>
                  <View style={landPageStyle.iconContainer}>
                    <Image
                      style={landPageStyle.icon}
                      source={require("../../assets/adPost.png")}
                    />
                  </View>
                  <Text style={landPageStyle.text}>Jobs</Text>
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

import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import HomeScreenLayout from "../../components/Layouts/homeLayOut.tsx";
import { landPageStyle } from "../../styles/landPage.styles.ts";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { LandSellCard } from "../../components/User/landSellCard.tsx";
import { styleConstants } from "../../styles/constants.ts";

export default function LandSell() {
  const navigation = useNavigation<any>();
  return (
    <View style={{ height: "100%" }}>
      <HomeScreenLayout>
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
                <Text style={landPageStyle.title}>Land</Text>
              </View>
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
            </View>

            <View style={landPageStyle.LandListContainer}>
              <LandSellCard
                title="Best Dream Land"
                location="Tincidunt Convallis Pretium"
                price="₹5 Lakhs"
                imageUrl="https://example.com/image.jpg" // Replace with a valid image URL
              />
              <LandSellCard
                title="Best Dream Land"
                location="Tincidunt Convallis Pretium"
                price="₹5 Lakhs"
                imageUrl="https://example.com/image.jpg" // Replace with a valid image URL
              />
              <LandSellCard
                title="Best Dream Land"
                location="Tincidunt Convallis Pretium"
                price="₹5 Lakhs"
                imageUrl="https://example.com/image.jpg" // Replace with a valid image URL
              />
            </View>
          </View>
        </ScrollView>
      </HomeScreenLayout>
    </View>
  );
}

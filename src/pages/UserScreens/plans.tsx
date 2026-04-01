import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import useMatrimonyandDatingServices from "../../hooks/useMatrimonyDatingService";
import { ProfileType } from "../../services/constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import usePaymentService from "../../hooks/usePaymentService";

import { plansStyle as styles } from "../../styles";
import { SubscriptionOption } from "./getSubscriptions";

const subscriptionOptions: SubscriptionOption[] = [
  {
    name: "One Month",
    price: "₹99",
    duration: "1 Month",
    features: ["Basic access", "No ads", "Exclusive content"],
    amount: 99,
    key: "one_month_plan",
  },
  {
    name: "One Year",
    price: "₹999",
    duration: "12 Months",
    features: ["Full access", "Priority support", "Exclusive content"],
    amount: 999,
    key: "one_year_plan",
  },
];
interface RouteParams {
  type: ProfileType | undefined; // Define the properties that you expect in your route params
}
const PlanSelectionComponent = () => {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );
  const email = useSelector(
    (state: RootState) => state.auth.userDetails?.email
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPlanDetails, setSelectedPlanDetails] =
    useState<SubscriptionOption | null>(null);
  const { subscribeForPremium } = useMatrimonyandDatingServices();

  const navigation = useNavigation<any>();

  const { handlePayment } = usePaymentService();

  const { getDatingMatrimonyPlans, plans, isLoading } =
    useMatrimonyandDatingServices();

  const routes = useRoute();
  const routeParams = routes.params as RouteParams;

  const handlePlanSelection = (planName: SubscriptionOption) => {
    setSelectedPlan(planName.name);
    setSelectedPlanDetails(planName);
  };
  const handleButtonClick = async () => {
    try {
      // await  handlePayment(selectedPlanDetails?.amount ?? 1, handleButtonClicks);
      await handleButtonClicks(Date.now().toLocaleString());
    } catch (error) {
      console.error(error);
    }
  };
  const handleButtonClicks = async (id: string) => {
    if (
      routeParams?.type &&
      (routeParams?.type as any) === ProfileType.matrimony
    ) {
      try {
        await subscribeForPremium(ProfileType.matrimony, {
          userId,
          planType: selectedPlanDetails?.key,

          transaction_id: id,
        });
        navigation.navigate("matrimonydashboard");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        subscribeForPremium(ProfileType.dating, {
          userId,
          planType: selectedPlan,

          transaction_id: id,
        });
        navigation.navigate("datingdashboard");
      } catch (error) {
        console.error(error);
      }
    }
  };
  const renderPlans = ({ item }: { item: SubscriptionOption }) => (
    <View>
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderColor: selectedPlan === item.name ? "#FFD700" : "#FFFFFF",
          },
        ]}
        onPress={() => handlePlanSelection(item)}
      >
        {/* {item.isPopular && <Text style={styles.popular}>Popular</Text>} */}
        {selectedPlan === item.name && <Text style={styles.tick}>✓</Text>}
        <Text style={styles.planName}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    getDatingMatrimonyPlans(routeParams?.type as ProfileType);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/loginLogo.png")}
          style={styles.logo}
        />
      </View>

      {/* Header Text */}
      <Text style={styles.headerText}>
        Get elevated privilages with subscription
      </Text>

      {/* Plans Section */}
      <FlatList
        data={plans}
        keyExtractor={(item) => item.name}
        horizontal
        renderItem={renderPlans}
        showsHorizontalScrollIndicator={false}
      />

      {/* Features of Selected Plan */}
      {selectedPlan && (
        <View style={styles.additionalCard}>
          <View style={styles.additionalCardTop}>
            <Text style={styles.additionalCardText}>
              Features of {selectedPlan} Plan:
            </Text>
          </View>
          <View style={styles.additionalCard}>
            {plans
              .find((plan) => plan.name === selectedPlan)
              ?.features.map((feature: any, index: number) => (
                <Text key={index} style={styles.additionalCardMainText}>
                  ✓ {feature}
                </Text>
              ))}
          </View>
        </View>
      )}

      {/* Submit Button */}
      <Text style={styles.tAndC}>
        By tapping Continue, you will be charged, and make sure you agree to our
        Terms.
      </Text>
      <Button
        mode="contained"
        style={styles.submitButton}
        onPress={handleButtonClick}
        disabled={selectedPlan === null}
      >
        <Text
          style={{
            fontFamily: styleConstants.fontFamily,
            color: styleConstants.color.textWhiteColor,
          }}
        >
          Submit
        </Text>
      </Button>
    </View>
  );
};

export default PlanSelectionComponent;

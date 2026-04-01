import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import PaymentPage, { PaymentType } from "../../pages/UserScreens/paymentPage";
import useCommonFunctionalities from "../../hooks/useCommonFunctionalities";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useAdvertisementService } from "../../hooks/useAdvertisementService";

import { subscriptionStyles as styles } from "../../styles/subscription.styles";
import { useRoute } from "@react-navigation/native";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { validatePromoCode } from "../../services";
import useLocalServices from "../../hooks/useLocalServices";

export interface SubscriptionOption {
  name: string;
  price: string;
  duration: string;
  features: string[];
  amount: number;
  key: "one_month_plan" | "one_year_plan";
}

const SubscriptionModal = () => {
  const mobileNumber = useSelector(
    (state: RootState) => state.auth.userDetails?.phoneNumber
  );

  const routes = useRoute<any>();
  const isNotlocalservices = routes?.name !== "localservicesubscriptionpage";
  console.log(routes?.params?.type);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionOption | null>(
    null
  );

  const {
    subscribeForHomeLandJobAdvertisement,
    plans,
    getAllAdvertisementPlans,
    itemLoading,
  } = useAdvertisementService();

  const { subscribeForLocalServices } = useLocalServices();

  const handlePlanSelection = (plan: SubscriptionOption) => {
    setSelectedPlan(plan);
  };

  const [promocode, setpromocode] = useState<string>("");
  const [promocodeValid, setpromocodeValid] = useState<boolean>(false);
  const [promocodeLoading, setpromocodeLoading] = useState(false);

  const renderSubscriptionOption = ({ item }: { item: SubscriptionOption }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor:
            selectedPlan?.name === item.name
              ? "#FFD700"
              : styleConstants.color.textWhiteColor,
        },
      ]}
      onPress={() => handlePlanSelection(item)}
    >
      {selectedPlan?.name === item.name && <Text style={styles.tick}>✓</Text>}
      <Text style={styles.planName}>{item.name}</Text>
      <Text style={styles.balance}>{item.price}</Text>
      {/* <Text style={styles.planName}>{item.duration}</Text> */}
    </TouchableOpacity>
  );

  const paymentCallback = async (id: string) => {
    if (isNotlocalservices)
      await subscribeForHomeLandJobAdvertisement(
        selectedPlan?.key ?? "one_month_plan",
        id,
        promocodeValid ? promocode : ""
      );
    else {
      await subscribeForLocalServices(
        selectedPlan?.key ?? "one_month_plan",
        id,
        promocodeValid ? promocode : ""
      );
    }
  };

  const handlePromocodeValidation = async () => {
    setpromocodeLoading(true);
    try {
      const response = await validatePromoCode({
        promocode,
      });
      setpromocodeValid(true);
      notifyMessage(response?.data?.message);
    } catch (error) {
      notifyMessage("Invalid promo code");
      console.error("Error validating promo code:", error);
      setpromocodeValid(false);
    } finally {
      setpromocodeLoading(false);
    }
  };

  useEffect(() => {
    getAllAdvertisementPlans(isNotlocalservices ? "ads" : "localservices");
  }, []);

  useEffect(() => {
    setSelectedPlan(plans[0] ?? null);
  }, [plans]);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/loginLogo.png")}
            style={styles.logo}
          />
        </View>

        {/* Header Text */}
        <Text style={styles.headerText}>Choose your Subscription Plan</Text>

        {/* Subscription Options */}
        <FlatList
          data={plans}
          keyExtractor={(item) => item.name}
          horizontal
          renderItem={renderSubscriptionOption}
          showsHorizontalScrollIndicator={false}
        />

        <TextInput
          style={{
            height: 55,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
            marginBottom: 10,
            fontSize: 16,
            color: "#333",
          }}
          placeholder="Enter Promo Code"
          placeholderTextColor="#aaa"
          value={promocode}
          onChangeText={(text: string) => {
            setpromocode(text);
          }}
        />

        {/* Validate Button */}
        <Button
          mode="contained"
          onPress={handlePromocodeValidation}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={promocodeLoading}
        >
          {promocodeLoading ? (
            <ActivityIndicator
              size={"small"}
              color={styleConstants.color.textWhiteColor}
            />
          ) : (
            "Validate"
          )}
        </Button>
        {promocodeValid && (
          <Text style={styles.additionalCardMainText}>
            {" "}
            {`Promocode ${promocode} applied`}
          </Text>
        )}

        {/* Features of Selected Plan */}
        {selectedPlan && (
          <View style={styles.additionalCard}>
            <Text style={styles.additionalCardText}>
              Features of {selectedPlan.name}:
            </Text>
            {selectedPlan.features.map((feature, index) => (
              <Text key={index} style={styles.additionalCardMainText}>
                ✓ {feature}
              </Text>
            ))}
          </View>
        )}

        {/* Confirm Button */}
        <PaymentPage
          paymentType={
            isNotlocalservices ? PaymentType.independent : PaymentType.wallet
          }
          callback={paymentCallback}
          amount={selectedPlan?.amount ?? 0}
          mobileNumber={mobileNumber ?? ""}
          buttonState={selectedPlan === null}
        />
      </View>
    </View>
  );
};

export default SubscriptionModal;

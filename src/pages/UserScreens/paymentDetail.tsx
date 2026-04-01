import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import CartLayout from "../../components/Layouts/cartLayout";
import { paymentDetailStyles as styles } from "../../styles/cart.styles";

import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import moment from "moment";
import {
  setButtonState,
  setCurrentOrder,
} from "../../redux/silces/order.slice";
import { states } from "../../services/constants";
import { getCityListByState } from "../../redux/utils";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import OptionModal from "../../components/Shared/modal";
import { styleConstants } from "../../styles/constants";
import { validatePromoCode } from "../../services";

const isGSTEnabled = false;

const shippingCharge = 100;
const PaymentDetail = ({ navigation }: { navigation: any }) => {
  const image = useSelector((state: RootState) => state.product.productDetails);
  const phoneNumber = useSelector(
    (state: RootState) => state.auth.userDetails?.phoneNumber
  );

  const superNote =
    useSelector((state: RootState) => state.auth.userDetails?.supernote) ?? "0";
  const dispatch = useDispatch();
  const [openModal, setopenModal] = useState<boolean>(false);
  const [modalList, setmodalList] = useState<any[]>(states);
  const [modalType, setmodalType] = useState<"state" | "city">("state");
  const [modalValue, setmodalValue] = useState<string>("");

  const [promocodeLoading, setpromocodeLoading] = useState(false);

  const [formState, setFormState] = useState({
    date: moment().add(10, "days").format("MMM DD, YYYY"),
    count: 1,
    name: "",
    city: "",
    state: "",
    phone: phoneNumber ?? "",
    address: "",
    pincode: "",
    totalPrice:
      image?.discountedPrice * 1 + 100 + image?.discountedPrice * 1 * 0.18,
    promoCode: 0,
    isSuperNoteApplied: false,
    isPromoCodeApplied: false,
  });

  const getdiscountedPrice = (count: number) => {
    let actualPrice = image?.discountedPrice * count;
    if (formState?.isSuperNoteApplied) {
      actualPrice = parseFloat((actualPrice * 0.8).toFixed(2));
    }
    if (formState?.isPromoCodeApplied) {
      actualPrice = parseFloat((actualPrice * 0.8).toFixed(2));
    }

    setpaymentBreakUp({
      subTotal: image?.discountedPrice * count,
      discountedPrice: actualPrice,
      shipping: shippingCharge,
      gst: isGSTEnabled ? parseFloat((actualPrice * 0.18).toFixed(2)) : 0,
      total:
        actualPrice +
        shippingCharge +
        (isGSTEnabled ? parseFloat((actualPrice * 0.18).toFixed(2)) : 0),
    });

    setFormState({
      ...formState,
      count,
      totalPrice:
        actualPrice +
        shippingCharge +
        (isGSTEnabled ? parseFloat((actualPrice * 0.18).toFixed(2)) : 0),
    });
  };
  const [paymentBreakUp, setpaymentBreakUp] = useState({
    subTotal: image?.discountedPrice * formState.count,

    discountedPrice: image?.discountedPrice * formState.count,

    shipping: 100,
    gst: isGSTEnabled ? image?.discountedPrice * formState.count * 0.18 : 0,
    total:
      image?.discountedPrice * formState.count +
      shippingCharge +
      (isGSTEnabled ? image?.discountedPrice * formState.count * 0.18 : 0),
  });
  const handleInputChange = (text: string, type: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [type]: text,
      ...(type === "state" ? { city: "" } : {}),
    }));
  };

  const handleCountChange = (increment: boolean) => {
    const newCount = increment ? formState.count + 1 : formState.count - 1;

    // Prevent the count from dropping below 1
    if (newCount < 1) return;

    // Update total price based on newCount
    getdiscountedPrice(newCount);
  };

  const handlePromocodeValidation = async () => {
    try {
      setpromocodeLoading(true);
      const response = await validatePromoCode({
        promoCode: formState?.promoCode,
      });
      setFormState((prevState) => ({
        ...prevState,
        isPromoCodeApplied: true,
      }));
      notifyMessage(response?.data?.message);
    } catch (error) {
      notifyMessage("Invalid promo code");
      console.error("Error validating promo code:", error);
      setFormState((prevState) => ({
        ...prevState,
        isPromoCodeApplied: false,
      }));
    } finally {
      setpromocodeLoading(false);
    }
  };

  const handleModalPress = (type: "state" | "city") => {
    setmodalType(type);
    if (type === "state") {
      setmodalList(states);
    } else if (type === "city") {
      if (formState?.state && formState?.state?.length > 1)
        setmodalList(getCityListByState(formState?.state ?? "") as string[]);
      else {
        notifyMessage("You must select a state to fill city");
        return;
      }
    }

    setopenModal(true);
  };

  // Calculate delivery date as 10 days from the current date
  const deliveryDate = moment().add(10, "days").format("MMM DD, YYYY");

  const handleApplySuperNote = () => {
    setFormState({
      ...formState,
      isSuperNoteApplied: !formState?.isSuperNoteApplied,
    });
    // let actualPrice = image?.discountedPrice * (formState?.count ?? 1);
    // console.log(actualPrice * 0.2, superNote);

    // if (actualPrice * 0.2 <= parseInt(superNote))
    //   setFormState({
    //     ...formState,
    //     isSuperNoteApplied: !formState?.isSuperNoteApplied,
    //   });
    // else notifyMessage("Supernote limit exceeded");
  };

  useEffect(() => {
    //formState);
    dispatch(setCurrentOrder(formState));
    const buttonState =
      formState.name === "" ||
      formState.address === "" ||
      formState.city === "" ||
      formState.state === "" ||
      formState.phone.length < 10 ||
      formState.phone.includes(".") ||
      formState.pincode.length < 6 ||
      formState.pincode.includes(".");
    dispatch(setButtonState(buttonState));
  }, [formState, paymentBreakUp]);

  useEffect(() => {
    getdiscountedPrice(formState.count ?? 1);
  }, [formState?.isSuperNoteApplied, formState?.isPromoCodeApplied]);

  return (
    <CartLayout buttonText="Place order" navigation={navigation}>
      <View style={styles.titleContainer}>
        <Icon
          name="arrow-back"
          size={24}
          color="black"
          style={{ top: -2 }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Checkout</Text>
      </View>

      {image &&
        (openModal ? (
          <OptionModal
            visible={openModal}
            setVisible={setopenModal}
            options={modalList}
            onSelect={handleInputChange}
            type={modalType}
            selectedOption={modalValue}
            setSelectedOption={setmodalValue}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.puschaseDetailsContainer}>
              <View style={styles.imageContainer}>
                <Image source={image.source} style={styles.image} />
              </View>
              <View style={styles.details}>
                <Text style={styles.name}>{image.title}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.discountedPrice}>
                    ₹ {image.discountedPrice * formState.count}
                  </Text>
                  <Text style={styles.originalPrice}>
                    ₹{image.originalPrice * formState.count}
                  </Text>
                </View>
                <View style={styles.count}>
                  <IconButton
                    style={styles.countButton}
                    icon="plus"
                    onPress={() => handleCountChange(true)}
                  />
                  <Text style={styles.countText}>{formState.count}</Text>
                  <IconButton
                    style={styles.countButton}
                    icon="minus"
                    onPress={() => handleCountChange(false)}
                  />
                </View>
              </View>
            </View>
            <View style={styles.addressDetailsContainer}>
              <Text style={styles.title}>Address Details</Text>
              <KeyboardAvoidingView behavior="padding">
                <View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      maxLength={200}
                      style={styles.input}
                      placeholder="Name "
                      placeholderTextColor={styleConstants.color.textGrayColor}
                      value={formState.name}
                      onChangeText={(text) => handleInputChange(text, "name")}
                    />
                    <TextInput
                      maxLength={200}
                      style={styles.input}
                      placeholder="Address "
                      placeholderTextColor={styleConstants.color.textGrayColor}
                      value={formState.address}
                      onChangeText={(text) =>
                        handleInputChange(text, "address")
                      }
                    />

                    <TextInput
                      maxLength={200}
                      style={styles.input}
                      placeholder="State"
                      placeholderTextColor={styleConstants.color.textGrayColor}
                      value={formState.state}
                      onPress={() => {
                        handleModalPress("state");
                      }}
                      // onChangeText={(text) => handleInputChange(text, "state")}
                    />
                    <TextInput
                      maxLength={200}
                      style={styles.input}
                      placeholder="City"
                      placeholderTextColor={styleConstants.color.textGrayColor}
                      value={formState.city}
                      onPress={() => {
                        handleModalPress("city");
                      }}
                      // onChangeText={(text) => handleInputChange(text, "city")}
                    />
                    <TextInput
                      maxLength={6}
                      inputMode="numeric"
                      style={styles.input}
                      placeholder="Pincode "
                      placeholderTextColor={styleConstants.color.textGrayColor}
                      value={formState.pincode}
                      onChangeText={(text) =>
                        handleInputChange(text, "pincode")
                      }
                    />
                    <TextInput
                      maxLength={10}
                      inputMode="numeric"
                      style={styles.input}
                      placeholder="Phone Number "
                      placeholderTextColor={styleConstants.color.textGrayColor}
                      keyboardType="phone-pad"
                      value={formState.phone}
                      onChangeText={(text) => handleInputChange(text, "phone")}
                    />
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.title}>Payment Methods</Text>
              <View style={styles.paymentMethods}>
                {/* <TouchableOpacity style={styles.paymentOption}>
                  <View style={styles.paymentImageContainer}>
                    <Image
                      source={require("../../assets/cash.png")}
                      style={styles.paymentMethodImage}
                    />
                  </View>
                  <Text style={styles.paymentMethodText}>Cash</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.paymentOption}>
                  <View style={styles.paymentImageContainer}>
                    <Image
                      source={require("../../assets/UPI.png")}
                      style={styles.paymentMethodImage}
                    />
                  </View>
                  <Text style={styles.paymentMethodText}>UPI</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApplySuperNote}
                  style={styles.paymentOption}
                >
                  <View style={styles.paymentImageContainer}>
                    <Image
                      source={require("../../assets/offers.png")}
                      style={styles.paymentMethodImage}
                    />
                  </View>
                  <Text style={styles.paymentMethodText}>Apply super note</Text>
                </TouchableOpacity>
              </View>
            </View>
            {formState?.isSuperNoteApplied && (
              <Text style={styles.paymentMethodText}> Super note applied</Text>
            )}

            {formState?.isPromoCodeApplied && (
              <Text style={styles.paymentMethodText}>
                {" "}
                {`Promo code ${formState?.promoCode} applied`}
              </Text>
            )}

            <View style={styles.divider} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter Promo Code"
              placeholderTextColor="#aaa"
              value={formState.promoCode.toString()}
              onChangeText={(text: string) => {
                handleInputChange(text, "promoCode");
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

            <View style={styles.deliveryDetails}>
              <View style={styles.deliveryDate}>
                <Text style={styles.dateText}>Delivery Date:</Text>
                <Text style={styles.date}>{deliveryDate}</Text>
              </View>
              <View style={styles.total}>
                <Text style={styles.totalText}>Subtotal</Text>
                <Text style={styles.totalAmount}>
                  ₹{paymentBreakUp.subTotal}
                </Text>
              </View>
              <View style={styles.total}>
                <Text style={styles.totalText}>Discounted price</Text>
                <Text style={styles.totalAmount}>
                  ₹{paymentBreakUp.discountedPrice}
                </Text>
              </View>
              {paymentBreakUp?.gst > 0 && (
                <View style={styles.total}>
                  <Text style={styles.totalText}>Tax</Text>
                  <Text style={styles.totalAmount}>₹{paymentBreakUp.gst}</Text>
                </View>
              )}
              <View style={styles.total}>
                <Text style={styles.totalText}>Shipping</Text>
                <Text style={styles.totalAmount}>
                  ₹{paymentBreakUp.shipping}
                </Text>
              </View>
              <View style={styles.total}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>₹{paymentBreakUp.total}</Text>
              </View>
            </View>
          </ScrollView>
        ))}
    </CartLayout>
  );
};

export default PaymentDetail;

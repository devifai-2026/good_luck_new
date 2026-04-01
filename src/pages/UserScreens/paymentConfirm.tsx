import { View, Text, StyleSheet, Modal, BackHandler } from "react-native";
import { styleConstants } from "../../styles/constants";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import OrderDetails from "../../components/User/orderDetails";
import { paymentConfirm as styles } from "../../styles";

const ConfirmPayment = ({ navigation }: { navigation: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonEnable, setButtonEnable] = useState(false);

  const toggleVisiblity = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("subproducts"); // Navigate to home page on back button press
      return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    setTimeout(() => {
      setButtonEnable(true);
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <Icon name="check-circle" style={styles.icon} size={160}></Icon>
      <Text style={styles.text}>
        Your Order is complete. Please check the delivery status at the order
        tracking page.
      </Text>
      <Button
        disabled={!buttonEnable}
        style={buttonEnable ? styles.enableButton : styles.disabledButton}
        onPress={() => {
          navigation.navigate("subproducts");
        }}
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </Button>

      <Modal
        visible={isVisible}
        onRequestClose={() => toggleVisiblity()}
        animationType="slide"
      >
        <OrderDetails closeModal={() => toggleVisiblity()} />
      </Modal>
    </View>
  );
};

export default ConfirmPayment;

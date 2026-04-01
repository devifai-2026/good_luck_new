import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { styleConstants } from "../../styles";

interface NoDataComponentProps {
  message: string; // Message to display
  type?: "small"; // Optional prop for smaller image size
}

const NoDataComponent: React.FC<NoDataComponentProps> = ({ message, type }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/noData.png")}
        style={[styles.image, type === "small" && styles.smallImage]}
        resizeMode="contain"
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default NoDataComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  smallImage: {
    width: 75,
    height: 75,
  },
  message: {
    fontSize: 16,
    color: styleConstants.color.primaryColor,
    textAlign: "center",
    fontFamily: styleConstants.fontFamily, // Replace with your preferred font family
  },
});

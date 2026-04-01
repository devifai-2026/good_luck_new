import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { styleConstants } from "../../styles"; // Adjust path if needed
import { Provider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
const ProfileRequestPopup = (props: any) => {
  const navigation = useNavigation<any>();
  const { visible, onSkip } = props;
  return (
    <Provider>
      <Modal transparent={true} visible={visible} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.message}>
              Completing your profile helps us provide a better experience.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  onSkip(false);
                }}
                style={styles.skipButton}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("myprofileedit");
                  onSkip(false);
                }}
                style={styles.createButton}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "black",
    fontFamily: styleConstants.fontFamily,
  },
  message: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: styleConstants.fontFamily,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  skipButton: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  skipButtonText: {
    color: styleConstants.color.primaryColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
  createButton: {
    flex: 1,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
});

export default ProfileRequestPopup;

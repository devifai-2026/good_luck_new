import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Button, IconButton, ActivityIndicator } from "react-native-paper";

import UploadScreen from "./imageUploader";
import { styleConstants } from "../../styles";
import { useRoute } from "@react-navigation/native";
import useLocalServices from "../../hooks/useLocalServices";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import OptionModal from "./modal";
import { states } from "../../services/constants";

interface CreateLocalServiceModalProps {
  visible: boolean;
  onClose: () => void;

  title: string;
}

interface LocalServiceData {
  contact: string;
  state: string;
  city: string;
  pincode: string;
  address: string;
}

const CreateLocalServiceModal: React.FC<CreateLocalServiceModalProps> = ({
  visible,
  onClose,

  title,
}) => {
  const [showStateModal, setshowStateModal] = useState(false);
  const [inputValue, setInputValue] = useState<LocalServiceData>({
    city: "",
    contact: "",
    pincode: "",
    state: "",
    address: "",
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const imageNumber = 1;

  const handleImageRemove = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const { createLocalService, isLoading } = useLocalServices();

  const routes = useRoute<any>();

  const callback = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (
      inputValue.contact.length < 10 ||
      inputValue.state.length < 2 ||
      inputValue.city.length < 2 ||
      inputValue.pincode.length < 6 ||
      inputValue.address.length < 2 ||
      uploadedImages.length < 1
    ) {
      notifyMessage("Please fill all the fields correctly.");
      return;
    }
    const localServiceData = {
      contact: inputValue.contact,
      state: inputValue.state,
      city: inputValue.city,
      pinCode: inputValue.pincode,
      address: inputValue.address,
      image: uploadedImages[0],
      category: routes?.params?.localServiceId,
      isAvilable: true,
    };
    await createLocalService(localServiceData, callback);
  };

  const trimSpaces = (text: string) => {
    return text.replace(/^\s+|\s+$/g, "");
  };

  const setStateValue = (value: string) => {
    setInputValue({ ...inputValue, state: value });
    setshowStateModal(false);
  };

  return showStateModal ? (
    <OptionModal
      visible={showStateModal}
      setVisible={setshowStateModal}
      options={states}
      onSelect={setStateValue}
      type={"state"}
      selectedOption={inputValue.state}
      setSelectedOption={() => {}}
    />
  ) : (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <ScrollView
            contentContainerStyle={styles.modalContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.textFieldHeader}>Contact Number</Text>
            <TextInput
              placeholder="Contact Number"
              inputMode="numeric"
              maxLength={10}
              value={inputValue.contact}
              onChangeText={(text) =>
                setInputValue({
                  ...inputValue,
                  contact: trimSpaces(text),
                })
              }
              style={styles.input}
            />
            <Text style={styles.textFieldHeader}>Address</Text>
            <TextInput
              placeholder="Address"
              value={inputValue.address}
              onChangeText={(text) =>
                setInputValue({ ...inputValue, address: trimSpaces(text) })
              }
              style={styles.input}
            />
            <Text style={styles.textFieldHeader}>State</Text>
            <TextInput
              placeholder="State"
              value={inputValue.state}
              onPress={() => {
                setshowStateModal(true);
              }}
              style={styles.input}
            />
            <Text style={styles.textFieldHeader}>City</Text>
            <TextInput
              placeholder="City"
              value={inputValue.city}
              onChangeText={(text) =>
                setInputValue({ ...inputValue, city: trimSpaces(text) })
              }
              style={styles.input}
            />

            <Text style={styles.textFieldHeader}>Pincode</Text>
            <TextInput
              placeholder="Pincode"
              inputMode="numeric"
              maxLength={6}
              value={inputValue.pincode}
              onChangeText={(text) =>
                setInputValue({ ...inputValue, pincode: trimSpaces(text) })
              }
              style={styles.input}
            />
            <Text style={styles.textFieldHeader}>Upload banner</Text>
            {uploadedImages.length < imageNumber && (
              <UploadScreen
                imageCount={imageNumber}
                selectedImage={uploadedImages}
                setSelectedImage={setUploadedImages}
              />
            )}
            {uploadedImages.length > 0 && (
              <ScrollView
                horizontal
                contentContainerStyle={styles.imagesScroll}
                showsHorizontalScrollIndicator={false}
              >
                {uploadedImages.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <IconButton
                      icon="close"
                      size={18}
                      style={styles.removeIcon}
                      onPress={() => handleImageRemove(index)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
            <Button
              mode="contained"
              onPress={handleSubmit}
              buttonColor={styleConstants.color.primaryColor}
              style={styles.button}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? <ActivityIndicator /> : "Create"}
              </Text>
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateLocalServiceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: {
    width: "90%",
    maxHeight: "80%", // limit to safe height, scrollable
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 10,
  },
  modalContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  textFieldHeader: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  input: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: styleConstants.color.textWhiteColor,
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
  },
  imagesScroll: {
    flexDirection: "row",
    gap: 12,
    marginTop: 15,
    paddingBottom: 10,
  },
  imageContainer: {
    position: "relative",
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "white",
    zIndex: 10,
    elevation: 2,
  },
});

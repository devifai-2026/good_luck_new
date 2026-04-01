import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
} from "react-native-image-picker";

import { styleConstants } from "../../styles/constants";
import { IconButton } from "react-native-paper";

import { notifyMessage } from "../../hooks/useDivineShopServices";
import { cloudinaryBucketName, uploadPreset } from "../../constants";
import { cloudinaryURL } from "../../services/constants";
import axios from "axios";

import { imageUploaderStyles as styles } from "../../styles";
import { requestCameraPermission } from "../../redux/utils";

const UploadScreen = (props: {
  imageCount: number;
  selectedImage: string[];
  setSelectedImage: any;
}) => {
  const { selectedImage, setSelectedImage } = props;
  const [uploading, setUploading] = useState<boolean>(false);

  const selectImageFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      notifyMessage("Camera permission denied.");
      return;
    }
    try {
      const cameraOptions: CameraOptions = {
        mediaType: "photo",
        maxWidth: 2000,
        maxHeight: 2000,
        saveToPhotos: true,
      };

      setUploading(true); // Start showing the loading indicator

      const response = await launchCamera(cameraOptions);
      handleImageResponse(response);

      // Simulate a 2-second loading time
      setTimeout(() => {
        setUploading(false); // Stop showing the loading indicator after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Error launching camera:", error);
      notifyMessage("Failed to launch the camera.");
      setUploading(false); // Stop the loading indicator if an error occurs
    }
  };

  const selectImageFromGallery = async () => {
    try {
      const galleryOptions: ImageLibraryOptions = {
        mediaType: "photo",
        maxWidth: 2000,
        maxHeight: 2000,
      };

      const response = await launchImageLibrary(galleryOptions);
      handleImageResponse(response);
    } catch (error) {
      console.error("Error launching image library:", error);
      notifyMessage("Failed to open the image library.");
    }
  };

  const handleImageResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      // ("User cancelled image picker");
    } else if (response.errorCode) {
      // ("ImagePicker Error: ", response.errorMessage);
    } else if (response.assets && response.assets[0].uri) {
      try {
        const responseURl = await uploadToCloudinary(response.assets[0]);
        setSelectedImage([...selectedImage, responseURl]);
        // (responseURl);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // The function to handle file upload
  const uploadToCloudinary = async (file: any) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri, // Use the appropriate file URI
        type: file.type, // Adjust the file type if necessary (e.g., image/jpeg)
        name: file.name || "image.jpg", // Optional: file name
      });
      formData.append("upload_preset", uploadPreset); // Append the preset

      const response = await fetch(cloudinaryURL, {
        method: "POST",
        body: formData,
      });

      const data = await response?.json();

      if (data?.secure_url) {
        // ("Image uploaded successfully:", data.secure_url);
        return data?.secure_url;
        // Handle the uploaded image URL or data
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={selectImageFromCamera}
      >
        <IconButton icon="camera" size={40} style={styles.cameraIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={selectImageFromGallery}
      >
        <IconButton icon="folder" size={40} style={styles.cameraIcon} />
      </TouchableOpacity>

      {uploading && (
        <>
          <View
            style={{
              width: 80,
              height: 80,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color={styleConstants.color.primaryColor}
            />
          </View>
        </>
      )}

      {/* {selectedImage?.assets?.[0]?.uri && (
  <Image
    source={{ uri: selectedImage.assets[0].uri }}
    style={styles.selectedImage}
  />
)} */}
    </SafeAreaView>
  );
};

export default UploadScreen;

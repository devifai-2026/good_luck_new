import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import {
  Button,
  Checkbox,
  Chip,
  Avatar,
  Text,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { createProfileStyles as styles } from "../../styles/loveandfriends.style";
import UploadScreen from "../../components/Shared/imageUploader";
import { styleConstants } from "../../styles/constants";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { logOut } from "../../redux/silces/auth.silce";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import OTPVerificationModal from "../../components/Shared/otpVerificationModal";
import useAuthService from "../../hooks/useAuthServices";
import { languages } from "../../services/constants";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface AstrologerFormState {
  Fullname: string;
  Fname: string;
  Lname: string;
  phone: string;
  specialisation: string[];
  chat_price: string;
  video_price: string;
  call_price: string;
  years_of_experience: string;
  profile_picture: string;
  description: string;
  language: string[];
  certifications: string[];
  adhar_card: string[];
  pan_card: string[];
}

const AstrologerForm = (props: { isEditForm?: boolean }) => {
  const { isEditForm } = props;
  const navigation = useNavigation<any>();
  const [form, setForm] = useState<AstrologerFormState>({
    Fullname: "",
    Fname: "",
    Lname: "",
    phone: "",
    specialisation: [],
    chat_price: "",
    video_price: "0",
    call_price: "",
    years_of_experience: "",
    profile_picture: "",
    description: "",
    language: [],
    certifications: [],
    adhar_card: [],
    pan_card: [],
  });

  const [modalVisible, setmodalVisible] = useState<boolean>(false);

  const dispatch = useDispatch();

  const phoneNumber = useSelector(
    (state: RootState) => state.auth.userDetails?.phoneNumber,
  );

  const astrologerDetails = useSelector(
    (state: RootState) => state.auth.userDetails?.astrologerDetails,
  );

  const astrologerCategory = useSelector(
    (state: RootState) => state.auth.astrologerCategories,
  );

  const imageNumber = 1;

  const [checkedLanguages, setCheckedLanguages] = useState<string[]>(
    form.language,
  );
  const [checkedSpecialisations, setCheckedSpecialisations] = useState<
    string[]
  >(form.specialisation);

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [uploadedAAdhaar, setUploadedAadhaar] = useState<string[]>([]);

  const [uploadedPan, setUploadedPan] = useState<string[]>([]);

  const { createAstrologer, updateAstrologerProfile, loading } =
    useAstrologyServices();

  const { handleLogOut } = useAuthService();

  const handleCheckboxToggle = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleImageRemove = (
    type: "profilepicture" | "aadhaaarcard" | "pan",
  ) => {
    if (type === "profilepicture") setUploadedImages([]);
    else if (type === "aadhaaarcard") setUploadedAadhaar([]);
    else setUploadedPan([]);
  };

  const toogleModalState = () => {
    setmodalVisible(!modalVisible);
  };

  const handleFormSubmit = async () => {
    // Validate Full Name
    if (!form?.Fullname?.trim()) {
      notifyMessage("Full name is required.");
      return;
    }

    // Validate Phone Number
    const phoneRegex = /^[0-9]{10}$/; // Adjust based on the desired phone number format
    if (!phoneRegex.test(phoneNumber ?? "")) {
      notifyMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!form?.call_price?.trim()) {
      notifyMessage("Call price is required.");
      return;
    }

    if (!form?.chat_price?.trim()) {
      notifyMessage("Chat price is required.");
      return;
    }

    if (!form?.description?.trim()) {
      notifyMessage("Description is required.");
      return;
    }
    if (!form?.years_of_experience?.trim()) {
      notifyMessage("Years of experience is required.");
      return;
    }

    // Validate Languages
    if (!checkedLanguages || checkedLanguages.length === 0) {
      notifyMessage("At least one language must be selected.");
      return;
    }

    // Validate Specialisations
    if (!checkedSpecialisations || checkedSpecialisations.length === 0) {
      notifyMessage("At least one specialisation must be selected.");
      return;
    }

    // Validate Aadhaar Card
    if (!uploadedAAdhaar || uploadedAAdhaar.length === 0) {
      notifyMessage("Please upload an Aadhaar card.");
      return;
    }

    // Validate PAN Card
    if (!uploadedPan || uploadedPan.length === 0) {
      notifyMessage("Please upload a PAN card.");
      return;
    }

    // Validate Profile Picture
    if (!uploadedImages || uploadedImages.length === 0) {
      notifyMessage("Please upload a profile picture.");
      return;
    }

    const formData: AstrologerFormState = {
      ...form,
      Fname: form?.Fullname?.trim()?.split(" ")[0],
      Lname: form?.Fullname?.trim()?.split(" ")[1] ?? " ",
      phone: phoneNumber ?? "",
      language: checkedLanguages,
      specialisation: checkedSpecialisations,

      adhar_card: [uploadedAAdhaar[0]],
      pan_card: [uploadedPan[0]],
      profile_picture: uploadedImages[0],
    };
    if (isEditForm) {
      try {
        await updateAstrologerProfile(
          formData,
          astrologerDetails?.authId ?? "",
          toogleModalState,
        );
      } catch (error) {
        console.error("Form submission failed:", error);
        notifyMessage("Failed to submit the form. Please try again.");
      }
    } else {
      try {
        await createAstrologer(formData);
        notifyMessage("Form submitted successfully!");
      } catch (error) {
        console.error("Form submission failed:", error);
        notifyMessage("Failed to submit the form. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isEditForm) {
      setUploadedImages([astrologerDetails?.profile_picture]);

      setCheckedLanguages(astrologerDetails?.language ?? []);
      setCheckedSpecialisations(astrologerDetails?.specialisation ?? []);
      setUploadedAadhaar([astrologerDetails?.adhar_card[0] ?? ""]);
      setUploadedPan([astrologerDetails?.pan_card[0] ?? ""]);

      setForm({
        ...form,
        Fullname: `${astrologerDetails?.Fname} ${astrologerDetails?.Lname}`,
        phone: astrologerDetails?.phone ?? "",
        chat_price: astrologerDetails?.chat_price?.toString() ?? "",
        video_price: astrologerDetails?.video_price?.toString() ?? "",
        call_price: astrologerDetails?.call_price?.toString() ?? "",
        years_of_experience:
          astrologerDetails?.years_of_experience?.toString() ?? "",
        description: astrologerDetails?.description ?? "",
      });
    }
  }, []);

  return modalVisible ? (
    <OTPVerificationModal
      visible={modalVisible}
      setModalVisible={toogleModalState}
    />
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={styles.headerContainerStyle}>
        {isEditForm && (
          <Icon
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
        )}
        <Text style={styles.header}>
          {isEditForm
            ? "Edit Astrologer profile"
            : "Astrologer Registration Form"}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {!isEditForm && (
          <Text style={styles.sectionHeader}>Please register to proceed </Text>
        )}

        {!isEditForm && (
          <IconButton
            onPress={() => {
              handleLogOut();
            }}
            icon={"logout"}
          />
        )}
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.sectionHeader}>
          {" "}
          {isEditForm ? "Edit profile picture" : "Upload profile picture"}
        </Text>
        <View style={styles.imagesGrid}>
          {/* Render UploadScreen if the number of uploaded images is less than the allowed limit */}
          {uploadedImages.length !== imageNumber && (
            <UploadScreen
              imageCount={imageNumber}
              selectedImage={uploadedImages}
              setSelectedImage={setUploadedImages} // Use the function to update the uploaded images
            />
          )}

          <View style={styles.imagesParentContainer}>
            {/* Render each uploaded image with the close button */}
            {uploadedImages.length > 0 &&
              uploadedImages.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  {image?.length > 0 && (
                    <>
                      {/* Render the uploaded image */}
                      <Image
                        loadingIndicatorSource={{ uri: image }}
                        source={{ uri: image }}
                        style={styles.image}
                      />
                      {/* Render the close button to remove the image */}
                      <IconButton
                        icon="close"
                        size={20}
                        style={styles.removeIcon}
                        onPress={() => handleImageRemove("profilepicture")}
                      />
                    </>
                  )}
                </View>
              ))}
          </View>
        </View>
        <Text style={styles.textFieldHeader}>Fullname</Text>
        <TextInput
          // theme={{
          //   roundness: 60, // Custom border radius
          //   fonts: {
          //     regular: { fontFamily: styleConstants.fontFamily }, // Custom font family
          //   },
          // }}
          // mode="outlined"
          style={styles.input}
          // outlineColor={styleConstants.color.textBlackColor}
          placeholderTextColor={styleConstants.color.textGrayColor}
          // activeOutlineColor={styleConstants.color.textBlackColor}
          maxLength={100}
          placeholder="Fullname"
          value={form.Fullname}
          onChangeText={(value) => handleInputChange("Fullname", value)}
        // keyboardType="phone-pad"
        />
        <Text style={styles.textFieldHeader}>Chat price</Text>
        <TextInput
          // theme={{
          //   roundness: 60, // Custom border radius
          //   fonts: {
          //     regular: { fontFamily: styleConstants.fontFamily }, // Custom font family
          //   },
          // }}
          // mode="outlined"
          style={styles.input}
          // outlineColor={styleConstants.color.textBlackColor}
          placeholderTextColor={styleConstants.color.textGrayColor}
          // activeOutlineColor={styleConstants.color.textBlackColor}
          maxLength={4}
          placeholder="Chat Price"
          value={form.chat_price}
          onChangeText={(value) => handleInputChange("chat_price", value)}
          keyboardType="numeric"
        />
        {/* <TextInput
          theme={{
            roundness: 60, // Custom border radius
            fonts: {
              regular: { fontFamily: styleConstants.fontFamily }, // Custom font family
            },
          }}
          mode="outlined"
          style={styles.input}
          outlineColor={styleConstants.color.textBlackColor}
          placeholderTextColor={styleConstants.color.textGrayColor}
          activeOutlineColor={styleConstants.color.textBlackColor}
          maxLength={4}
          placeholder="Video Price"
          value={form.video_price}
          onChangeText={(value) => handleInputChange("video_price", value)}
          keyboardType="numeric"
        /> */}
        <Text style={styles.textFieldHeader}>Call price</Text>
        <TextInput
          // theme={{
          //   roundness: 60, // Custom border radius
          //   fonts: {
          //     regular: { fontFamily: styleConstants.fontFamily }, // Custom font family
          //   },
          // }}
          // mode="outlined"
          style={styles.input}
          // outlineColor={styleConstants.color.textBlackColor}
          placeholderTextColor={styleConstants.color.textGrayColor}
          // activeOutlineColor={styleConstants.color.textBlackColor}
          maxLength={4}
          placeholder="Call Price"
          value={form.call_price}
          onChangeText={(value) => handleInputChange("call_price", value)}
          keyboardType="numeric"
        />
        <Text style={styles.textFieldHeader}>Years of Experience</Text>
        <TextInput
          // theme={{
          //   roundness: 60, // Custom border radius
          //   fonts: {
          //     regular: { fontFamily: styleConstants.fontFamily }, // Custom font family
          //   },
          // }}
          // mode="outlined"
          style={styles.input}
          // outlineColor={styleConstants.color.textBlackColor}
          placeholderTextColor={styleConstants.color.textGrayColor}
          // activeOutlineColor={styleConstants.color.textBlackColor}
          maxLength={2}
          placeholder="Years of Experience"
          value={form.years_of_experience}
          onChangeText={(value) =>
            handleInputChange("years_of_experience", value)
          }
          keyboardType="numeric"
        />
        <Text style={styles.textFieldHeader}>Description</Text>
        <TextInput
          // theme={{
          //   roundness: 60, // Custom border radius
          //   fonts: {
          //     regular: { fontFamily: styleConstants.fontFamily }, // Custom font family
          //   },
          // }}
          // mode="outlined"
          style={styles.bioInput}
          // outlineColor={styleConstants.color.textBlackColor}
          placeholderTextColor={styleConstants.color.textGrayColor}
          // activeOutlineColor={styleConstants.color.textBlackColor}
          placeholder="Description"
          value={form.description}
          onChangeText={(value) => handleInputChange("description", value)}
          multiline
          maxLength={300}
        />
        <Text style={styles.sectionHeader}>
          {" "}
          {isEditForm ? "Edit AADHAAR" : "Upload AADHAAR"}
        </Text>
        <View style={styles.imagesGrid}>
          {/* Render UploadScreen if the number of uploaded images is less than the allowed limit */}
          {uploadedAAdhaar.length !== imageNumber && (
            <UploadScreen
              imageCount={imageNumber}
              selectedImage={uploadedAAdhaar}
              setSelectedImage={setUploadedAadhaar} // Use the function to update the uploaded images
            />
          )}

          <View style={styles.imagesParentContainer}>
            {/* Render each uploaded image with the close button */}
            {uploadedAAdhaar.length > 0 &&
              uploadedAAdhaar.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  {image?.length > 0 && (
                    <>
                      {/* Render the uploaded image */}
                      <Image
                        loadingIndicatorSource={{ uri: image }}
                        source={{ uri: image }}
                        style={styles.image}
                      />
                      {/* Render the close button to remove the image */}
                      <IconButton
                        icon="close"
                        size={20}
                        style={styles.removeIcon}
                        onPress={() => handleImageRemove("aadhaaarcard")}
                      />
                    </>
                  )}
                </View>
              ))}
          </View>
        </View>
        <Text style={styles.sectionHeader}>
          {" "}
          {isEditForm ? "Edit PAN" : "Upload PAN"}
        </Text>
        <View style={styles.imagesGrid}>
          {/* Render UploadScreen if the number of uploaded images is less than the allowed limit */}
          {uploadedPan.length !== imageNumber && (
            <UploadScreen
              imageCount={imageNumber}
              selectedImage={uploadedPan}
              setSelectedImage={setUploadedPan} // Use the function to update the uploaded images
            />
          )}

          <View style={styles.imagesParentContainer}>
            {/* Render each uploaded image with the close button */}
            {uploadedPan.length > 0 &&
              uploadedPan.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  {image?.length > 0 && (
                    <>
                      {/* Render the uploaded image */}
                      <Image
                        loadingIndicatorSource={{ uri: image }}
                        source={{ uri: image }}
                        style={styles.image}
                      />
                      {/* Render the close button to remove the image */}
                      <IconButton
                        icon="close"
                        size={20}
                        style={styles.removeIcon}
                        onPress={() => handleImageRemove("pan")}
                      />
                    </>
                  )}
                </View>
              ))}
          </View>
        </View>
        <Text style={styles.sectionHeader}>Languages</Text>
        <View style={styles.chipsContainer}>
          {languages.map((lang) => (
            <Chip
              icon={undefined}
              key={lang}
              selected={checkedLanguages.includes(lang)}
              onPress={() =>
                handleCheckboxToggle(
                  lang,
                  checkedLanguages,
                  setCheckedLanguages,
                )
              }
              style={[
                styles.chip,
                checkedLanguages.includes(lang) && styles.chipSelected,
              ]}
            >
              <Text
                style={
                  checkedLanguages.includes(lang)
                    ? styles.chipTextSelected
                    : styles.chipText
                }
              >
                {lang}
              </Text>
            </Chip>
          ))}
        </View>
        <Text style={styles.sectionHeader}>Specialisation</Text>
        <View style={styles.chipsContainer}>
          {astrologerCategory?.map((spec: any) => (
            <Chip
              key={spec?._id}
              selected={checkedSpecialisations.includes(spec?._id)}
              onPress={() =>
                handleCheckboxToggle(
                  spec?._id,
                  checkedSpecialisations,
                  setCheckedSpecialisations,
                )
              }
              style={[
                styles.chip,
                checkedSpecialisations.includes(spec?._id) &&
                styles.chipSelected,
              ]}
            >
              <Text
                style={
                  checkedSpecialisations.includes(spec?._id)
                    ? styles.chipTextSelected
                    : styles.chipText
                }
              >
                {spec?.name}
              </Text>
            </Chip>
          ))}
        </View>
        <Button
          mode="contained"
          onPress={handleFormSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          <Text style={styles.submitButtonText}>
            {" "}
            {loading ? (
              <ActivityIndicator
                size={"small"}
                color={styleConstants.color.textWhiteColor}
              />
            ) : isEditForm ? (
              "Update profile"
            ) : (
              "Create profile"
            )}
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AstrologerForm;

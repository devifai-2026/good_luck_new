import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styleConstants } from "../../styles/constants";
import {
  PostCategory,
  PostType,
  useAdvertisementService,
} from "../../hooks/useAdvertisementService";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { states } from "../../services/constants";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { Image } from "react-native";
import UploadScreen from "../Shared/imageUploader";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import { getCityListByState } from "../../redux/utils";
import { textAddHomeAndLandFields, textAddJobFields } from "../../constants";
import OptionModal from "../Shared/modal";
import { landPageStyle, AdvertisementFormStyle as styles } from "../../styles";

// interface AdFormProps {
//   type: PostType;
//   category: PostCategory;
// }

const modalTextField = ["state", "city"];

export interface IFormData {
  postFor: string; // Represents the type of post (e.g., "Home" or "Private job")
  title: string; // Title of the post
  phone: string; // Phone number
  state: string; // State information
  city: string; // City information
  pin: string; // Pin code
  description?: string; // Description of the post
  salary?: string;
  price?: string;
  address?: string;
  companyName?: string;
  workLocation?: string;
  website?: string;
  adId?: string;
}

export default function AddNewAdvertisement() {
  const routes = useRoute<any>();
  const [selectedAdType, setSelectedAdType] = useState<PostCategory>(
    PostCategory.Text
  );

  const type =
    routes.name === "addPostForLand" || routes?.name === "editHomeAdd"
      ? PostType.HomeLand
      : PostType.Job;

  const navigation = useNavigation<any>();
  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  // const { type, category } = props;
  // const [textfieldOptions, setTextFieldOptions] = useState(
  //   type === PostType.HomeLand ? textAddHomeAndLandFields : textAddJobFields
  // );

  const textfieldOptions =
    type === PostType.HomeLand ? textAddHomeAndLandFields : textAddJobFields;

  const radioButtonOptions =
    type === PostType.HomeLand
      ? ["Home", "Land"]
      : ["Private job", "Government job"];

  const {
    createPost,
    updatePost,
    itemLoading,
    createAdvertisementPostBody,
    validateAdvertisementPostBody,
  } = useAdvertisementService();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const imageNumber = 5;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalList, setModalList] = useState<any[]>(states);
  const [modalType, setModalType] = useState<"state" | "city">("state");
  const [modalValue, setModalValue] = useState<string>("");

  const adDetails = useSelector(
    (state: RootState) => state.auth.currentAdDetails
  );

  const [formData, setFormData] = useState<IFormData>({
    postFor: type === PostType.HomeLand ? "Home" : "Private job",
    title: "",
    phone: "",
    state: "",
    city: "",
    pin: "",
    description: "",
    salary: "",
    price: "",
    address: "",
    companyName: "",
    workLocation: "",
    website: "",
    adId: "",
  });

  const handleImageRemove = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValueUpdate = (text: string, type: string) => {
    // console.log(text, type);
    // console.log(formData);
    setFormData((prev) => ({
      ...prev,
      [type]: text,
      ...(type === "state" ? { city: "" } : {}),
    }));
  };

  const handleModalPress = (type: "state" | "city") => {
    if (type === "state") {
      setModalType(type);
      setModalList(states);
    } else if (type === "city") {
      if (formData.state) {
        setModalType(type);
        setModalList(getCityListByState(formData.state) as string[]);
      } else {
        notifyMessage("You must select a state to fill city");
        return;
      }
    }
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    // console.log(selectedAdType, type);
    const validationState = validateAdvertisementPostBody(
      formData,
      uploadedImages[0] ?? "",
      selectedAdType,
      type
    );
    // console.log(validationState);
    if (typeof validationState === "string") {
      notifyMessage(validationState);
      return;
    }

    if (routes.name === "editJobAdd" || routes?.name === "editHomeAdd") {
      console.log(adDetails);
      const body = createAdvertisementPostBody(
        { ...formData, adId: adDetails?.id },
        selectedAdType,
        type,
        userId ?? "",
        uploadedImages[0] ?? ""
      );

      await updatePost(type, selectedAdType, userId ?? "", body);
      return;
    }
    const body = createAdvertisementPostBody(
      formData,
      selectedAdType,
      type,
      userId ?? "",
      uploadedImages[0] ?? ""
    );

    await createPost(type, selectedAdType, body);

    // Alert.alert("Form Submitted", JSON.stringify(formData, null, 2));
  };

  useEffect(() => {
    if (routes.name === "editJobAdd" || routes?.name === "editHomeAdd") {
      // console.log(adDetails);
      setSelectedAdType(adDetails?.type as PostCategory);
      setFormData({
        title: adDetails?.title,
        description: adDetails?.description,
        state: adDetails?.state,
        city: adDetails?.city,
        pin: adDetails?.pin,
        phone: adDetails?.phone,
        postFor: "",
        salary: adDetails?.salary,
        price: adDetails?.price,
        address: adDetails?.address,
        companyName: adDetails?.companyName,
        workLocation: adDetails?.workLocation,
        website: adDetails?.website,
      });

      setUploadedImages([adDetails?.image]);
    }
  }, []);

  // console.log(routes?.name);

  return openModal ? (
    <OptionModal
      visible={openModal}
      setVisible={setOpenModal}
      options={modalList}
      onSelect={handleValueUpdate}
      type={modalType}
      selectedOption={modalValue}
      setSelectedOption={setModalValue}
    />
  ) : (
    <View style={styles.container}>
      <View style={landPageStyle.headerContainer2}>
        <View style={landPageStyle.headerSubContainer2}>
          <Icon
            onPress={() => {
              navigation.navigate(
                routes.name === "addPostForLand"
                  ? "landhomelocalservicespage"
                  : "joblocalservicespage"
              );
            }}
            name="arrow-back"
            size={24}
            color={styleConstants.color.textBlackColor}
            style={{ top: -2, zIndex: 10000000 }}
          />
          <Text style={landPageStyle.title}>
            {routes.name === "addPostForLand"
              ? "Ad post for Home & Land"
              : routes.name === "addPostForJob"
              ? "Ad post for Jobs"
              : routes.name === "editJobAdd"
              ? "Edit Job Ad"
              : "Edit home & Land ad"}
          </Text>
        </View>
      </View>

      {/* Image Upload Section */}

      {/* Text Input Fields */}
      <View style={{ flex: 1 }}>
        <ScrollView>
          {routes.name !== "editJobAdd" && routes?.name !== "editHomeAdd" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  margin: 10,
                  width: "100%",
                  padding: 10,
                  gap: 6,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    backgroundColor:
                      selectedAdType === PostCategory.Text
                        ? styleConstants.color.primaryColor
                        : styleConstants.color.backgroundWhiteColor,
                    borderWidth: 1,
                    borderColor: styleConstants.color.primaryColor,
                  }}
                  onPress={() => setSelectedAdType(PostCategory.Text)}
                >
                  <Text
                    style={{
                      fontFamily: styleConstants.fontFamily,
                      color:
                        selectedAdType === PostCategory.Text
                          ? styleConstants.color.backgroundWhiteColor
                          : styleConstants.color.primaryColor,
                    }}
                  >
                    Text Ad
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    backgroundColor:
                      selectedAdType === PostCategory.Banner
                        ? styleConstants.color.primaryColor
                        : styleConstants.color.backgroundWhiteColor,
                    borderWidth: 1,
                    borderColor: styleConstants.color.primaryColor,
                  }}
                  onPress={() => setSelectedAdType(PostCategory.Banner)}
                >
                  <Text
                    style={{
                      fontFamily: styleConstants.fontFamily,
                      color:
                        selectedAdType === PostCategory.Banner
                          ? styleConstants.color.backgroundWhiteColor
                          : styleConstants.color.primaryColor,
                    }}
                  >
                    Banner Ad
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Post For :</Text>
                <View style={styles.radioGroup}>
                  {radioButtonOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioButtonContainer}
                      onPress={() => handleInputChange("postFor", option)}
                    >
                      <View style={styles.radioButtonOuterCircle}>
                        {formData.postFor === option && (
                          <View style={styles.radioButtonInnerCircle} />
                        )}
                      </View>
                      <Text style={styles.radioButtonLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          <View>
            {selectedAdType === PostCategory.Banner ? (
              <View style={styles.imagesGrid}>
                <Text style={styles.sectionTitle}>
                  {" "}
                  {routes?.name !== "editJobAdd" &&
                  routes?.name !== "editHomeAdd"
                    ? "Add your banner"
                    : "Update banner"}
                </Text>
                {uploadedImages.length < imageNumber && (
                  <UploadScreen
                    imageCount={5}
                    selectedImage={uploadedImages}
                    setSelectedImage={setUploadedImages}
                  />
                )}
                <View style={styles.imagesParentContainer}>
                  {uploadedImages.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri: image }} style={styles.image} />
                      <IconButton
                        icon="close"
                        size={20}
                        style={styles.removeIcon}
                        onPress={() => handleImageRemove(index)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
          {textfieldOptions.map((field, index) => {
            // Conditionally render TextInput only if the condition is met
            if (
              field.type === "description" &&
              selectedAdType === PostCategory.Banner
            ) {
              return null; // Skip rendering this field
            }
            return (
              <TextInput
                value={formData[field.type as keyof IFormData]}
                key={index}
                aria-disabled
                style={styles.input}
                multiline={field?.multiline || false}
                maxLength={field.maxLength}
                inputMode={field.inputMode}
                placeholder={field.placeholder}
                placeholderTextColor={styleConstants.color.textGrayColor}
                onFocus={() => {
                  if (
                    modalTextField.includes(field.placeholder.toLowerCase())
                  ) {
                    handleModalPress(field.type as "state" | "city");
                  }
                }}
                onChangeText={(value) => handleInputChange(field.type, value)}
              />
            );
          })}

          <TouchableOpacity
            style={styles.submitButton}
            disabled={itemLoading}
            onPress={handleSubmit}
          >
            {itemLoading ? (
              <ActivityIndicator color={styleConstants.color.textWhiteColor} />
            ) : (
              <Text style={styles.submitButtonText}>
                {" "}
                {routes.name !== "editJobAdd" && routes?.name !== "editHomeAdd"
                  ? "Post ad"
                  : "Update ad"}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

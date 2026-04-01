import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
} from "react-native";
import {
  Button,
  Chip,
  IconButton,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { styleConstants } from "../../styles/constants"; // Assuming styleConstants is defined in your project
import { useNavigation } from "@react-navigation/native";
import UploadScreen from "../Shared/imageUploader";
import useMatrimonyandDatingServices from "../../hooks/useMatrimonyDatingService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import OptionModal from "../Shared/modal";
import {
  education,
  interests,
  IProfileDetails,
  ProfileType,
  religions,
  states,
} from "../../services/constants";
import { createProfileStyles as styles } from "../../styles/loveandfriends.style";
import { getCityListByState } from "../../redux/utils";
import { notifyMessage } from "../../hooks/useDivineShopServices";

const ProfileCreation = ({ route }: { route: any }) => {
  // (route.params);

  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const profileDetails = useSelector(
    (state: RootState) => state.auth.profileDetails
  );

  const {
    getProfileDetails,
    // profileDetails,
    isLoading,
    handleButtonCLick,
    handleChipToggle,
  } = useMatrimonyandDatingServices();
  const imageNumber = 5; // route?.params?.type === "updatedatingprofile" ? 5 : 1;
  const [openModal, setopenModal] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [isDivorcee, setIsDivorcee] = useState("No");
  const [smoking, setSmoking] = useState("No");
  const [drinking, setDrinking] = useState("No");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [userDetails, setuserDetails] = useState<IProfileDetails>();
  const [modalList, setmodalList] = useState<any[]>(states);
  const [modalType, setmodalType] = useState<
    "state" | "city" | "caste" | "education"
  >("state");
  const [modalValue, setmodalValue] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  enum lookingForDatingMap {
    female = "Women",
    male = "Men",
    both = "Both",
  }
  const genderOptions =
    route?.params?.type === ProfileType.dating ||
      route?.params?.type === "updatedatingprofile"
      ? ["Men", "Women", "Both"]
      : ["bride", "groom"];

  const handleImageRemove = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleValueUpdate = (text: string, type: string) => {
    setuserDetails((prev) => ({
      ...prev,
      [type]: text,
      ...(type === "state" ? { city: "" } : {}),
    }));
  };

  useEffect(() => {
    if (
      route?.params?.type === "updatematrimonyprofile" ||
      route?.params?.type === "updatedatingprofile"
    ) {
      // (route?.params?.type, "type ");
      getProfileDetails(
        route.params.type === "updatedatingprofile"
          ? ProfileType.dating
          : ProfileType.matrimony,
        userId ?? ""
      );
      // For updates, user has already accepted terms previously
      setTermsAccepted(true);
    } else {
      // For new profiles, show terms modal
      setShowTermsModal(true);
    }
  }, [route]);

  useEffect(() => {
    if (
      route?.params?.type === "updatematrimonyprofile" ||
      route?.params?.type === "updatedatingprofile"
    ) {
      // (profileDetails, "getting profile details");
      const userData: IProfileDetails = {
        name: profileDetails?.userName,
        city: profileDetails?.city,
        state: profileDetails?.state,
        caste: profileDetails?.caste,
        age: profileDetails?.userAge?.toString(),
        salary: profileDetails?.salary,
        education: profileDetails?.education,
        pin: profileDetails?.pin,
        whatsappno: profileDetails?.whatsappNumber,
        fblink: profileDetails?.facebookLink,
      };
      const selectedGender =
        route?.params?.type === "updatedatingprofile" &&
          profileDetails?.lookingFor
          ? lookingForDatingMap[
          profileDetails.lookingFor as keyof typeof lookingForDatingMap
          ]
          : profileDetails?.lookingFor;

      setuserDetails(userData);
      setIsDivorcee(profileDetails?.isDivorcee ? "Yes" : "No");
      setSelectedGender([selectedGender]);
      setBio(profileDetails?.bio);
      setSelectedInterests(profileDetails?.interests ?? []);
      setUploadedImages(profileDetails?.imageURL ?? []);

      setDrinking(profileDetails?.drinking ? "Yes" : "No");
      setSmoking(profileDetails?.smoking ? "Yes" : "No");
    }
  }, [profileDetails]);

  const handleModalPress = (type: "state" | "city" | "caste" | "education") => {
    setmodalType(type);
    if (type === "state") {
      setmodalList(states);
    } else if (type === "city") {
      if (userDetails?.state && userDetails?.state?.length > 1)
        setmodalList(getCityListByState(userDetails?.state ?? "") as string[]);
      else {
        notifyMessage("You must select a state to fill city");
        return;
      }
    } else if (type === "caste") {
      setmodalList(religions);
    } else if (type === "education") {
      setmodalList(education);
    }
    setopenModal(true);
  };

  useEffect(() => {
    return () => {
      const userData: IProfileDetails = {
        name: "",
        city: "",
        state: "",
        caste: "",
        age: "",
        salary: "",
        education: "",
        pin: "",
        whatsappno: "",
        fblink: "",
      };

      setuserDetails(userData);
      setIsDivorcee("No");
      setSelectedGender([]);
      setBio("");
      setSelectedInterests([]);
      setUploadedImages([]);

      setDrinking("No");
      setSmoking("No");
    };
  }, []);

  const handleTermsAgree = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  const handleOpenTermsLink = () => {
    Linking.openURL("https://goodluckterms.netlify.app/").catch((err) =>
      console.error("Failed to open terms link:", err)
    );
  };

  // Terms and Conditions Modal
  const renderTermsModal = () => (
    <Modal
      visible={showTermsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        // Don't allow closing by back button on Android if terms not accepted
        if (!termsAccepted) {
          notifyMessage("You must agree to terms to continue");
        }
      }}
    >
      <View style={styles.termsModalOverlay}>
        <View style={styles.termsModalContainer}>
          <View style={styles.termsContent}>
            <Text style={styles.termsTitle}>Terms and Conditions</Text>

            <ScrollView style={styles.termsScrollView}>
              <Text style={styles.termsText}>
                Please read and accept our Terms and Conditions before creating your profile.
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.termsLinkText}>
                  Read full Terms and Conditions at:
                </Text>
                <TouchableOpacity style={styles.readButton} onPress={handleOpenTermsLink}>
                  <Text style={styles.readButtonText}>Read</Text>
                </TouchableOpacity>
              </View>


              <Text style={styles.termsNote}>
                By clicking "I Agree", you acknowledge that you have read, understood,
                and agree to be bound by our Terms and Conditions, Privacy Policy,
                and Community Guidelines.
              </Text>
            </ScrollView>

            <View style={styles.termsButtonsContainer}>
              <Button
                mode="outlined"
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.termsButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleTermsAgree}
                style={[styles.termsButton, styles.agreeButton]}
                contentStyle={styles.submitButtonContent}
              >
                I Agree
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Don't show the main content until terms are accepted for new profiles
  if (!termsAccepted && (route?.params?.type === ProfileType.matrimony || route?.params?.type === ProfileType.dating)) {
    return renderTermsModal();
  }

  return (
    <View style={{ flex: 1 }}>
      {renderTermsModal()}

      <View style={styles.headerContainerStyle}>
        <IconButton
          icon="arrow-left"
          style={styles.icon}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={styles.header}>
          {route?.params?.type === "updatematrimonyprofile"
            ? "Update matrimony profile"
            : route?.params?.type === "updatedatingprofile"
              ? "Update dating profile"
              : route?.params?.type === ProfileType.matrimony
                ? "Create matrimony profile "
                : "Create dating profile"}
        </Text>
      </View>
      {openModal ? (
        <OptionModal
          visible={openModal}
          setVisible={setopenModal}
          options={modalList}
          onSelect={handleValueUpdate}
          type={modalType}
          selectedOption={modalValue}
          setSelectedOption={setmodalValue}
        />
      ) : isLoading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size={"large"}
          color={styleConstants.color.primaryColor}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionHeader}>Profile Pictures</Text>

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
                          onPress={() => handleImageRemove(index)}
                        />
                      </>
                    )}
                  </View>
                ))}
            </View>
          </View>

          {/* <Text style={styles.sectionHeader}>Habits</Text> */}
          <TextInput
            style={styles.input}
            placeholderTextColor={styleConstants.color.textGrayColor}
            placeholder="Name"
            value={userDetails?.name}
            onChangeText={(text: string) => {
              handleValueUpdate(text, "name");
            }}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor={styleConstants.color.textGrayColor}
            placeholder="State"
            value={userDetails?.state}
            onPress={() => {
              handleModalPress("state");
            }}
            onChangeText={(text: string) => {
              handleValueUpdate(text, "state");
            }}
          />

          <TextInput
            onPress={() => {
              handleModalPress("city");
            }}
            style={styles.input}
            placeholderTextColor={styleConstants.color.textGrayColor}
            placeholder="City"
            value={userDetails?.city}
            onChangeText={(text: string) => {
              handleValueUpdate(text, "city");
            }}
          />

          {(route?.params?.type === ProfileType.dating ||
            route?.params?.type === "updatedatingprofile") && (
              <TextInput
                editable={true}
                style={styles.input}
                placeholderTextColor={styleConstants.color.textGrayColor}
                placeholder="Education"
                value={userDetails?.education}
                onPress={() => {
                  handleModalPress("education");
                }}
                onChangeText={(text: string) => {
                  handleValueUpdate(text, "education");
                }}
              />
            )}
          <TextInput
            inputMode="numeric"
            editable={true}
            style={styles.input}
            placeholderTextColor={styleConstants.color.textGrayColor}
            placeholder="Age"
            value={userDetails?.age}
            onChangeText={(text: string) => {
              handleValueUpdate(text, "age");
            }}
          />

          {(route?.params?.type === ProfileType.matrimony ||
            route?.params?.type === "updatematrimonyprofile") && (
              <>
                <TextInput
                  editable={true}
                  style={styles.input}
                  placeholderTextColor={styleConstants.color.textGrayColor}
                  placeholder="Religion"
                  onPress={() => {
                    handleModalPress("caste");
                  }}
                  value={userDetails?.caste}
                  onChangeText={(text: string) => {
                    handleValueUpdate(text, "caste");
                  }}
                />
                <TextInput
                  inputMode="numeric"
                  editable={true}
                  style={styles.input}
                  placeholderTextColor={styleConstants.color.textGrayColor}
                  placeholder="Salary"
                  value={userDetails?.salary}
                  onChangeText={(text: string) => {
                    handleValueUpdate(text, "salary");
                  }}
                />

                <TextInput
                  maxLength={10}
                  inputMode="numeric"
                  editable={true}
                  style={styles.input}
                  placeholderTextColor={styleConstants.color.textGrayColor}
                  placeholder="Whatsapp number"
                  value={userDetails?.whatsappno}
                  onChangeText={(text: string) => {
                    handleValueUpdate(text, "whatsappno");
                  }}
                />
                <TextInput
                  editable={true}
                  style={styles.input}
                  placeholderTextColor={styleConstants.color.textGrayColor}
                  placeholder="Facebook link"
                  value={userDetails?.fblink}
                  onChangeText={(text: string) => {
                    handleValueUpdate(text, "fblink");
                  }}
                />
              </>
            )}

          <View style={styles.habitContainer}>
            {(route?.params?.type === ProfileType.matrimony ||
              route?.params?.type === "updatematrimonyprofile") && (
                <View style={styles.switchInputContainer}>
                  <TextInput
                    value="Is divorcee"
                    editable={false}
                    style={styles.switchInput}
                  />
                  <Switch
                    onValueChange={() =>
                      setIsDivorcee(isDivorcee === "Yes" ? "No" : "Yes")
                    }
                    value={isDivorcee === "Yes"}
                    trackColor={{ false: "#ccc", true: "#f57c00" }}
                    thumbColor={isDivorcee === "Yes" ? "#f57c00" : "#ccc"}
                  />
                </View>
              )}

            {(route?.params?.type === ProfileType.dating ||
              route?.params?.type === "updatedatingprofile") && (
                <>
                  <View style={styles.switchInputContainer}>
                    <TextInput
                      value="Smoker"
                      editable={false}
                      style={styles.switchInput}
                    />
                    <Switch
                      onValueChange={() =>
                        setSmoking(smoking === "Yes" ? "No" : "Yes")
                      }
                      value={smoking === "Yes"}
                      trackColor={{ false: "#ccc", true: "#f57c00" }}
                      thumbColor={smoking === "Yes" ? "#f57c00" : "#ccc"}
                    />
                  </View>

                  <View style={styles.switchInputContainer}>
                    <TextInput
                      value="Drinker"
                      editable={false}
                      style={styles.switchInput}
                    />
                    <Switch
                      onValueChange={() =>
                        setDrinking(drinking === "Yes" ? "No" : "Yes")
                      }
                      value={drinking === "Yes"}
                      trackColor={{ false: "#ccc", true: "#f57c00" }}
                      thumbColor={drinking === "Yes" ? "#f57c00" : "#ccc"}
                    />
                  </View>
                </>
              )}
          </View>

          <Text style={styles.sectionHeader}>Interest</Text>
          <View style={styles.chipsContainer}>
            {interests?.map((interest, index) => (
              <Chip
                key={index}
                style={[
                  styles.chip,
                  selectedInterests?.includes(interest) && styles.chipSelected,
                ]}
                textStyle={[
                  styles.chipText,
                  selectedInterests?.includes(interest) &&
                  styles.chipTextSelected,
                ]}
                onPress={() =>
                  handleChipToggle(
                    interest,
                    selectedInterests,
                    setSelectedInterests,
                    route
                  )
                }
              >
                <Text style={{ flexWrap: "wrap" }}>{interest} </Text>
              </Chip>
            ))}
          </View>

          <Text style={styles.sectionHeader}>Looking For</Text>
          <View style={styles.chipsContainer}>
            {genderOptions.map((option, index) => (
              <Chip
                key={index}
                style={[
                  styles.chip,
                  selectedGender.includes(option) && styles.chipSelected,
                ]}
                textStyle={[
                  styles.chipText,
                  selectedGender.includes(option) && styles.chipTextSelected,
                ]}
                onPress={() =>
                  handleChipToggle(
                    option,
                    selectedGender,
                    setSelectedGender,
                    route,
                    "single"
                  )
                }
              >
                <Text style={{ flexWrap: "wrap" }}>{option} </Text>
              </Chip>
            ))}
          </View>

          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            style={styles.bioInput}
            placeholderTextColor={styleConstants.color.textGrayColor}
            placeholder="Bio"
          />

          <Button
            mode="contained"
            onPress={async () => {
              // (drinking, "before clicking");
              await handleButtonCLick(
                route,
                userDetails,
                uploadedImages,
                bio,
                isDivorcee,
                selectedGender,
                selectedInterests,
                smoking,
                drinking
              );
            }}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonText}
          >
            {isLoading ? (
              <ActivityIndicator
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                color={styleConstants.color.backgroundWhiteColor}
              />
            ) : route?.params?.type === "updatematrimonyprofile" ||
              route?.params?.type === "updatedatingprofile" ? (
              "Update"
            ) : (
              "Create profile"
            )}
          </Button>
        </ScrollView>
      )}
    </View>
  );
};

export default ProfileCreation;
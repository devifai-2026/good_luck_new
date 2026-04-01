import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { styleConstants } from "../../styles";
import UploadScreen from "./imageUploader";
import useAuthService from "../../hooks/useAuthServices";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateInput from "./datePickercomponent";
import Icon from "react-native-vector-icons/MaterialIcons";
import { formatDate } from "../../redux/utils";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = width * 0.28;
const imageNumber = 1;

const GENDER_OPTIONS = ["Male", "Female", "Others"];

const MyProfileEdit = () => {
  const navigation = useNavigation<any>();
  const userDetails = useSelector((state: RootState) => state.auth.userDetails);
  const { updateProfile, loading } = useAuthService();
  const route = useRoute<any>();

  const isEditProfile = route.name === "myprofileedit";

  const [fullName, setFullName] = useState(
    isEditProfile ? userDetails?.fullName || "" : "",
  );
  const [phoneNumber, setPhoneNumber] = useState(
    isEditProfile ? userDetails?.phoneNumber || "" : "",
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    isEditProfile && userDetails?.dateOfBirth
      ? userDetails.dateOfBirth
      : new Date().toISOString(),
  );
  const [gender, setGender] = useState(
    isEditProfile ? userDetails?.gender : "Other",
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    isEditProfile ? [userDetails?.profilePicture || ""] : [],
  );

  const handleImageRemove = () => setUploadedImages([]);

  const handleSave = async () => {
    const updatedDetails = {
      Fname: fullName?.trim()?.split(" ")[0],
      Lname: fullName?.trim()?.split(" ")[1] ?? "",
      profile_picture: uploadedImages[0],
      phone: phoneNumber,
      date_of_birth: dateOfBirth,
      gender,
    };
    await updateProfile(userDetails?.userID ?? "", updatedDetails);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={22} color={styleConstants.color.textBlackColor} />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Upload */}
        <View style={styles.avatarSection}>
          {uploadedImages.length > 0 && uploadedImages[0] ? (
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: uploadedImages[0] }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeAvatarBtn}
                onPress={handleImageRemove}
                activeOpacity={0.8}
              >
                <Icon name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.avatarUploadBox}>
              <UploadScreen
                imageCount={imageNumber}
                selectedImage={uploadedImages}
                setSelectedImage={setUploadedImages}
              />
            </View>
          )}
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <FieldInput
            label="Full Name"
            icon="person-outline"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            maxLength={100}
          />

          <FieldInput
            label="Phone Number"
            icon="phone-iphone"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter phone number"
            keyboardType="numeric"
            maxLength={10}
          />

          {/* Date of Birth */}
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="event"
              size={20}
              color={styleConstants.color.primaryColor}
              style={styles.inputIcon}
            />
            <View style={styles.dateInputInner}>
              <DateInput
                date={dateOfBirth}
                onChangeText={(date: string) => setDateOfBirth(date)}
              />
            </View>
          </View>

          {/* Gender */}
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.genderChip,
                  gender === opt && styles.genderChipActive,
                ]}
                onPress={() => setGender(opt)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.genderChipText,
                    gender === opt && styles.genderChipTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const FieldInput = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  maxLength?: number;
}) => (
  <>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Icon
        name={icon}
        size={20}
        color={styleConstants.color.primaryColor}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={styleConstants.color.textGrayColor}
        keyboardType={keyboardType || "default"}
        maxLength={maxLength}
      />
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  /* ── Header ── */
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F7F8FA",
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  header: {
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    fontSize: 20,
    fontWeight: "700",
  },

  /* ── Scroll ── */
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  /* ── Avatar ── */
  avatarSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: styleConstants.color.primaryColor,
    backgroundColor: styleConstants.color.deactivatedButtonColor,
  },
  removeAvatarBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#F7F8FA",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarUploadBox: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: styleConstants.color.deactivatedButtonColor,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarHint: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
  },

  /* ── Form ── */
  formSection: {
    backgroundColor: styleConstants.color.backgroundWhiteColor,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ECECEC",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    marginBottom: 18,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    paddingVertical: 12,
  },
  dateInputInner: {
    flex: 1,
  },

  /* ── Gender chips ── */
  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ECECEC",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
  },
  genderChipActive: {
    borderColor: styleConstants.color.primaryColor,
    backgroundColor: "rgba(253,122,91,0.08)",
  },
  genderChipText: {
    fontSize: 13,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textGrayColor,
  },
  genderChipTextActive: {
    color: styleConstants.color.primaryColor,
    fontWeight: "700",
  },

  /* ── Save button ── */
  saveContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#F7F8FA",
  },
  saveButton: {
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: styleConstants.color.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textWhiteColor,
    fontWeight: "700",
  },
});

export default MyProfileEdit;

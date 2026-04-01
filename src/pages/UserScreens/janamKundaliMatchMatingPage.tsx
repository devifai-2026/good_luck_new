import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  RadioButton,
} from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styleConstants } from "../../styles";
import DateInput from "../../components/Shared/datePickercomponent";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import PaymentPage, { PaymentType } from "./paymentPage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import OptionModal from "../../components/Shared/modal";
import { languages, states } from "../../services/constants";
import { postCreateKundali, postCreateMatchMaking } from "../../services";
import { notifyMessage } from "../../hooks/useDivineShopServices";
import HoroscopeAd from "../../components/Shared/astrologyTextPortion";
import { formatDate, formatTime } from "../../redux/utils";

enum Types {
  brideProfile,
  groomProfile,
  ownProfile,
}

const JanamKundaliMatchmakingPage = () => {
  const route = useRoute();
  const [loading, setLoading] = useState(false);

  const [openModal, setopenModal] = useState<boolean>(false);

  const [currentProfileType, setcurrentProfileType] = useState<Types>(
    Types.ownProfile
  );

  const [modalValue, setmodalValue] = useState<string>("");

  const userDetails = useSelector((state: RootState) => state.auth.userDetails);

  const isMatchmaking = route.name === "matchmaking";
  //   const isJanamKundali = route.name === "janamkundali";

  const [brideDetails, setBrideDetails] = useState({
    fullName: "",
    dateOfBirth: new Date().toISOString(),
    timeOfBirth: new Date().toISOString(),
    birthplace: "",
    gender: "Female",
  });

  const [groomDetails, setGroomDetails] = useState({
    fullName: "",
    dateOfBirth: new Date().toISOString(),
    timeOfBirth: new Date().toISOString(),
    birthplace: "",
    gender: "Male",
  });

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");

  const [selectedLanguage, setselectedLanguage] = useState("Bengali");

  const navigation = useNavigation<any>();

  const handleSave = async (id: string) => {
    setLoading(true);

    try {
      // Validate required fields
      if (!whatsappNumber || !selectedLanguage) {
        notifyMessage("Please fill in all the required fields.");
        return;
      }

      const commonData = {
        wp_no: whatsappNumber,
        email,
        language: selectedLanguage,
        isPaymentDone: id?.length > 0,
      };

      // Validate matchmaking fields
      if (isMatchmaking) {
        if (
          !groomDetails?.fullName ||
          !groomDetails?.dateOfBirth ||
          !groomDetails?.birthplace
        ) {
          notifyMessage(
            "Groom details are incomplete. Please fill in all required fields."
          );
          return;
        }
        if (
          !brideDetails?.fullName ||
          !brideDetails?.dateOfBirth ||
          !brideDetails?.birthplace
        ) {
          notifyMessage(
            "Bride details are incomplete. Please fill in all required fields."
          );
          return;
        }

        const data = {
          ...commonData,
          boy: {
            name: groomDetails?.fullName,
            dob: formatDate(groomDetails?.dateOfBirth),
            birthplace: groomDetails?.birthplace,
            timeOfBirth: formatTime(groomDetails?.timeOfBirth),
          },
          girl: {
            name: brideDetails?.fullName || "",
            dob: formatDate(brideDetails?.dateOfBirth),
            birthplace: brideDetails?.birthplace || "",
            timeOfBirth: formatTime(brideDetails?.timeOfBirth),
          },
        };

        // Simulate saving data (replace with actual API call)
        const response = await postCreateMatchMaking(
          userDetails?.userID ?? "",
          data
        );
        notifyMessage(response?.data?.message);
        // console.log("Saved Data:", JSON.stringify(data, null, 2));
      } else {
        // Validate groom details for non-matchmaking case
        if (
          !groomDetails?.fullName ||
          !groomDetails?.dateOfBirth ||
          !groomDetails?.birthplace
        ) {
          notifyMessage(
            "Details are incomplete. Please fill in all required fields."
          );
          navigation.goBack();
          return;
        }

        const data = {
          ...commonData,
          name: groomDetails?.fullName,
          date: formatDate(groomDetails?.dateOfBirth),
          place: groomDetails?.birthplace,
          time: formatTime(groomDetails?.timeOfBirth),
          gender: groomDetails?.gender === "Male" ? "boy" : "girl",
        };

        // Simulate saving data (replace with actual API call)
        const response = await postCreateKundali(
          userDetails?.userID ?? "",
          data
        );
        notifyMessage(response?.data?.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notifyMessage("There was an error while saving the data.");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (
    details: any,
    setDetails: any,
    label: any,
    type: Types
  ) => (
    <View style={{}}>
      <Text style={styles.sectionHeader}>{label}</Text>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={details.fullName}
        onChangeText={(text) =>
          type == Types.brideProfile
            ? setBrideDetails((prev: any) => ({ ...prev, fullName: text }))
            : setGroomDetails((prev: any) => ({ ...prev, fullName: text }))
        }
        placeholder="Enter full name"
        placeholderTextColor={styleConstants.color.textGrayColor}
        maxLength={100}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <DateInput
        date={details.dateOfBirth}
        onChangeText={(text) =>
          type == Types.brideProfile
            ? setBrideDetails((prev: any) => ({ ...prev, dateOfBirth: text }))
            : setGroomDetails((prev: any) => ({ ...prev, dateOfBirth: text }))
        }
      />

      <Text style={styles.label}>Time of Birth</Text>
      <DateInput
        isTime
        date={details.timeOfBirth}
        onChangeText={(text) =>
          type == Types.brideProfile
            ? setBrideDetails((prev: any) => ({ ...prev, timeOfBirth: text }))
            : setGroomDetails((prev: any) => ({ ...prev, timeOfBirth: text }))
        }
      />

      <Text style={styles.label}>Birth Place</Text>
      <TextInput
        style={styles.input}
        onPress={() => {
          setopenModal(true);
          setcurrentProfileType(type);
        }}
        value={details.birthplace}
        placeholder="Enter birthplace"
        placeholderTextColor={styleConstants.color.textGrayColor}
      />
      {!isMatchmaking && (
        <>
          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group
            onValueChange={(value) =>
              setGroomDetails((prev: any) => ({ ...prev, gender: value }))
            }
            value={details.gender}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioOption}>
                <RadioButton
                  value="Male"
                  color={styleConstants.color.primaryColor}
                />
                <Text style={styles.radioLabel}>Male</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton
                  value="Female"
                  color={styleConstants.color.primaryColor}
                />
                <Text style={styles.radioLabel}>Female</Text>
              </View>
            </View>
          </RadioButton.Group>
        </>
      )}
    </View>
  );

  const handleValueUpdate = (text: string, type: string) => {
    currentProfileType === Types.brideProfile
      ? setBrideDetails((prev: any) => ({
          ...prev,
          birthplace: text,
        }))
      : setGroomDetails((prev: any) => ({
          ...prev,
          birthplace: text,
        }));
  };

  return (
    <HomeScreenLayout>
      {openModal ? (
        <OptionModal
          visible={openModal}
          setVisible={setopenModal}
          options={states}
          onSelect={handleValueUpdate}
          type={"state"}
          selectedOption={modalValue}
          setSelectedOption={setmodalValue}
        />
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.header}>
            {isMatchmaking ? "Matchmaking Details" : "Janam Kundali Details"}
          </Text>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {isMatchmaking &&
              renderForm(
                brideDetails,
                setBrideDetails,
                "Bride Details",
                Types.brideProfile
              )}
            {isMatchmaking &&
              renderForm(
                groomDetails,
                setGroomDetails,
                "Groom Details",
                Types.groomProfile
              )}
            {!isMatchmaking &&
              renderForm(
                groomDetails,
                setBrideDetails,
                "Your Details",
                Types.ownProfile
              )}

            <Text style={styles.label}>WhatsApp Number</Text>
            <TextInput
              style={styles.input}
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              placeholder="Enter WhatsApp number"
              keyboardType="numeric"
              placeholderTextColor={styleConstants.color.textGrayColor}
              maxLength={10}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              placeholderTextColor={styleConstants.color.textGrayColor}
              maxLength={100}
            />
            <View style={styles.chipsContainer}>
              {languages.map((lang) => (
                <Chip
                  icon={undefined}
                  key={lang}
                  selected={selectedLanguage === lang}
                  onPress={() =>
                    setselectedLanguage((prev) => (prev === lang ? "" : lang))
                  }
                  style={[
                    styles.chip,
                    selectedLanguage === lang && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={
                      selectedLanguage === lang
                        ? styles.chipTextSelected
                        : styles.chipText
                    }
                  >
                    {lang}
                  </Text>
                </Chip>
              ))}
            </View>
            <HoroscopeAd isMatchmaking={isMatchmaking} />

            <PaymentPage
              paymentType={PaymentType.independent}
              mobileNumber={userDetails?.phoneNumber ?? ""}
              amount={isMatchmaking ? 49 : 99}
              callback={handleSave}
              buttonState={loading}
            />
            {/* <Button
            mode="contained"
            style={styles.saveButton}
            onPress={handleSave}
            textColor="white"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size={"small"}
                color={styleConstants.color.textWhiteColor}
              />
            ) : (
              <Text style={{ fontFamily: styleConstants.fontFamily }}>
                {"Save"}
              </Text>
            )}
          </Button> */}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </HomeScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.color.backgroundWhiteColor,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  header: {
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    fontSize: 25,
    margin: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: styleConstants.fontFamily,
    marginTop: 20,
    marginBottom: 10,
    color: styleConstants.color.primaryColor,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginBottom: 8,
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
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    color: styleConstants.color.textBlackColor,
    fontFamily: styleConstants.fontFamily,
  },
  saveButton: {
    marginTop: 15,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 25,
    alignSelf: "center",

    width: "50%",
    height: 50,
    justifyContent: "center",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    backgroundColor: styleConstants.color.transparent,
  },
  chipSelected: {
    backgroundColor: styleConstants.color.primaryColor,
  },
  chipText: {
    color: styleConstants.color.primaryColor,
    fontFamily: styleConstants.fontFamily,
    textTransform: "capitalize",
  },
  chipTextSelected: {
    color: styleConstants.color.textWhiteColor,
    fontFamily: styleConstants.fontFamily,
  },
});

export default JanamKundaliMatchmakingPage;

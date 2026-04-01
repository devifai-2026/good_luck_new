import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { styleConstants } from "../../styles";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import { useNavigation } from "@react-navigation/native";
import DateInput from "../../components/Shared/datePickercomponent";
import Icon from "react-native-vector-icons/MaterialIcons";
import usePanchang from "../../hooks/usePanchang";
import { ActivityIndicator } from "react-native-paper";
import NoDataComponent from "../../components/User/noDataComponent";
import ImageModal from "../../components/Shared/scrollableImageViewer";

const Panchang: React.FC = () => {
  const menuItems = [
    {
      id: "1",
      title: "Calendar",
      icon: require("../../assets/calender.png"),
      route: "calender",
    },
    {
      id: "2",
      title: "Rashifal",
      icon: require("../../assets/rashifol.png"),
      route: "rasifal",
    },
    {
      id: "3",
      title: "Bibaho Date",
      icon: require("../../assets/bibahoDate.png"),
      route: "bibahodate",
    },

    {
      id: "4",
      title: "Pujo Date",
      icon: require("../../assets/panchangLogo.png"),
      route: "pujodate",
    },

    {
      id: "5",
      title: "Omabossya",
      icon: require("../../assets/omabosya.png"),
      route: "omabossya",
    },
    {
      id: "6",
      title: "Purnima",
      icon: require("../../assets/purnima.png"),
      route: "purnima",
    },
    {
      id: "7",
      title: "Ekadosi",
      icon: require("../../assets/ekadoshi.png"),
      route: "ekadosi",
    },
    {
      id: "8",
      title: "Suvo Din",
      icon: require("../../assets/subhoDin.png"),
      route: "suvodin",
    },
    {
      id: "9",
      title: "Sastro Kotha",
      icon: require("../../assets/shastroKotha.png"),
      route: "sastrokotha",
    },
  ];

  const {
    panchang,
    getDateWisePanchang,
    getCompleteCalender,
    loading,
    panchangImages,
    getDateWiseRashifal,
    getCalenderEventsBYType,
  } = usePanchang();

  const [date, setDate] = useState<string>(new Date().toISOString());

  const [currentIndex, setcurrentIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showPanchangModal, setShowPanchangModal] = useState(false);
  const navigation = useNavigation<any>();

  const handleDateChange = (selectedDate?: string) => {
    console.log(selectedDate);

    if (selectedDate) {
      const formttedDate = selectedDate?.split("T")[0];
      getDateWisePanchang(formttedDate);
      setDate(selectedDate);
    }
  };

  const handleClick = (type: string) => {
    console.log(type);
    setShowModal(true);
    if (type === "rasifal") {
      setcurrentIndex(0);
      getDateWiseRashifal(new Date().toISOString()?.split("T")[0]);
    } else if (type === "calender") {
      setcurrentIndex(new Date().getMonth());
      getCompleteCalender();
    } else {
      getCalenderEventsBYType(type);
    }
  };

  useEffect(() => {
    const formttedDate = date?.split("T")[0];
    console.log(date);
    getDateWisePanchang(formttedDate);
  }, []);

  return (
    <HomeScreenLayout>
      {showModal ? (
        <ImageModal
          visible={showModal}
          onClose={setShowModal}
          images={panchangImages}
          currentIndex={currentIndex}
          loading={loading}
          setCurrentIndex={setcurrentIndex}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Icon
              onPress={() => {
                navigation.goBack();
              }}
              name="arrow-back"
              size={24}
              color="black"
              style={{ zIndex: 10000000 }}
            />
            <Text style={styles.title}>Panchang</Text>
          </View>

          {/* Date Input Field */}
          <View style={styles.dateInputContainer}>
            <DateInput date={date} onChangeText={handleDateChange} />
          </View>

          {/* Panchang Image Card */}
          {loading ? (
            <View style={styles.panchangCard}>
              <ActivityIndicator
                size="large"
                color={styleConstants.color.primaryColor}
              />
            </View>
          ) : panchang?.image ? (
            <TouchableOpacity
              style={styles.panchangCard}
              onPress={() => setShowPanchangModal(true)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: panchang.image }}
                style={styles.panchangThumbnail}
              />
              <View style={styles.viewOverlay}>
                <Icon name="fullscreen" size={16} color="#fff" />
                <Text style={styles.viewOverlayText}>Tap to view full Panchang</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.panchangCard}>
              <NoDataComponent message="Panchang for this date not found" />
            </View>
          )}

          {/* Full-screen Panchang Modal */}
          <Modal
            visible={showPanchangModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPanchangModal(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowPanchangModal(false)}
              >
                <Icon name="close" size={26} color="#fff" />
              </TouchableOpacity>
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Image
                  source={{ uri: panchang?.image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </ScrollView>
            </View>
          </Modal>

          {/* Scrollable Menu */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleClick(item?.route)}
                >
                  <Image
                    style={styles.icon}
                    source={item.icon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={styles.itemText}>{item.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </HomeScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 16,
  },
  dateInputContainer: {
    marginBottom: 12,
  },
  panchangCard: {
    width: "100%",
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  panchangThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  viewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.48)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    gap: 6,
  },
  viewOverlayText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: styleConstants.fontFamily,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.93)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseBtn: {
    position: "absolute",
    top: 48,
    right: 16,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 6,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 12,
  },
  modalImage: {
    width: Dimensions.get("window").width - 24,
    height: Dimensions.get("window").height * 0.78,
  },

  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 8,
  },
  menuItem: {
    width: "23%", // ~4 per row with space between
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemContainer: {
    width: "100%",
    aspectRatio: 1, // keeps icon button square
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",

    // shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  itemText: {
    fontSize: 10,
    color: styleConstants.color.textBlackColor,
    textAlign: "center",
    fontFamily: styleConstants.fontFamily,
    marginTop: 2,
  },
});

export default Panchang;

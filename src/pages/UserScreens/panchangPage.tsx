import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
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

  const { width: screenWidth } = Dimensions.get("window");
  const menuItemWidth = screenWidth * 0.22;
  const menuRowHeight = menuItemWidth + 20;
  const menuScrollHeight = menuRowHeight * 2 + menuRowHeight * 0.35;

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
        <View style={styles.mainContainer}>
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

          {/* Panchang Image - fills available space, swipe to change date */}
          <View style={styles.imageContainer}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={styleConstants.color.primaryColor}
              />
            ) : panchang?.image ? (
              <Image
                source={{ uri: panchang.image }}
                style={styles.panchangImage}
                resizeMode="contain"
              />
            ) : (
              <NoDataComponent message="Panchang for this date not found" />
            )}
          </View>

          {/* Menu Items - first 8 visible, 9th scrollable */}
          <ScrollView
            style={[styles.menuScrollContainer, { maxHeight: menuScrollHeight }]}
            showsVerticalScrollIndicator={false}
            bounces={false}
            nestedScrollEnabled
          >
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
        </View>
      )}
    </HomeScreenLayout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    marginLeft: 16,
  },
  dateInputContainer: {
    marginBottom: 8,
  },
  imageContainer: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  panchangImage: {
    width: "100%",
    height: "100%",
  },
  menuScrollContainer: {
    flexGrow: 0,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  menuItem: {
    width: "23%",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
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

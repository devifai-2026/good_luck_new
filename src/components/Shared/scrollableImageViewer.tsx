import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { ActivityIndicator, Button, Provider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import CloudImage from "./lazyLoadingImage";
import NoDataComponent from "../User/noDataComponent";
import { styleConstants } from "../../styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
console.log(width);

interface ImageModalProps {
  visible: boolean;
  onClose: any;
  images: string[];
  currentIndex: number;
  loading: boolean;
  setCurrentIndex: any;
}

const ImageModal: React.FC<ImageModalProps> = ({
  visible,
  onClose,
  images,
  currentIndex,
  loading,
  setCurrentIndex,
}) => {
  // const [activeIndex, setActiveIndex] = useState(currentIndex);
  const flatListRef = useRef<FlatList<any>>(null);

  console.log(currentIndex);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  return (
    <Provider>
      <Modal transparent visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose(false);
            }}
          >
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>

          {/* Image List */}

          {loading ? (
            <ActivityIndicator
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "70%",
              }}
              size={"large"}
              color={styleConstants.color.primaryColor}
            />
          ) : images?.length === 0 ? (
            <NoDataComponent message="No data avilable" />
          ) : (
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              // getItemLayout={(data, index) => ({
              //   length: data?.length ?? 0, // Fixed height of each item
              //   offset: data?.length ?? 0 * index, // Position of item
              //   index,
              // })}

              initialScrollIndex={0}
              onMomentumScrollEnd={(event) => {
                const index = Math.floor(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentIndex(index);
              }}
              renderItem={({ item }) => (
                <CloudImage
                  imageUrl={item}
                  imageStyle={styles.image}
                  containerStyle={styles.imageWrapper}
                  loaderSize="large"
                  // zoomEnabled
                />
              )}
            />
          )}

          {/* Navigation Buttons */}
          {setCurrentIndex > 0 && (
            <TouchableOpacity style={styles.leftButton} onPress={handlePrev}>
              <Icon name="arrow-back-ios" size={24} color="white" />
            </TouchableOpacity>
          )}

          {setCurrentIndex < images.length - 1 && (
            <TouchableOpacity style={styles.rightButton} onPress={handleNext}>
              <Icon name="arrow-forward-ios" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20000,
    backgroundColor: styleConstants.color.primaryColor, // primary color background
    padding: 10, // padding around the icon
    borderRadius: 20, // round background
  },
  imageWrapper: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width - 45, // Full-screen width
    height: height - 20, // Full-screen height
    resizeMode: "contain", // Keep aspect ratio
  },
  leftButton: {
    position: "absolute",
    left: 20,
    top: "50%",
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  rightButton: {
    position: "absolute",
    right: 20,
    top: "50%",
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
});

export default ImageModal;

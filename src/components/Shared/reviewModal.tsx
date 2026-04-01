import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Provider,
} from "react-native-paper";
import { styleConstants } from "../../styles";
import useAstrologyServices from "../../hooks/useAstrologyServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

const ReviewModal = (props: {
  visible: boolean;
  onClose: any;
  //   onSubmit: any;
}) => {
  const astrologerId = useSelector(
    (state: RootState) => state.auth?.currentAstrologerDetails?.id
  );

  const { visible, onClose } = props;
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const { giveRatingAndReview, loading } = useAstrologyServices();

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <IconButton
          icon={index < rating ? "star" : "star-outline"}
          size={30}
          iconColor="gold"
        />
      </TouchableOpacity>
    ));
  };

  const successCallBack = () => {
    setReview("");
    setRating(0);
    onClose(false);
  };

  const submitReview = async () => {
    await giveRatingAndReview(
      { rating, comment: review },
      astrologerId ?? "",
      successCallBack
    );
  };

  return (
    <Provider>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={() => {
          onClose(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                onClose(false);
              }}
            >
              <IconButton icon="close" size={24} iconColor="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Rate your experience</Text>
            <View style={styles.starsContainer}>{renderStars()}</View>
            <TextInput
              style={styles.textInput}
              placeholder="Write your review here..."
              placeholderTextColor="#aaa"
              multiline
              value={review}
              onChangeText={setReview}
            />
            <Button
              mode="contained"
              onPress={submitReview}
              style={styles.submitButton}
              labelStyle={{
                color: "white",
                fontFamily: styleConstants.fontFamily,
                fontSize: 16,
              }}
              disabled={loading || rating === 0 || review.length === 0}
            >
              {loading ? (
                <ActivityIndicator
                  size={"small"}
                  color={styleConstants.color.backgroundWhiteColor}
                />
              ) : (
                "Submit"
              )}
            </Button>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "relative",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 20,
    color: styleConstants.color.textBlackColor,
    marginBottom: 20,
    fontFamily: styleConstants.fontFamily,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
  },
  submitButton: {
    width: "100%",
    borderRadius: 30,
    backgroundColor: styleConstants.color.primaryColor,

    marginBottom: 20,
  },
});

export default ReviewModal;

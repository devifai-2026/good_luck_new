import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { styleConstants } from "../../styles/constants";
import { Provider } from "react-native-paper";
import { useAdvertisementService } from "../../hooks/useAdvertisementService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import useAuthService from "../../hooks/useAuthServices";

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  type?: "addelete" | "accountdelete";
  //   onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onClose,
  type = "addelete",
  //   onConfirm,

  //   onConfirm,
}) => {
  const { deletePost } = useAdvertisementService();
  const { handleDeleteAccount } = useAuthService();
  const addetails = useSelector(
    (state: RootState) => state.auth.currentAdDetails
  );

  const userId = useSelector(
    (state: RootState) => state.auth.userDetails?.userID
  );

  const deleteAdPost = async () => {
    if (type === "addelete") {
      try {
        await deletePost(
          addetails?.category,
          addetails?.type,

          addetails?.id ?? "",
          onClose
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await handleDeleteAccount(userId ?? "", onClose);
      } catch (error) {
        console.error(error);
      }
    }
  };
  // console.log(addetails);
  return (
    <Provider>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {`Are you sure you want to delete ${
                type === "addelete" ? "this ad" : "your account"
              } ? `}
            </Text>
            <Text style={styles.modalTitle}></Text>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.noButton} onPress={onClose}>
                <Text style={styles.buttonText}>No</Text>
              </Pressable>

              <Pressable style={styles.yesButton} onPress={deleteAdPost}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  modalBackground: {
    zIndex: 1000000,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: "#333",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  noButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
  yesButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: styleConstants.fontFamily,
  },
});

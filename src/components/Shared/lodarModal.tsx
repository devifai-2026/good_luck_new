import React from "react";
import { Modal, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { updateAstrologyChatDetails } from "../../redux/silces/auth.silce";
import { ChatStatus } from "../Chat/astrologyChatUI";

import { styleConstants, lodarModalStyle as styles } from "../../styles";

interface LoaderModalProps {
  visible: boolean; // Controls the visibility of the modal
  text: string; // Text to display inside the modal
}

const LoaderModal: React.FC<LoaderModalProps> = ({ visible, text }) => {
  const dispstch = useDispatch();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        // Optional: handle close event if needed
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Button
            onPress={() => {
              dispstch(
                updateAstrologyChatDetails({ chatStatus: ChatStatus.idle })
              );
            }}
          >
            <Text style={{ fontFamily: styleConstants.fontFamily }}>Close</Text>
          </Button>
          <ActivityIndicator
            size="large"
            color={styleConstants.color.primaryColor}
          />
          <Text style={styles.modalText}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoaderModal;

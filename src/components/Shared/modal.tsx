import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {
  Modal,
  Portal,
  Text,
  Button,
  Provider,
  RadioButton,
} from "react-native-paper";

import { Dimensions } from "react-native";
import { styleConstants } from "../../styles/constants";

import { modalStyles as styles } from "../../styles";

interface OptionModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  options: string[];
  onSelect: (option: string, type: string) => void;
  type: "state" | "city" | "caste" | "education";
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}

const OptionModal: React.FC<OptionModalProps> = ({
  visible,
  setVisible,
  options,
  onSelect,
  type,
}) => {
  const { width, height } = Dimensions.get("window");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hideModal = () => setVisible(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option, type);
    hideModal();
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.optionContainer}
              >
                <RadioButton
                  value={item}
                  status={selectedOption === item ? "checked" : "unchecked"}
                  color={styleConstants.color.primaryColor}
                  onPress={() => handleSelect(item)}
                />
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </Modal>
      </Portal>
    </Provider>
  );
};

export default OptionModal;

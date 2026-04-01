import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import { styleConstants } from "../../styles";
import { formatDate, formatTime } from "../../redux/utils";
import Icon from "react-native-vector-icons/MaterialIcons"; // Ensure to install and link this package

const DateInput = (props: {
  isTime?: boolean;
  date?: string; // Optional date
  onChangeText: (date: string) => void;
}) => {
  const { date = new Date().toISOString(), onChangeText, isTime } = props;
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const isValidDate = (value: string) =>
    value && !isNaN(new Date(value).getTime());

  const parsedDate = isValidDate(date) ? new Date(date) : new Date();

  // console.log(date, isTime ? formatTime(date) : formatDate(date));

  useEffect(() => {
    console.log(date);
  }, [date]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.inputTouchable}
          onPress={() => setIsPickerOpen(true)} // Open picker for both date and time
        >
          <TextInput
            style={styles.input}
            value={
              isTime
                ? new Date(date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : formatDate(date)
            }
            placeholder={isTime ? "Select Time" : "Select Date"}
            placeholderTextColor={styleConstants.color.textGrayColor}
            editable={false} // Prevent keyboard input
          />
        </TouchableOpacity>
      </View>
      <DatePicker
        minimumDate={new Date(1900, 0, 1)} // Jan 1, 1900
        // maximumDate={new Date()} // Current date
        modal
        open={isPickerOpen}
        date={parsedDate} // Valid date
        mode={isTime ? "time" : "date"}
        onConfirm={(selectedDate) => {
          console.log(selectedDate, "Selected Date/Time");
          setIsPickerOpen(false);
          onChangeText(selectedDate.toISOString()); // Update selected date/time
        }}
        onCancel={() => setIsPickerOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIconContainer: {
    marginRight: 8,
  },
  inputTouchable: {
    flex: 1,
    height: 50,
  },
  input: {
    fontSize: 14,
    fontFamily: styleConstants.fontFamily,
    color: styleConstants.color.textBlackColor,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    borderRadius: 8,
    padding: 10,
    flex: 1,
    height: 40, // Explicitly set the height
    lineHeight: 24, // Add line height for consistent text rendering
    textAlignVertical: "center", // Center text vertically
  },
});

export default DateInput;

import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Chip, IconButton } from "react-native-paper";
import { styleConstants } from "../../styles/constants";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../../redux/silces/auth.silce";
import { RootState } from "../../redux";
import { states } from "../../services/constants";
import { ChipValue } from "../../redux/redux.constants";
import useLocalServices from "../../hooks/useLocalServices";

const filterOptions = ["address", "city", "state", "pinCode"];

export default function SearchWithFilter() {
  const searchText = useSelector(
    (state: RootState) => state.auth.userDetails?.searchText
  );
  const selectedFilter = useSelector(
    (state: RootState) => state.auth.userDetails?.selectedChipValue
  );
  const { filterLocalServices } = useLocalServices();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {/* Search Input + Icon */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder={`Search by ${selectedFilter}`}
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text: string) => {
            dispatch(updateUserData({ searchText: text }));
          }}
        />
        <IconButton
          icon="magnify"
          size={26}
          iconColor="#fff"
          style={styles.searchIcon}
          onPress={() => {
            console.log("Searching...");
            filterLocalServices();
          }}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsContainer}>
        {filterOptions.map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <Chip
              key={filter}
              onPress={() =>
                dispatch(
                  updateUserData({ selectedChipValue: filter as ChipValue })
                )
              }
              style={[styles.chip, isSelected && styles.chipSelected]}
              textStyle={isSelected ? styles.chipTextSelected : styles.chipText}
            >
              {filter}
            </Chip>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    width: "85%",
    height: 46,
    fontSize: 15,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 8,
    backgroundColor: styleConstants.color.primaryColor,
    borderRadius: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // ✅ adds even spacing between chips (RN 0.71+)
  },
  chip: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: styleConstants.color.primaryColor,
    backgroundColor: "transparent",
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
    textTransform: "capitalize",
  },
});

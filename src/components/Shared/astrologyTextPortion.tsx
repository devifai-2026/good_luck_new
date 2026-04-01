import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { styleConstants } from "../../styles";

const HoroscopeAd = (props: { isMatchmaking: boolean }) => {
  const { isMatchmaking } = props;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {isMatchmaking
          ? "💞 Get Your Detailed 30+ Page Matchmaking Report for Just ₹ 49/- 💞"
          : "✨ Get Your Comprehensive 150+ Page Horoscope for Just ₹ 99/-✨"}
      </Text>

      {isMatchmaking ? (
        <>
          <View style={styles.section}>
            <Text style={styles.subHeader}>Your report will cover:</Text>
            <Text style={styles.listItem}>💍 Marriage compatibility</Text>
            <Text style={styles.listItem}>❤️ Guna Milan with points</Text>
            <Text style={styles.listItem}>🪔 Remedies for mismatches</Text>
            <Text style={styles.listItem}>📅 Auspicious marriage dates</Text>
            <Text style={styles.listItem}>👪 Family compatibility</Text>
          </View>
          <Text style={styles.footer}>
            📩 Receive your personalized Matchmaking PDF via WhatsApp within 24
            hours!
          </Text>
        </>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.subHeader}>Discover deep insights into:</Text>
            <Text style={styles.listItem}>💍 Marriage</Text>
            <Text style={styles.listItem}>💼 Career</Text>
            <Text style={styles.listItem}>💰 Finances</Text>
            <Text style={styles.listItem}>🏥 Health</Text>
            <Text style={styles.listItem}>👶 Children</Text>
            <Text style={styles.listItem}>🏡 Property</Text>
            <Text style={styles.listItem}>👪 Family</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subHeader}>Plus, gain access to:</Text>
            <Text style={styles.listItem}>🕑 Auspicious timings</Text>
            <Text style={styles.listItem}>📜 Dashaphal report</Text>
            <Text style={styles.listItem}>🪔 Remedies for:</Text>
            <Text style={styles.subItem}>- Sade Sati</Text>
            <Text style={styles.subItem}>- Kal Sarpa</Text>
            <Text style={styles.subItem}>- Manglik</Text>
            <Text style={styles.subItem}>- Other planetary issues</Text>
          </View>

          <Text style={styles.footer}>
            📩 Receive your personalized Horoscope PDF via WhatsApp within 24
            hours!
          </Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontFamily: styleConstants.fontFamily,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  subHeader: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  listItem: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  subItem: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 14,
    color: "#777",
    marginLeft: 16,
    marginBottom: 2,
  },
  footer: {
    fontFamily: styleConstants.fontFamily,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "center",
    width: "60%",
  },
});

export default HoroscopeAd;

// Message.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { styleConstants } from "../../styles/constants";
import { ChatType } from "./astrologyChatUI";

type MessageProps = {
  message: string;
  isOwnMessage: boolean;
  timestamp: number | string;
  type?: ChatType;
  isRead?: boolean;
};

const formatTimestamp = (ts: number | string): string => {
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "";
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

const ReadTicks: React.FC<{ isRead: boolean }> = ({ isRead }) => (
  <Text style={[styles.ticks, isRead ? styles.ticksRead : styles.ticksDelivered]}>
    {isRead ? "✓✓" : "✓"}
  </Text>
);

const Message: React.FC<MessageProps> = ({
  message,
  isOwnMessage,
  timestamp,
  type,
  isRead,
}) => {
  const isImage = type === ChatType.image;

  return (
    <View
      style={[
        styles.messageWrapper,
        isOwnMessage ? styles.ownWrapper : styles.friendWrapper,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.friendBubble,
          isImage && styles.imageBubble,
        ]}
      >
        {isImage ? (
          <>
            <Image
              source={{ uri: message }}
              style={styles.messageImage}
              resizeMode="cover"
            />
            <View style={styles.metaRow}>
              <Text style={styles.timestampOnImage}>
                {formatTimestamp(timestamp)}
              </Text>
              {isOwnMessage && <ReadTicks isRead={!!isRead} />}
            </View>
          </>
        ) : (
          <>
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownText : styles.friendText,
              ]}
            >
              {message}
            </Text>
            <View style={styles.metaRow}>
              <Text
                style={[
                  styles.timestamp,
                  isOwnMessage ? styles.ownTimestamp : styles.friendTimestamp,
                ]}
              >
                {formatTimestamp(timestamp)}
              </Text>
              {isOwnMessage && <ReadTicks isRead={!!isRead} />}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    marginVertical: 2,
    paddingHorizontal: 8,
  },
  ownWrapper: {
    alignItems: "flex-end",
  },
  friendWrapper: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  ownBubble: {
    backgroundColor: "#DCF8C6",
    borderTopRightRadius: 0,
  },
  friendBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 0,
  },
  imageBubble: {
    padding: 4,
    backgroundColor: "transparent",
  },
  messageText: {
    fontSize: 15,
    fontFamily: styleConstants.fontFamily,
    lineHeight: 20,
  },
  ownText: {
    color: "#111",
  },
  friendText: {
    color: "#111",
  },
  messageImage: {
    width: 220,
    height: 220,
    borderRadius: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
    gap: 3,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: styleConstants.fontFamily,
  },
  ownTimestamp: {
    color: "#777",
  },
  friendTimestamp: {
    color: "#999",
  },
  timestampOnImage: {
    fontSize: 11,
    color: "#fff",
    fontFamily: styleConstants.fontFamily,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ticks: {
    fontSize: 12,
    fontWeight: "bold",
  },
  ticksDelivered: {
    color: "#aaa",
  },
  ticksRead: {
    color: "#4FC3F7",
  },
});

export default Message;

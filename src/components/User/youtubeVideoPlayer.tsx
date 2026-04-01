import React from "react";
import { StyleSheet, View } from "react-native";
// import { WebView } from "react-native-webview";

type YouTubePlayerProps = {
  youtubeLink: string;
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ youtubeLink }) => {
  // Extract the video ID from the YouTube URL
  const extractVideoId = (url: string): string | null => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(youtubeLink);

  if (!videoId) {
    console.error("Invalid YouTube link");
    return null;
  }

  return (
    <View style={styles.container}>
      {/* <WebView
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        source={{ uri: `https://www.youtube.com/embed/${videoId}?autoplay=1` }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  webview: {
    width: "100%",
    height: 250,
  },
});

export default YouTubePlayer;

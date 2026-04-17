import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import HomeScreenLayout from "../../components/Layouts/homeLayOut";
import YoutubePlayer from "react-native-youtube-iframe";
import usePanchang from "../../hooks/usePanchang";
import { ActivityIndicator } from "react-native-paper";
import { styleConstants } from "../../styles";

const YouTubeVideoPlayer = () => {
  const playerRef = useRef<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { liveTV, getLiveTvAll, loading } = usePanchang();

  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:watch\?.*?v=|embed\/|v\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const { height, width } = Dimensions.get("window");

  const onError = (error: string) => {
    console.warn("YouTube Player Error: ", error);
  };

  const onFullScreenChange = (fullscreen: boolean) => {
    setIsFullScreen(fullscreen);
  };

  useEffect(() => {
    getLiveTvAll();
  }, []);

  return (
    <HomeScreenLayout>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size={"large"}
            color={styleConstants.color.primaryColor}
          />
        ) : (
          <ScrollView
            contentContainerStyle={
              isFullScreen ? styles.fullscreenContainer : styles.videoContainer
            }
            // scrollEnabled={!isFullScreen} // Disable scrolling in fullscreen mode
          >
            {liveTV?.map((tv: any, index) => (
              <View key={index} style={styles.videoWrapper}>
                <YoutubePlayer
                  ref={playerRef}
                  height={isFullScreen ? height : 200} // Adjust height dynamically
                  width={isFullScreen ? width : 350} // Adjust width dynamically
                  // play={true}
                  videoId={extractVideoId(tv?.youtubeLink) ?? ""}
                  onError={onError}
                  onFullScreenChange={onFullScreenChange} // Corrected fullscreen handling
                />
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </HomeScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  videoContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    alignItems: "center",
    margin: 10,
    borderRadius: 25,
  },
});

export default YouTubeVideoPlayer;

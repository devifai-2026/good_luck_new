import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { styleConstants } from "../../styles/constants";

import { lazyLoadingImageStyle as styles } from "../../styles";

export interface ICloudImage {
  imageUrl: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  loaderSize?: "small" | "large";
  type?: "BACKGROUND" | "IMAGE";
  children?: React.ReactNode;
  imageContainerStyle?: StyleProp<ViewStyle>;
}

const CloudImage: React.FC<ICloudImage> = ({
  imageUrl,
  containerStyle,
  imageStyle,
  loaderSize = "large",
  type = "IMAGE",
  children,
  imageContainerStyle,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };
  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [imageUrl]);

  const renderContent = () => {
    if (type === "BACKGROUND" && children) {
      return (
        <ImageBackground
          source={{
            uri: error
              ? "https://imgs.search.brave.com/sTDAQJzMKGCgtiSy3FBFSDIcBYKPxebdMCmwNRvPQc4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzM3LzYyLzc3/LzM2MF9GXzQzNzYy/NzcxOV9scDJPMW93/T2xTWkswbUFrYlFi/VmF0Q2FDd0dqWnVy/QS5qcGc"
              : imageUrl,
          }}
          style={[styles.imageBackground, imageContainerStyle]}
          imageStyle={imageStyle}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
        >
          {children}
        </ImageBackground>
      );
    }

    return (
      <Image
        source={{
          uri: error
            ? "https://imgs.search.brave.com/sTDAQJzMKGCgtiSy3FBFSDIcBYKPxebdMCmwNRvPQc4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzM3LzYyLzc3/LzM2MF9GXzQzNzYy/NzcxOV9scDJPMW93/T2xTWkswbUFrYlFi/VmF0Q2FDd0dqWnVy/QS5qcGc"
            : imageUrl,
        }}
        style={[styles.image, imageStyle]}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {loading && !error && (
        <ActivityIndicator
          size={loaderSize}
          color={styleConstants.color.primaryColor}
          style={styles.loader}
        />
      )}
      {error && !loading && (
        <Text style={styles.errorText}>Failed to load image</Text>
      )}
      {renderContent()}
    </View>
  );
};

export default CloudImage;

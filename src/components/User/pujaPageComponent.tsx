import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import DakshinaModal from "../Shared/dakshinaModal";
import CloudImage from "../Shared/lazyLoadingImage";
import { dummyImageURL } from "../../constants";
import usePanchang from "../../hooks/usePanchang";
import { screenWidth, styleConstants } from "../../styles";

import { homePageStyle as styles } from "../../styles";

const SLIDE_INTERVAL = 3000;

const PujaPageComponent = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { dakshinaImages, loading, getDakshinaAll } = usePanchang();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log("Fetching dakshina images...");
    getDakshinaAll();
  }, []);

  useEffect(() => {
    if (!dakshinaImages.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex =
          prevIndex + 1 >= dakshinaImages.length ? 0 : prevIndex + 1;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [dakshinaImages]);

  return (
    <View style={{ width: "100%" }}>
      {showModal ? (
        <DakshinaModal visible={showModal} onClose={setShowModal} />
      ) : (
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator
              style={{ marginVertical: 20, alignSelf: "center" }}
              size="large"
              color={styleConstants.color.primaryColor}
            />
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                horizontal
                data={dakshinaImages}
                renderItem={({ item }) => (
                  <Pressable onPress={() => setShowModal(true)}>
                    <CloudImage
                      imageUrl={item?.source ?? dummyImageURL}
                      imageStyle={styles.menuImage}
                    />
                  </Pressable>
                )}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.menuImagesContainer}
                pagingEnabled
                onScrollBeginDrag={() => clearInterval(SLIDE_INTERVAL)}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / screenWidth
                  );
                  setCurrentIndex(index);
                }}
                getItemLayout={(_data, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
              />

              {dakshinaImages.length > 1 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 8,
                    gap: 5,
                  }}
                >
                  {dakshinaImages.map((_: any, index: number) => (
                    <View
                      key={index}
                      style={{
                        width: currentIndex === index ? 20 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          currentIndex === index
                            ? styleConstants.color.primaryColor
                            : "#D0D0D0",
                      }}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default PujaPageComponent;

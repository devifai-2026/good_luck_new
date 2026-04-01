import { memo } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { matchesListStyles as styles } from "../../styles/loveandfriends.style";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateActiveId } from "../../redux/silces/auth.silce";
import { dummyImageURL } from "../../constants";

interface MAtchListProps {
  navigation: any;
  matchItems: any[];
}
const screenWidth = Dimensions.get("screen").width;
const width = screenWidth * 0.3;

const MatchesList = ({ navigation, matchItems }: MAtchListProps) => {
  const params = useRoute();
  const dispatch = useDispatch();
  const clickonProfile = (id: string) => {
    dispatch(updateActiveId({ id }));
    if (params.name === "datingmatches") {
      navigation.navigate("datingprofile");
    } else navigation.navigate("matrimonyprofile");
  };
  const renderItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => clickonProfile(item?.userID)}>
      <View
        key={item?.userID}
        style={[styles.matchContainer, { width: screenWidth - 25 }]}
      >
        <TouchableOpacity
          // onPress={() => clickonProfile(item?.userID)}
          style={styles.imageContainer}
        >
          <Image
            source={{
              uri: item?.imageURL[0] ? item?.imageURL[0] : dummyImageURL,
            }}
            style={[styles.image, { height: width * 1.5, width: width }]}
            loadingIndicatorSource={{
              uri: item?.imageURL[0] ? item?.imageURL[0] : dummyImageURL,
            }}
          ></Image>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.name}>{item.userName}</Text>

          <Text style={styles.text}>{item.userAge} Years</Text>
          {item?.caste && <Text style={styles.text}>{item?.caste}</Text>}
          {item?.education && (
            <Text style={styles.text}>{item?.education}</Text>
          )}
          <Text style={styles.text}>{item.userAddress}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={matchItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.userID}
      contentContainerStyle={styles.matches}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default memo(MatchesList);

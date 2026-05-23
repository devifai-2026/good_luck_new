import React, { memo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { topscrollableMenu, topscrollableMenuLarge } from "../../styles";

export interface IMenuItem {
  id: string;
  title: string;
  icon: any;
  route: string;
}

interface ScrollableMenuProps {
  navigation: any;
  menuItems: IMenuItem[];
  size?: "small" | "large";
}

const ScrollableMenu = ({ navigation, menuItems, size = "small" }: ScrollableMenuProps) => {
  const styles = size === "large" ? topscrollableMenuLarge : topscrollableMenu;

  const renderItem = ({ item }: { item: IMenuItem }) => (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate(item.route, { id: item.id })}
    >
      <View style={styles.iconBox}>
        <Image
          style={styles.icon}
          source={item.icon}
          resizeMode={size === "large" ? "cover" : "contain"}
        />
      </View>
      <Text style={styles.label} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={menuItems}
      horizontal
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default memo(ScrollableMenu);

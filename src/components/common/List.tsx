import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ViewStyle } from 'react-native';

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

interface ListProps {
  data: ListItem[];
  title?: string;
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  showSeparator?: boolean;
}

const List: React.FC<ListProps> = ({
  data,
  title,
  style,
  itemStyle,
  showSeparator = true,
}) => {
  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity
      style={[styles.item, itemStyle]}
      onPress={item.onPress}
      disabled={!item.onPress}
    >
      <View>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => {
    if (showSeparator) {
      return <View style={styles.separator} />;
    }
    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
    color: '#333333',
  },
  item: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  itemTitle: {
    fontSize: 16,
    color: '#333333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 16,
  },
});

export default List;
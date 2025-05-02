import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

interface CommunityItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

const DUMMY_DATA: CommunityItem[] = [
  {
    id: '1',
    title: '社区话题一',
    content: '这是社区的第一个话题内容...',
    author: '用户A',
    date: '2023-05-01'
  },
  {
    id: '2',
    title: '社区话题二',
    content: '这是社区的第二个话题内容...',
    author: '用户B',
    date: '2023-05-02'
  },
  {
    id: '3',
    title: '社区话题三',
    content: '这是社区的第三个话题内容...',
    author: '用户C',
    date: '2023-05-03'
  },
];

const CommunityScreen = () => {
  const { user } = useAuth();

  const renderItem = ({ item }: { item: CommunityItem }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardContent}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardAuthor}>{item.author}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>社区</Text>
        {user && <Text style={styles.subtitle}>欢迎您，{user.name}</Text>}
      </View>
      
      <FlatList
        data={DUMMY_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  cardContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardAuthor: {
    fontSize: 12,
    color: '#999999',
  },
  cardDate: {
    fontSize: 12,
    color: '#999999',
  },
});

export default CommunityScreen;
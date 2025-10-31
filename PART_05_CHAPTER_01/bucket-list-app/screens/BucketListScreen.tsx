import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BucketList } from '../types';
import AddBucketListModal from '../components/AddBucketListModal';

type MainStackParamList = {
  Home: undefined;
  Detail: { bucketListId: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

export default function BucketListScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [bucketLists, setBucketLists] = useState<BucketList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch bucket lists from Supabase (all users for social feed)
  const fetchBucketLists = async () => {
    try {
      if (!user) return;

      // Fetch all users' bucket lists
      const { data, error } = await supabase
        .from('bucket_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to add user_email
      // For now, display user_id (first 8 chars) as identifier
      // Current user's email will be shown for their own posts
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        user_email: item.user_id === user.id
          ? user.email || 'You'
          : `User ${item.user_id.substring(0, 8)}`,
      }));

      setBucketLists(transformedData);
    } catch (error) {
      console.error('Error fetching bucket lists:', error);
      Alert.alert('Error', 'Failed to load bucket lists');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBucketLists();
  }, [user]);

  // Refresh list when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBucketLists();
    }, [user])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBucketLists();
  }, []);

  // Handle adding new bucket list
  const handleAddBucketList = async (title: string, content: string) => {
    if (!user) return;

    const { error } = await supabase.from('bucket_lists').insert({
      title,
      content: content || null,
      completed: false,
      user_id: user.id,
    });

    if (error) {
      throw error;
    }

    // Refresh the list
    await fetchBucketLists();
  };

  const renderItem = ({ item }: { item: BucketList }) => {
    const isMyPost = item.user_id === user?.id;

    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          item.completed && styles.listItemCompleted,
        ]}
        onPress={() => {
          navigation.navigate('Detail', { bucketListId: item.id });
        }}
      >
        <View style={styles.listItemContent}>
          {/* Author info with "My Post" indicator */}
          <View style={styles.authorContainer}>
            <Text style={styles.authorText}>
              {item.user_email}
            </Text>
            {isMyPost && (
              <View style={styles.myPostBadge}>
                <Text style={styles.myPostBadgeText}>My Post</Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.listItemTitle,
              item.completed && styles.listItemTitleCompleted,
            ]}
          >
            {item.title}
          </Text>
          {item.content && (
            <Text
              style={[
                styles.listItemSubtitle,
                item.completed && styles.listItemSubtitleCompleted,
              ]}
              numberOfLines={2}
            >
              {item.content}
            </Text>
          )}
        </View>
        <View style={styles.statusContainer}>
          {item.completed ? (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓</Text>
            </View>
          ) : (
            <View style={styles.incompleteBadge} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No bucket lists yet</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button to create your first bucket list!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bucketLists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          bucketLists.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add Bucket List Modal */}
      <AddBucketListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddBucketList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemCompleted: {
    backgroundColor: '#F0F0F0',
    opacity: 0.7,
  },
  listItemContent: {
    flex: 1,
    marginRight: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  authorText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  myPostBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  myPostBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listItemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listItemSubtitleCompleted: {
    color: '#999',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  incompleteBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#DDD',
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#BBB',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

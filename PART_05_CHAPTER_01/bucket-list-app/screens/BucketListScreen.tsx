import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { BucketList } from '../lib/types';
import { BucketListItem } from '../components/BucketListItem';
import { useAuth } from '../contexts/AuthContext';

interface BucketListScreenProps {
  onItemPress: (item: BucketList) => void;
  onAddPress: () => void;
  refreshTrigger?: number;
}

export const BucketListScreen: React.FC<BucketListScreenProps> = ({
  onItemPress,
  onAddPress,
  refreshTrigger,
}) => {
  const [bucketLists, setBucketLists] = useState<BucketList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { session } = useAuth();

  const fetchBucketLists = async () => {
    try {
      const { data, error } = await supabase
        .from('bucket_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBucketLists(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBucketLists();

    // Subscribe to changes
    const subscription = supabase
      .channel('bucket_lists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bucket_lists',
          filter: `user_id=eq.${session?.user.id}`,
        },
        () => {
          fetchBucketLists();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [session, refreshTrigger]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBucketLists();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bucket Lists</Text>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : bucketLists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bucket lists yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to create your first one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={bucketLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BucketListItem item={item} onPress={() => onItemPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onAddPress}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
});

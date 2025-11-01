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
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
  const { session } = useAuth();

  const fetchBucketLists = async () => {
    try {
      // Fetch bucket lists with user email using join
      // Note: This requires a database view or function to access auth.users
      // For simplicity, we'll use RPC or just display user_id initially
      const { data: bucketListData, error: bucketListError } = await supabase
        .from('bucket_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (bucketListError) throw bucketListError;

      // Enrich with current user's email for matching user_ids
      if (bucketListData && session) {
        const enrichedData = bucketListData.map(item => ({
          ...item,
          user_email: item.user_id === session.user.id ? session.user.email : item.user_id.substring(0, 8) + '...',
        }));
        setBucketLists(enrichedData);
      } else {
        setBucketLists(bucketListData || []);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBucketLists();

    // Subscribe to changes (all bucket lists now)
    const subscription = supabase
      .channel('bucket_lists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bucket_lists',
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

  const filteredBucketLists = filterMode === 'mine'
    ? bucketLists.filter(item => item.user_id === session?.user.id)
    : bucketLists;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bucket Lists</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filterMode === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text style={[styles.filterText, filterMode === 'all' && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterMode === 'mine' && styles.filterButtonActive]}
            onPress={() => setFilterMode('mine')}
          >
            <Text style={[styles.filterText, filterMode === 'mine' && styles.filterTextActive]}>Mine</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : filteredBucketLists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {filterMode === 'mine' ? 'No bucket lists yet' : 'No bucket lists found'}
          </Text>
          <Text style={styles.emptySubtext}>
            {filterMode === 'mine' ? 'Tap the + button to create your first one!' : 'Try switching to "Mine" to create one!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBucketLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BucketListItem
              item={item}
              onPress={() => onItemPress(item)}
              isOwnItem={item.user_id === session?.user.id}
            />
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
  filterContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
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

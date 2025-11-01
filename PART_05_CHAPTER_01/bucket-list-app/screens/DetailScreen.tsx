import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { BucketList } from '../lib/types';
import { CommentSection } from '../components/CommentSection';

interface DetailScreenProps {
  item: BucketList;
  onBack: () => void;
  onEdit: () => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({ item, onBack, onEdit }) => {
  const [bucketList, setBucketList] = useState<BucketList>(item);
  const [updating, setUpdating] = useState(false);

  // Sync local state when item prop changes (e.g., after edit)
  useEffect(() => {
    setBucketList(item);
  }, [item]);

  const handleToggleComplete = async () => {
    setUpdating(true);

    try {
      const { data, error } = await supabase
        .from('bucket_lists')
        .update({ completed: !bucketList.completed })
        .eq('id', bucketList.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setBucketList(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Bucket List',
      'Are you sure you want to delete this bucket list? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('bucket_lists')
                .delete()
                .eq('id', bucketList.id);

              if (error) throw error;
              onBack();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <Text
            style={[
              styles.title,
              bucketList.completed && styles.completedTitle,
            ]}
          >
            {bucketList.title}
          </Text>
          <Text style={styles.date}>Created {formatDate(bucketList.created_at)}</Text>
        </View>

        <View style={styles.contentSection}>
          <Text
            style={[
              styles.contentText,
              bucketList.completed && styles.completedContent,
            ]}
          >
            {bucketList.content}
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              bucketList.completed && styles.completeButtonActive,
              updating && styles.buttonDisabled,
            ]}
            onPress={handleToggleComplete}
            disabled={updating}
          >
            <Text
              style={[
                styles.completeButtonText,
                bucketList.completed && styles.completeButtonTextActive,
              ]}
            >
              {bucketList.completed ? '✓ Completed' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <CommentSection bucketListId={bucketList.id} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  contentSection: {
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  completedContent: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  actionsSection: {
    marginBottom: 32,
  },
  completeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  completeButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButtonTextActive: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

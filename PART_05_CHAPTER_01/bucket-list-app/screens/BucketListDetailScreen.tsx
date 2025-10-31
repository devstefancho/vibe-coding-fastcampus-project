import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BucketList, Comment } from '../types';

type MainStackParamList = {
  Home: undefined;
  Detail: { bucketListId: string };
};

type DetailScreenRouteProp = RouteProp<MainStackParamList, 'Detail'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Detail'>;

export default function BucketListDetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const { user } = useAuth();
  const { bucketListId } = route.params;

  const [bucketList, setBucketList] = useState<BucketList | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch bucket list details and comments
  useEffect(() => {
    fetchBucketListDetail();
    fetchComments();
  }, [bucketListId]);

  const fetchBucketListDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('bucket_lists')
        .select('*')
        .eq('id', bucketListId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setBucketList(data);
        setTitle(data.title);
        setContent(data.content || '');
        setCompleted(data.completed);
      }
    } catch (error) {
      console.error('Error fetching bucket list:', error);
      Alert.alert('Error', 'Failed to load bucket list details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Update bucket list
  const updateBucketList = async (updates: Partial<BucketList>) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('bucket_lists')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bucketListId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating bucket list:', error);
      Alert.alert('Error', 'Failed to update bucket list');
    } finally {
      setSaving(false);
    }
  };

  // Handle title change with auto-save
  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    if (newTitle.trim()) {
      await updateBucketList({ title: newTitle.trim() });
    }
  };

  // Handle content change with auto-save
  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    await updateBucketList({ content: newContent.trim() || null });
  };

  // Toggle completion status
  const toggleCompleted = async () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    await updateBucketList({ completed: newCompleted });
  };

  // Delete bucket list
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
                .eq('id', bucketListId);

              if (error) {
                throw error;
              }

              navigation.goBack();
            } catch (error) {
              console.error('Error deleting bucket list:', error);
              Alert.alert('Error', 'Failed to delete bucket list');
            }
          },
        },
      ]
    );
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('bucket_list_id', bucketListId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      setSubmittingComment(true);

      const { error } = await supabase.from('comments').insert({
        bucket_list_id: bucketListId,
        user_id: user.id,
        comment: newComment.trim(),
      });

      if (error) {
        throw error;
      }

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!bucketList) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Bucket list not found</Text>
      </View>
    );
  }

  // Check if current user is the owner
  const isOwner = bucketList.user_id === user?.id;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Read-only notice for non-owners */}
        {!isOwner && (
          <View style={styles.readOnlyNotice}>
            <Text style={styles.readOnlyText}>👀 Viewing someone else's bucket list</Text>
          </View>
        )}

        {/* Completion Toggle - Only for owners */}
        {isOwner ? (
          <TouchableOpacity style={styles.completionRow} onPress={toggleCompleted}>
            <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
              {completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.completionLabel}>
              {completed ? 'Completed' : 'Mark as completed'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completionRow}>
            <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
              {completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.completionLabel}>
              {completed ? 'Completed' : 'Not completed'}
            </Text>
          </View>
        )}

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, styles.titleInput, !isOwner && styles.readOnlyInput]}
            value={title}
            onChangeText={isOwner ? setTitle : undefined}
            onBlur={isOwner ? () => handleTitleChange(title) : undefined}
            placeholder="Enter title"
            multiline
            editable={isOwner}
          />
        </View>

        {/* Content Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.input, styles.contentInput, !isOwner && styles.readOnlyInput]}
            value={content}
            onChangeText={isOwner ? setContent : undefined}
            onBlur={isOwner ? () => handleContentChange(content) : undefined}
            placeholder="Enter content (optional)"
            multiline
            textAlignVertical="top"
            editable={isOwner}
          />
        </View>

        {/* Saving Indicator - Only for owners */}
        {saving && isOwner && (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.savingText}>Saving...</Text>
          </View>
        )}

        {/* Delete Button - Only for owners */}
        {isOwner && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Bucket List</Text>
          </TouchableOpacity>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Created: {new Date(bucketList.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.metadataText}>
            Updated: {new Date(bucketList.updated_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

          {/* Comments List */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>
                    {comment.user_id.substring(0, 8)}...
                  </Text>
                  <Text style={styles.commentDate}>
                    {new Date(comment.created_at).toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
          )}

          {/* Add Comment Input */}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              multiline
              maxLength={500}
              editable={!submittingComment}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newComment.trim() || submittingComment) && styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || submittingComment}
            >
              {submittingComment ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  readOnlyNotice: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  readOnlyText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
    textAlign: 'center',
  },
  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#DDD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    minHeight: 60,
  },
  contentInput: {
    minHeight: 150,
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 16,
  },
  savingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  metadata: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginBottom: 24,
  },
  metadataText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  commentDate: {
    fontSize: 11,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noComments: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 24,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

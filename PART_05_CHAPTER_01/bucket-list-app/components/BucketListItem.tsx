import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BucketList } from '../lib/types';

interface BucketListItemProps {
  item: BucketList;
  onPress: () => void;
  isOwnItem?: boolean;
}

export const BucketListItem: React.FC<BucketListItemProps> = ({ item, onPress, isOwnItem = false }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isOwnItem && styles.ownItemContainer]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              item.completed && styles.completedTitle,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {isOwnItem && (
            <View style={styles.ownBadge}>
              <Text style={styles.ownBadgeText}>Mine</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.description,
            item.completed && styles.completedDescription,
          ]}
          numberOfLines={2}
        >
          {item.content}
        </Text>
        {item.user_email && (
          <Text style={styles.author}>
            By: {item.user_email}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ownItemContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  ownBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  ownBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  incompleteBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ddd',
  },
});

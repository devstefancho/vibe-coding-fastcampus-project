import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthScreen } from './screens/AuthScreen';
import { BucketListScreen } from './screens/BucketListScreen';
import { DetailScreen } from './screens/DetailScreen';
import { AddModal } from './components/AddModal';
import { BucketList } from './lib/types';

type Screen = 'list' | 'detail';

const AppContent: React.FC = () => {
  const { session, loading, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [selectedItem, setSelectedItem] = useState<BucketList | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<BucketList | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const handleItemPress = (item: BucketList) => {
    setSelectedItem(item);
    setCurrentScreen('detail');
  };

  const handleBackToList = () => {
    setCurrentScreen('list');
    setSelectedItem(null);
  };

  const handleAddPress = () => {
    setEditItem(undefined);
    setModalVisible(true);
  };

  const handleEditPress = () => {
    if (selectedItem) {
      setEditItem(selectedItem);
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditItem(undefined);
    // Trigger refresh of bucket list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSaveItem = (updatedItem: BucketList) => {
    // Update selectedItem if we're editing an existing item
    if (editItem && selectedItem?.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentScreen('list');
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {currentScreen === 'list' ? (
        <>
          <BucketListScreen
            onItemPress={handleItemPress}
            onAddPress={handleAddPress}
            refreshTrigger={refreshTrigger}
          />
          <View style={styles.logoutContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : selectedItem ? (
        <DetailScreen
          item={selectedItem}
          onBack={handleBackToList}
          onEdit={handleEditPress}
        />
      ) : null}

      <AddModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSave={handleSaveItem}
        editItem={editItem}
      />
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  logoutContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

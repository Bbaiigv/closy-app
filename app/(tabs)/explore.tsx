import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import CustomTabBar from '@/components/dashboard/CustomTabBar';

type TabType = 'guardados' | 'wishlist' | 'armario';

export default function ArmarioScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('guardados');
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const tabs = [
    { id: 'guardados' as TabType, label: 'Guardados', icon: 'bookmark' },
    { id: 'wishlist' as TabType, label: 'Wishlist', icon: 'heart' },
    { id: 'armario' as TabType, label: 'Armario', icon: 'hanger' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'guardados':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.placeholderCard}>
              <MaterialCommunityIcons 
                name="bookmark-outline" 
                size={80} 
                color="rgba(122, 20, 44, 0.6)"
              />
              <Text style={styles.placeholderTitle}>Tus Guardados</Text>
              <Text style={styles.placeholderText}>
                Aquí aparecerán los outfits y prendas que hayas guardado como favoritos
              </Text>
            </View>
          </View>
        );
      
      case 'wishlist':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.placeholderCard}>
              <MaterialCommunityIcons 
                name="heart-outline" 
                size={80} 
                color="rgba(122, 20, 44, 0.6)"
              />
              <Text style={styles.placeholderTitle}>Tu Wishlist</Text>
              <Text style={styles.placeholderText}>
                Lista de deseos con las prendas que quieres comprar o conseguir
              </Text>
            </View>
          </View>
        );
      
      case 'armario':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.placeholderCard}>
              <MaterialCommunityIcons 
                name="hanger" 
                size={80} 
                color="rgba(122, 20, 44, 0.6)"
              />
              <Text style={styles.placeholderTitle}>Mi Armario</Text>
              <Text style={styles.placeholderText}>
                Gestiona toda tu ropa, crea outfits y organiza tu armario digital
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Barra de pestañas horizontal */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <MaterialCommunityIcons 
                name={tab.icon as any} 
                size={20} 
                color={activeTab === tab.id ? '#7A142C' : '#666'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido de la pestaña activa */}
        {renderTabContent()}
      </ScrollView>
      
      {/* Footer personalizado */}
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    paddingTop: 60,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    position: 'relative',
  },
  activeTab: {
    // Estilo adicional para la pestaña activa si es necesario
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  activeTabText: {
    fontSize: 14,
    color: '#7A142C',
    fontWeight: 'bold',
    fontFamily: 'Castio-Regular',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#FAA6B5',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    minHeight: 300,
  },
  placeholderCard: {
    backgroundColor: 'rgba(250, 166, 181, 0.1)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(122, 20, 44, 0.1)',
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: 24,
    fontFamily: 'Castio-Regular',
    color: '#7A142C',
    marginTop: 20,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 
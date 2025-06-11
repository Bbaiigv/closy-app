import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';

interface TabItem {
  name: string;
  title: string;
  icon: string;
  iconFocused: string;
  path: string;
}

const tabs: TabItem[] = [
  {
    name: 'explore',
    title: 'Armario',
    icon: 'hanger',
    iconFocused: 'hanger',
    path: '/(tabs)/explore',
  },
  {
    name: 'index',
    title: 'Home',
    icon: 'home-outline',
    iconFocused: 'home',
    path: '/(tabs)/',
  },
  {
    name: 'favorites',
    title: 'Calendar',
    icon: 'calendar-outline',
    iconFocused: 'calendar',
    path: '/(tabs)/favorites',
  },
  {
    name: 'profile',
    title: 'Perfil',
    icon: 'account-outline',
    iconFocused: 'account',
    path: '/(tabs)/profile',
  },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleTabPress = (tab: TabItem) => {
    router.push(tab.path as any);
  };

  const isActive = (tab: TabItem) => {
    if (tab.name === 'index') {
      return pathname === '/(tabs)' || pathname === '/(tabs)/';
    }
    return pathname === tab.path;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconContainer}>
                <MaterialCommunityIcons
                  name={active ? tab.iconFocused as any : tab.icon as any}
                  size={28}
                  color={active ? '#7A142C' : '#999'}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                { color: active ? '#7A142C' : '#999' }
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FCF6F3',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Calendar, DateData } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import CustomTabBar from '@/components/dashboard/CustomTabBar';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <Text style={styles.title}>Planificación</Text>

      <Calendar
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate || '']: {
            selected: true,
            selectedColor: '#FAA6B5',
          },
        }}
        theme={{
          todayTextColor: '#FAA6B5',
          arrowColor: '#7A142C',
        }}
      />

      {selectedDate && (
        <View style={styles.bottomBlock}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity style={styles.plusButton}>
            <FontAwesome name="plus" size={28} color="#FAA6B5" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Footer personalizado */}
      <CustomTabBar />
    </View>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 60,
    fontFamily: 'Castio-Regular',
  },
  bottomBlock: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100, // Espacio para el tab bar
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#FAA6B5',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
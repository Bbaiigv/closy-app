import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Calendar, DateData } from 'react-native-calendars';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomTabBar from '@/components/dashboard/CustomTabBar';

interface DayLook {
  id: string;
  lookId: string;
  image: any;
  description: string;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedLooks, setSavedLooks] = useState<{ [date: string]: DayLook }>({});
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  
  const router = useRouter();
  const { selectedLookId, targetDate } = useLocalSearchParams();
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  // Array de imágenes disponibles (para mapear IDs)
  const availableImages = {
    '1': require('../../assets/images/Carpeta_guardados/look1.png'),
    '2': require('../../assets/images/Carpeta_guardados/look2.png'),
    '3': require('../../assets/images/Carpeta_guardados/look3.png'),
    '4': require('../../assets/images/Carpeta_guardados/look4.png'),
    '5': require('../../assets/images/Carpeta_guardados/look5.png'),
    '6': require('../../assets/images/Carpeta_guardados/look6.png'),
    '7': require('../../assets/images/Carpeta_guardados/look7.png'),
    '8': require('../../assets/images/Carpeta_guardados/look8.png'),
    '9': require('../../assets/images/Carpeta_guardados/look9.png'),
  };

  // Descripciones automáticas predefinidas
  const defaultDescriptions = [
    "Look perfecto para el día a día, veraniego y perfecto para crear buena impresión.",
    "Look casual ideal para días relajados con mucho estilo y comodidad.",
    "Look elegante que combina perfectamente con cualquier ocasión especial."
  ];

  // Función para generar descripción automática
  const generateDefaultDescription = () => {
    const randomIndex = Math.floor(Math.random() * defaultDescriptions.length);
    return defaultDescriptions[randomIndex];
  };

  // Efecto para manejar la selección de look desde guardados
  useEffect(() => {
    if (selectedLookId && targetDate) {
      const lookId = Array.isArray(selectedLookId) ? selectedLookId[0] : selectedLookId;
      const date = Array.isArray(targetDate) ? targetDate[0] : targetDate;
      
      if (lookId && date) {
        const newLook: DayLook = {
          id: `${date}-${lookId}`,
          lookId: lookId,
          image: availableImages[lookId as keyof typeof availableImages],
          description: generateDefaultDescription()
        };
        
        setSavedLooks(prev => ({
          ...prev,
          [date]: newLook
        }));
        
        setSelectedDate(date);
      }
    }
  }, [selectedLookId, targetDate]);

  // Función para obtener próximos outfits planificados
  const getUpcomingOutfits = () => {
    const today = new Date();
    const upcomingOutfits = Object.entries(savedLooks)
      .filter(([date]) => new Date(date) >= today)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .slice(0, 5); // Mostrar máximo 5 próximos outfits
    
    return upcomingOutfits;
  };

  if (!fontsLoaded) {
    return null;
  }

  const handlePlusPress = () => {
    setModalVisible(true);
  };

  const handleOptionPress = (option: string) => {
    setModalVisible(false);
    
    switch (option) {
      case 'camera':
        Alert.alert('Cámara', 'Funcionalidad de cámara próximamente');
        break;
      case 'gallery':
        Alert.alert('Galería', 'Funcionalidad de galería próximamente');
        break;
      case 'saved':
        if (selectedDate) {
          router.push({
            pathname: '/guardados',
            params: {
              selectionMode: 'true',
              selectedDate: selectedDate
            }
          });
        }
        break;
    }
  };

  const handleEditDescription = () => {
    if (selectedDate && savedLooks[selectedDate]) {
      setTempDescription(savedLooks[selectedDate].description);
      setEditingDescription(true);
    }
  };

  const handleSaveDescription = () => {
    if (selectedDate && savedLooks[selectedDate]) {
      setSavedLooks(prev => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          description: tempDescription
        }
      }));
    }
    setEditingDescription(false);
    setTempDescription('');
  };

  const handleCancelDescription = () => {
    setEditingDescription(false);
    setTempDescription('');
  };

  const handleReplaceLook = () => {
    if (selectedDate) {
      router.push({
        pathname: '/guardados',
        params: {
          selectionMode: 'true',
          selectedDate: selectedDate
        }
      });
    }
  };

  const getCurrentLook = () => {
    return selectedDate ? savedLooks[selectedDate] : null;
  };

  // Generar markedDates para mostrar los días con looks guardados
  const getMarkedDates = () => {
    const marked: any = {};
    
    Object.keys(savedLooks).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: '#FAA6B5',
      };
    });
    
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#FAA6B5',
      };
    }
    
    return marked;
  };

  const currentLook = getCurrentLook();
  const upcomingOutfits = getUpcomingOutfits();

  const renderUpcomingOutfitCard = ({ item, index }: { item: [string, DayLook], index: number }) => {
    const [date, look] = item;
    
    return (
      <TouchableOpacity 
        style={styles.upcomingCard}
        onPress={() => setSelectedDate(date)}
        activeOpacity={0.8}
      >
        <View style={styles.upcomingImageContainer}>
          <Image source={look.image} style={styles.upcomingImage} resizeMode="contain" />
        </View>
        <View style={styles.upcomingContent}>
          <Text style={styles.upcomingDate}>{formatDate(date)}</Text>
          <Text style={styles.upcomingDescription} numberOfLines={2}>
            {look.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      <Text style={styles.title}>Planificación</Text>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Calendar
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          markedDates={getMarkedDates()}
          theme={{
            todayTextColor: '#FAA6B5',
            arrowColor: '#7A142C',
          }}
        />

        {/* TEXTO INTRODUCTORIO Y BOTÓN */}
        {!selectedDate && (
          <View style={styles.introSection}>
            <Text style={styles.introText}>
              ¡Planifica todos tus próximos outfits conmigo! Te ayudo a elegir lo que más te gusta y va contigo para que siempre tengas el look perfecto. 🌸
            </Text>
            
            <TouchableOpacity 
              style={styles.planFirstOutfitMainButton}
              activeOpacity={0.8}
              onPress={() => {
                // Aquí puedes añadir la navegación o acción deseada
                Alert.alert('Planificar', 'Funcionalidad próximamente');
              }}
            >
              <Text style={styles.planFirstOutfitMainButtonText}>Planifica tu primer outfit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* A. CAJA DEL DÍA SELECCIONADO */}
        {selectedDate && (
          <View style={styles.selectedDayContainer}>
            <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
            
            {currentLook ? (
              // Mostrar look planificado
              <View style={styles.selectedLookContainer}>
                <View style={styles.selectedImageContainer}>
                  <Image 
                    source={currentLook.image} 
                    style={styles.selectedLookImage}
                    resizeMode="contain"
                  />
                </View>
                
                <View style={styles.descriptionContainer}>
                  {editingDescription ? (
                    <View style={styles.editingContainer}>
                      <TextInput
                        style={styles.descriptionInput}
                        value={tempDescription}
                        onChangeText={setTempDescription}
                        placeholder="Escribe una descripción del look..."
                        multiline={true}
                        numberOfLines={3}
                        autoFocus={true}
                      />
                      <View style={styles.editingButtons}>
                        <TouchableOpacity 
                          style={styles.cancelButton}
                          onPress={handleCancelDescription}
                        >
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.saveButton}
                          onPress={handleSaveDescription}
                        >
                          <Text style={styles.saveButtonText}>Guardar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.descriptionTouchable}
                      onPress={handleEditDescription}
                    >
                      <Text style={styles.descriptionText}>
                        {currentLook.description || 'Toca para personalizar la descripción...'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.replaceLookButton}
                  onPress={handleReplaceLook}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons 
                    name="swap-horizontal" 
                    size={20} 
                    color="#FAA6B5" 
                  />
                  <Text style={styles.replaceLookText}>Cambiar look</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Mostrar estado vacío minimalista
              <View style={styles.emptyDayContainer}>
                <Text style={styles.roseMessage}>
                  ¡Aún no tienes nada para este día! Vamos a elegir algo para que tengas todo bajo control 💫
                </Text>
                
                <TouchableOpacity 
                  style={styles.emptyPlusButton}
                  onPress={handlePlusPress}
                  activeOpacity={0.8}
                >
                  <FontAwesome name="plus" size={36} color="#FAA6B5" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* B. SECCIÓN FIJA DE PRÓXIMOS OUTFITS PLANIFICADOS */}
        <View style={styles.upcomingSectionContainer}>
          <Text style={styles.upcomingSectionTitle}>Próximos outfits planificados</Text>
          <Text style={styles.upcomingSectionSubtitle}>
            Te dejo aquí tus planes de los próximos días, por si quieres echarles un ojo 💖
          </Text>
          
          {upcomingOutfits.length > 0 ? (
            <FlatList
              data={upcomingOutfits}
              renderItem={renderUpcomingOutfitCard}
              keyExtractor={(item) => item[0]}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upcomingList}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}

            />
          ) : (
            <View style={styles.noUpcomingContainer}>
              <MaterialCommunityIcons name="calendar-heart" size={48} color="#FAA6B5" />
              <Text style={styles.noUpcomingText}>
                Aún no tienes outfits planificados para los próximos días
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <CustomTabBar />

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}
          />
          
          <View style={styles.bottomSheetContainer}>
            <View style={styles.handleIndicator} />
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => handleOptionPress('camera')}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name="camera" 
                  size={24} 
                  color="#333" 
                />
                <Text style={styles.optionText}>Hacer foto con la cámara</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => handleOptionPress('gallery')}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name="image" 
                  size={24} 
                  color="#333" 
                />
                <Text style={styles.optionText}>Seleccionar desde galería</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => handleOptionPress('saved')}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name="bookmark" 
                  size={24} 
                  color="#333" 
                />
                <Text style={styles.optionText}>Elegir look guardado</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.cancelButtonModal}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  
  // Estilos para la sección introductoria
  introSection: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'System',
  },
  planFirstOutfitMainButton: {
    backgroundColor: '#FAA6B5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planFirstOutfitMainButtonText: {
    color: '#7A142C',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  
  // Estilos para la caja del día seleccionado
  selectedDayContainer: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Estilos para look seleccionado
  selectedLookContainer: {
    width: '100%',
    alignItems: 'center',
  },
  selectedImageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLookImage: {
    width: '95%',
    height: '95%',
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 15,
  },
  descriptionTouchable: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: 'System',
  },
  editingContainer: {
    width: '100%',
  },
  descriptionInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 10,
    fontFamily: 'System',
  },
  editingButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FAA6B5',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  replaceLookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FAA6B5',
    backgroundColor: 'rgba(250, 166, 181, 0.1)',
  },
  replaceLookText: {
    color: '#FAA6B5',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  
  // Estilos para estado vacío del día - SIMPLIFICADO
  emptyDayContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  roseMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
    paddingHorizontal: 10,
    fontFamily: 'System',
  },
  emptyPlusButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#FAA6B5',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 166, 181, 0.05)',
  },
  
  // Estilos para sección de próximos outfits
  upcomingSectionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  upcomingSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 8,
    fontFamily: 'Castio-Regular',
  },
  upcomingSectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'System',
  },
  upcomingList: {
    paddingVertical: 10,
  },
  upcomingCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  upcomingImageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  upcomingImage: {
    width: '100%',
    height: '100%',
  },
  upcomingContent: {
    padding: 12,
  },
  upcomingDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FAA6B5',
    marginBottom: 4,
  },
  upcomingDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    fontFamily: 'System',
  },

  noUpcomingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noUpcomingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
    marginBottom: 20,
    fontFamily: 'System',
  },

  
  // Estilos del Bottom Sheet Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 34,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
  cancelButtonModal: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelButtonModalText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
}); 
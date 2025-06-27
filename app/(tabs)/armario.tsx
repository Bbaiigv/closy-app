import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import CustomTabBar from '@/components/dashboard/CustomTabBar';
import { useRouter } from 'expo-router';

type TabType = 'guardados' | 'wishlist' | 'armario';

interface CustomFolder {
  id: string;
  name: string;
  images: any[];
}

const { width: screenWidth } = Dimensions.get('window');
const containerPadding = 20;
const itemSpacing = 8;
const itemWidth = (screenWidth - containerPadding * 2 - itemSpacing * 2) / 3;

export default function ArmarioScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('guardados');
  const [customFolders, setCustomFolders] = useState<CustomFolder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  const router = useRouter();

  // Array de todas las imágenes disponibles
  const allOutfitImages = [
    require('../../assets/images/Carpeta_guardados/look1.png'),
    require('../../assets/images/Carpeta_guardados/look2.png'),
    require('../../assets/images/Carpeta_guardados/look3.png'),
    require('../../assets/images/Carpeta_guardados/look4.png'),
    require('../../assets/images/Carpeta_guardados/look5.png'),
    require('../../assets/images/Carpeta_guardados/look6.png'),
    require('../../assets/images/Carpeta_guardados/look7.png'),
    require('../../assets/images/Carpeta_guardados/look8.png'),
    require('../../assets/images/Carpeta_guardados/look9.png'),
  ];

  // Función para obtener 3 imágenes aleatorias
  const getRandomImages = () => {
    const shuffled = [...allOutfitImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Función para crear nueva carpeta
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: CustomFolder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        images: getRandomImages()
      };
      setCustomFolders([...customFolders, newFolder]);
      setNewFolderName('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Por favor, introduce un nombre para la carpeta');
    }
  };

  // Función para abrir modal
  const handleAddFolder = () => {
    setModalVisible(true);
  };

  // Función para navegar a la pantalla de guardados
  const handleFolderPress = (folderName: string) => {
    console.log(`Navegando a carpeta: ${folderName}`);
    router.push(`/carpeta-detalle?carpeta=${encodeURIComponent(folderName)}`);
  };

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
        const comidasImages = getRandomImages();
        const trabajoImages = getRandomImages();
        const salidasImages = getRandomImages();
        
        return (
          <View style={styles.guardadosContainer}>
            {/* Header con título y botón agregar */}
            <View style={styles.guardadosHeader}>
              <Text style={styles.guardadosTitle}>Mis Carpetas</Text>
              <TouchableOpacity style={styles.addFolderButton} onPress={handleAddFolder}>
                <MaterialCommunityIcons 
                  name="plus" 
                  size={24} 
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>

            {/* Carpetas de outfits */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Carpeta Comidas */}
              <TouchableOpacity 
                style={styles.folderCard}
                onPress={() => handleFolderPress('Comidas')}
                activeOpacity={0.8}
              >
                <View style={styles.folderHeader}>
                  <Text style={styles.folderTitle}>Comidas</Text>
                </View>
                <View style={styles.outfitsGrid}>
                  {comidasImages.map((image, index) => (
                    <View key={`comidas-${index}`} style={styles.outfitItem}>
                      <Image 
                        source={image}
                        style={styles.outfitImage}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              {/* Carpeta Trabajo */}
              <TouchableOpacity 
                style={styles.folderCard}
                onPress={() => handleFolderPress('Trabajo')}
                activeOpacity={0.8}
              >
                <View style={styles.folderHeader}>
                  <Text style={styles.folderTitle}>Trabajo</Text>
                </View>
                <View style={styles.outfitsGrid}>
                  {trabajoImages.map((image, index) => (
                    <View key={`trabajo-${index}`} style={styles.outfitItem}>
                      <Image 
                        source={image}
                        style={styles.outfitImage}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              {/* Carpeta Salidas */}
              <TouchableOpacity 
                style={styles.folderCard}
                onPress={() => handleFolderPress('Salidas')}
                activeOpacity={0.8}
              >
                <View style={styles.folderHeader}>
                  <Text style={styles.folderTitle}>Salidas</Text>
                </View>
                <View style={styles.outfitsGrid}>
                  {salidasImages.map((image, index) => (
                    <View key={`salidas-${index}`} style={styles.outfitItem}>
                      <Image 
                        source={image}
                        style={styles.outfitImage}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              {/* Carpetas personalizadas creadas por el usuario */}
              {customFolders.map((folder) => (
                <TouchableOpacity 
                  key={folder.id} 
                  style={styles.folderCard}
                  onPress={() => handleFolderPress(folder.name)}
                  activeOpacity={0.8}
                >
                  <View style={styles.folderHeader}>
                    <Text style={styles.folderTitle}>{folder.name}</Text>
                  </View>
                  <View style={styles.outfitsGrid}>
                    {folder.images.map((image, index) => (
                      <View key={`${folder.id}-${index}`} style={styles.outfitItem}>
                        <Image 
                          source={image}
                          style={styles.outfitImage}
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      
      case 'wishlist':
        const wishlistItems = [
          {
            id: '1',
            name: 'Top Tachuelas',
            image: require('../../assets/images/Carpeta_wishlist/toptachuelas.png'),
          },
          {
            id: '2',
            name: 'Top Fiesta',
            image: require('../../assets/images/Carpeta_wishlist/topfiesta.png'),
          },
          {
            id: '3',
            name: 'Top Boho',
            image: require('../../assets/images/Carpeta_wishlist/topboho.png'),
          },
          {
            id: '4',
            name: 'Tirantes Marrón',
            image: require('../../assets/images/Carpeta_wishlist/tirantesmarron.png'),
          },
          {
            id: '5',
            name: 'Camiseta Corta',
            image: require('../../assets/images/Carpeta_wishlist/camisetacorta.png'),
          },
          {
            id: '6',
            name: 'Bolso Tachuelas',
            image: require('../../assets/images/Carpeta_wishlist/Bolsotachuelas.png'),
          },
          {
            id: '7',
            name: 'Blusa Boho',
            image: require('../../assets/images/Carpeta_wishlist/Blusaboho.png'),
          },
        ];

        // Función para crear grid con 3 columnas fijas
        const createFixedGrid = (items: any[]) => {
          const rows = [];
          const columnsPerRow = 3;
          
          for (let i = 0; i < items.length; i += columnsPerRow) {
            const row = [];
            
            // Llenar las 3 columnas (con items reales o vacíos)
            for (let j = 0; j < columnsPerRow; j++) {
              const itemIndex = i + j;
              if (itemIndex < items.length) {
                row.push(items[itemIndex]);
              } else {
                row.push(null); // Celda vacía
              }
            }
            
            rows.push(row);
          }
          
          return rows;
        };

        const gridRows = createFixedGrid(wishlistItems);

        // Componente para renderizar cada celda
        const renderWishlistCell = (item: any, index: number) => {
          if (!item) {
            // Celda vacía - mantiene el espacio pero sin contenido visual
            return (
              <View key={`empty-${index}`} style={styles.wishlistItem}>
                <View style={styles.wishlistEmptyContainer} />
              </View>
            );
          }

          return (
            <TouchableOpacity 
              key={item.id}
              style={styles.wishlistItem}
              onPress={() => console.log(`Wishlist item: ${item.name}`)}
              activeOpacity={0.8}
            >
              <View style={styles.wishlistImageContainer}>
                <Image 
                  source={item.image}
                  style={styles.wishlistItemImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.wishlistItemName}>{item.name}</Text>
            </TouchableOpacity>
          );
        };

        return (
          <View style={styles.wishlistContainer}>
            {/* Header con título */}
            <View style={styles.wishlistHeader}>
              <Text style={styles.wishlistTitle}>Mi Wishlist</Text>
              <Text style={styles.wishlistSubtitle}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'artículo' : 'artículos'}
              </Text>
            </View>

            {/* Grid de wishlist items con 3 columnas fijas */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.wishlistGrid}>
                {gridRows.map((row, rowIndex) => (
                  <View key={`row-${rowIndex}`} style={styles.wishlistRow}>
                    {row.map((item, cellIndex) => 
                      renderWishlistCell(item, rowIndex * 3 + cellIndex)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
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
                color={activeTab === tab.id ? (tab.id === 'guardados' ? '#719185' : '#7A142C') : '#666'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && (tab.id === 'guardados' ? styles.activeTabTextGuardados : styles.activeTabText)
              ]}>
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={[styles.activeIndicator, tab.id === 'guardados' && styles.activeIndicatorGuardados]} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido de la pestaña activa */}
        {renderTabContent()}
      </ScrollView>
      
      {/* Footer personalizado */}
      <CustomTabBar />

      {/* Modal para crear nueva carpeta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Carpeta</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la carpeta"
              placeholderTextColor="#999"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus={true}
              maxLength={20}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setModalVisible(false);
                  setNewFolderName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.createButton]} 
                onPress={handleCreateFolder}
              >
                <Text style={styles.createButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  activeTabTextGuardados: {
    fontSize: 14,
    color: '#719185',
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
  activeIndicatorGuardados: {
    backgroundColor: '#719185',
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
  // Estilos para la sección Guardados
  guardadosContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  guardadosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  guardadosTitle: {
    fontSize: 24,
    fontFamily: 'Castio-Regular',
    color: '#828282',
    fontWeight: 'bold',
  },
  addFolderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#719185',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  folderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  folderHeader: {
    backgroundColor: '#719185',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  folderTitle: {
    fontSize: 16,
    fontFamily: 'Castio-Regular',
    color: '#ffffff',
    fontWeight: '600',
  },
  outfitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  outfitItem: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  outfitImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    margin: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Castio-Regular',
    color: '#719185',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Castio-Regular',
    marginBottom: 25,
    backgroundColor: '#f8f8f8',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Castio-Regular',
    color: '#666',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#719185',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Castio-Regular',
    color: '#ffffff',
    fontWeight: '600',
  },
  // Estilos para Wishlist
  wishlistContainer: {
    flex: 1,
    paddingHorizontal: containerPadding,
  },
  wishlistHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  wishlistTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  wishlistSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  wishlistGrid: {
    flex: 1,
  },
  wishlistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  wishlistItem: {
    width: itemWidth,
    alignItems: 'center',
  },
  wishlistImageContainer: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistItemImage: {
    width: '100%',
    height: '100%',
  },
  wishlistItemName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
    width: itemWidth,
  },
  wishlistEmptyContainer: {
    width: itemWidth,
    height: itemWidth,
    backgroundColor: 'transparent',
  },
}); 
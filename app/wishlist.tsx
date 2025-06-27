import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemSpacing = 12;
const containerPadding = 20;
const itemWidth = (width - containerPadding * 2 - itemSpacing * (numColumns - 1)) / numColumns;

interface WishlistItem {
  id: string;
  name: string;
  image: any;
}

export default function WishlistScreen() {
  const router = useRouter();

  // Array de imágenes de wishlist
  const wishlistItems: WishlistItem[] = [
    {
      id: '1',
      name: 'Top Tachuelas',
      image: require('../assets/images/Carpeta_wishlist/toptachuelas.png'),
    },
    {
      id: '2',
      name: 'Top Fiesta',
      image: require('../assets/images/Carpeta_wishlist/topfiesta.png'),
    },
    {
      id: '3',
      name: 'Top Boho',
      image: require('../assets/images/Carpeta_wishlist/topboho.png'),
    },
    {
      id: '4',
      name: 'Tirantes Marrón',
      image: require('../assets/images/Carpeta_wishlist/tirantesmarron.png'),
    },
    {
      id: '5',
      name: 'Camiseta Corta',
      image: require('../assets/images/Carpeta_wishlist/camisetacorta.png'),
    },
    {
      id: '6',
      name: 'Bolso Tachuelas',
      image: require('../assets/images/Carpeta_wishlist/Bolsotachuelas.png'),
    },
    {
      id: '7',
      name: 'Blusa Boho',
      image: require('../assets/images/Carpeta_wishlist/Blusaboho.png'),
    },
  ];

  const handleGoBack = () => {
    router.back();
  };

  const handleItemPress = (item: WishlistItem) => {
    console.log(`Item seleccionado: ${item.name}`);
    // Aquí puedes agregar la lógica para manejar la selección del item
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.itemImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Mi Wishlist</Text>
      <Text style={styles.subtitle}>
        {wishlistItems.length} {wishlistItems.length === 1 ? 'artículo' : 'artículos'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FCF6F3" />
      
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Wishlist</Text>
        
        <View style={styles.spacer} />
      </View>

      {/* Grid de items */}
      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FCF6F3',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  spacer: {
    width: 40,
  },
  flatListContent: {
    paddingHorizontal: containerPadding,
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  row: {
    justifyContent: 'space-between',
  },
  separator: {
    height: itemSpacing,
  },
  itemContainer: {
    width: itemWidth,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
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
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
}); 
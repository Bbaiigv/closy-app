import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useAppContext } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

export default function ChatAssistant() {
  const { state } = useAppContext();
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [fontsLoaded] = useFonts({
    'Castio-Regular': require('../../assets/fonts/Castio-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aquí implementarías la lógica del chat
      console.log('Mensaje enviado:', message);
      setMessage('');
    }
  };

  const getPersonalizedWelcomeMessage = () => {
    const topStyles = state.styleScores
      .filter(style => style.averageScore >= 4)
      .slice(0, 2)
      .map(style => style.styleName);

    if (topStyles.length > 0) {
      return `¡Hola! He visto que te encantan los estilos ${topStyles.join(' y ')}...`;
    }
    return '¡Hola! He visto que te encantan...';
  };

  return (
    <View style={styles.container}>
      {/* Header con avatar y mensaje */}
      <View style={styles.chatHeader}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons 
            name="account" 
            size={35} 
            color="white" 
          />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeMessage}>
            {getPersonalizedWelcomeMessage()}
          </Text>
        </View>
      </View>

      {/* Input de mensaje */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Mensaje"
          placeholderTextColor="#999"
          multiline={false}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <MaterialCommunityIcons 
            name="send" 
            size={16} 
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7A9B8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    fontFamily: 'Castio-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
    color: '#333',
    fontFamily: 'Castio-Regular',
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAA6B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
}); 
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
      return `¡Hola! He visto que te encantan los estilos ${topStyles.join(' y ')}. ¿En qué puedo ayudarte hoy?`;
    }
    return '¿Con qué puedo ayudarte hoy?';
  };

  return (
    <View style={styles.container}>
      {/* Avatar del asistente */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons 
            name="account-circle" 
            size={50} 
            color="#4D6F62" 
          />
        </View>
      </View>

      {/* Mensaje de bienvenida */}
      <View style={styles.messageContainer}>
        <Text style={styles.welcomeMessage}>
          {getPersonalizedWelcomeMessage()}
        </Text>
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
            size={24} 
            color={message.trim() ? "#FCF6F3" : "#ccc"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCF6F3',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F4F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4D6F62',
  },
  messageContainer: {
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    fontFamily: 'System',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
    fontFamily: 'System',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAA6B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
}); 
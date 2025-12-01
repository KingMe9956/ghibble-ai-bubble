// App.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Image,
  Platform,
  PermissionsAndroid,
  TextInput,
} from 'react-native';
import Voice from '@react-native-voice/voice'; // For Speech Input
import Tts from 'react-native-tts'; // Text-to-Speech
import Clipboard from '@react-native-clipboard/clipboard';
// Placeholder for image recognition import
// import { recognizeImage } from './imageRecognition'; 

const amberURI = 'https://your-cdn.com/images/amber-animated.gif'; // Replace with your asset
const roseURI = 'https://your-cdn.com/images/rose-animated.gif'; // Replace with your asset

const GhibbleBubble = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Bubble drag state
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [
        null,
        { dx: pan.x, dy: pan.y }
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      // Snap bubble to closest corner logic could be added here
    }
  });

  // Voice recognition callbacks
  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (event) => {
      const text = event.value?.[0] || '';
      setMessage(text);
      handleAIQuery(text);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, []);

  const startListening = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }
    }
    Voice.start('en-US');
  };

  const stopListening = () => {
    Voice.stop();
    setIsListening(false);
  };

  // Simulated AI Query Handler - replace with real endpoints
  const handleAIQuery = async (query: string) => {
    // Use fetch or axios to call your backend AI API here:
    // For demo, echo back with pet-style text
    const petResponse = `Amber says: Woof! You asked "${query}". Let me fetch that for you! 🌟`;
    setResponse(petResponse);

    // Speak the response
    Tts.speak(petResponse);
  };

  const copyResponse = () => {
    Clipboard.setString(response);
  };

  return (
    <>
      <Animated.View
        style={[styles.bubble, { transform: pan.getTranslateTransform() }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={isListening ? stopListening : startListening}>
          <Image
            source={{ uri: amberURI }}
            style={styles.avatar}
            resizeMode="contain"
          />
          <View style={[styles.micIndicator, { backgroundColor: isListening ? '#e74c3c' : '#2ecc71' }]} />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.responseContainer}>
        <Text style={styles.responseText}>{response}</Text>
        <TouchableOpacity onPress={copyResponse} style={styles.copyButton}>
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type or speak here..."
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={() => handleAIQuery(message)}
          style={styles.textInput}
          returnKeyType="send"
          multiline
        />
      </View>
    </>
  );
};

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to G'hibble 🐾</Text>
      <Text style={styles.subheader}>Your AI Bubble Confidant with Amber & Rose</Text>
      <GhibbleBubble />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e6',
    paddingTop: 70,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ff6f91',
    marginBottom: 6,
  },
  subheader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  bubble: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  micIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  responseContainer: {
    position: 'absolute',
    bottom: 220,
    left: 20,
    right: 20,
    backgroundColor: '#fff5f8',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#d43f57',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  responseText: {
    fontSize: 16,
    color: '#e84a5f',
  },
  copyButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#ff6f91',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: '#ffeef3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
});

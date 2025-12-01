import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Tts from 'react-native-tts';

export default function App() {
  const [response, setResponse] = useState('');

  const speak = () => {
    const reply = "Hello, I am your AI helper!";
    setResponse(reply);
    Tts.speak(reply);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bubble} onPress={speak}>
        <Image
          source={{ uri: 'https://i.imgur.com/4NZ6u4e.png' }} // Placeholder for Amber/Rose
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={styles.text}>{response}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bubble: { position: 'absolute', bottom: 50, right: 50, width: 80, height: 80, borderRadius: 40, overflow: 'hidden' },
  image: { width: '100%', height: '100%', borderRadius: 40 },
  text: { marginTop: 20, fontSize: 18, color: '#333' },
});

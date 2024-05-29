import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MusicPlayer from '../../components/Musicplayer'; // Adjust the path according to your project structure

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <MusicPlayer />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#222831', // Set a background color to match your MusicPlayer component's styling
  },
});

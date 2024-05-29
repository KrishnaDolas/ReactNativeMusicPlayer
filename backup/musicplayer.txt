import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList, ListRenderItemInfo } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Audio } from 'expo-av';
import songs from '../Model/data';

const { width } = Dimensions.get('window');

interface Song {
  id: string;
  title: string;
  artist: string;
  artwork: any;
  url: any;
  duration: number;
}

const MusicPlayer: React.FC = () => {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const flatListRef = useRef<FlatList<Song>>(null);

  const song = songs[songIndex];

  const loadSound = async (index: number) => {
    if (sound) {
      await sound.unloadAsync();
    }
  
    const { sound: newSound } = await Audio.Sound.createAsync(songs[index].url, {
      shouldPlay: false, // Set shouldPlay to false initially
    });
  
    newSound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && !status.isPlaying) {
        if (status.durationMillis === status.positionMillis) {
          // Audio is fully loaded and ready to play
          await newSound.playAsync();
        }
      }
  
      // Update the playback status
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
    });
  
    setSound(newSound);
  };
  

  useEffect(() => {
    loadSound(songIndex);
    return () => {
      sound?.unloadAsync();
      clearInterval(intervalRef.current!);
    };
  }, [songIndex]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(async () => {
        const status = await sound?.getStatusAsync();
        if (status?.isLoaded) {
          setPosition(status.positionMillis || 0);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    const nextIndex = (songIndex + 1) % songs.length;
    setSongIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex });
    setPosition(0); // Reset position to zero
  };
  

  const handlePrev = () => {
    const prevIndex = songIndex === 0 ? songs.length - 1 : songIndex - 1;
    setSongIndex(prevIndex);
    flatListRef.current?.scrollToIndex({ index: prevIndex });
  };

  const handleSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const handleSliderSlidingStart = () => {
    if (sound) {
      sound.pauseAsync();
    }
  };

  const handleSliderSlidingComplete = async (value: number) => {
    if (sound) {
      await sound.playFromPositionAsync(value);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(scrollOffset / width + 0.5); // Adjusting index based on scroll position
    setSongIndex(index);
    setPosition(0); // Reset position to zero
  };
  

  const renderSongs = ({ item }: ListRenderItemInfo<Song>) => (
    <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.artworkwrapper}>
        <Image source={item.artwork} style={styles.artworkimage} />
      </View>
    </View>
  );

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.Maincontainer}>
        <View style={{width : width}}>
        <FlatList
          ref={flatListRef}
          data={songs}
          renderItem={renderSongs}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />
      </View>
        <View>
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
        </View>

        <View>
          <Slider
            style={styles.progresscontainer}
            value={position}
            minimumValue={0}
            maximumValue={duration}
            thumbTintColor='#FFD369'
            minimumTrackTintColor='#FFD369'
            maximumTrackTintColor='#FFF'
            onSlidingStart={handleSliderSlidingStart}
            onSlidingComplete={handleSliderSlidingComplete}
            onValueChange={handleSliderValueChange}
          />
        </View>

        <View style={styles.progresslabelcontainer}>
          <Text style={styles.progresslabeltext}>{formatTime(position)}</Text>
          <Text style={styles.progresslabeltext}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.musiccontrols}>
          <TouchableOpacity onPress={handlePrev}>
            <Entypo name="controller-fast-backward" color="#FFD369" size={40} style={{ marginTop: 10 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlayPause}>
            <FontAwesome6 name={isPlaying ? "pause" : "play"} size={65} color="#FFD369" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <Entypo name="controller-fast-forward" color="#FFD369" size={40} style={{ marginTop: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => {}}>
            <Entypo name="heart-outlined" color="#777777" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="repeat" color="#777777" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Entypo name="share-alternative" color="#777777" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="more-horiz" color="#777777" size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  Maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkwrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artworkimage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    color: '#EEEEEE',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  progresscontainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progresslabelcontainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progresslabeltext: {
    color: '#fff',
  },
  musiccontrols: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bottomContainer: {
    borderTopColor: "#393E46",
    borderTopWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

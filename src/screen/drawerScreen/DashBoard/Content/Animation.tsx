import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import VideoPlayer from './VidPdfLogix.tsx/VideoPlayer';
import Header from '../../../../utils/Header';

const Animation: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {

  const {video}:any = route.params;

  return (
    <>
    <Header
        title="Animation"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
        rightIcon='home'
        onPressRightIcon={() => navigation.navigate('Dashboard')}
      />
    <ScrollView style={styles.container}>
      {video.length>0 ? (
        <View style={styles.videoplayer}>
          <VideoPlayer videos={video} />
        </View>
      ) : (
        <View>
          <Text style={styles.content}>No Video Found!</Text>
        </View>
      )}
    </ScrollView>
    </>
  );
};

export default Animation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Change background color to a light gray
    // paddingHorizontal:7, // Add padding for a better layout
  },
  videoplayer: {
    backgroundColor: 'transparent', // Change background color to white
    width: '100%',
    height: '100%',
    marginVertical: 5,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 10, // Add border radius for a rounded appearance
    overflow: 'hidden', // Hide any overflow content
    objectFit: 'cover',
  },
  content: {
    color: 'grey',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
  },
});

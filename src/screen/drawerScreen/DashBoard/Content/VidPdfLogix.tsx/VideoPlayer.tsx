import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import YoutubeIframe from 'react-native-youtube-iframe';
import Entypo from 'react-native-vector-icons/Entypo';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

const VideoPlayer: React.FC<{
  videos: {
    VideoID: number;
    ClassID: number;
    SubjectID: number;
    VideoName: string;
    Video: string;
    VideoStatus: number;
    created_at: string;
    updated_at: string;
  }[];
}> = ({videos}) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handlePlayButtonClick = (index: number) => {
    setPlayingIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const getVideoId = (videoUrl: string) => {
    // Extract video ID from YouTube video URL
    let videoId = '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
      videoId = videoUrl.split('v=')[1].split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? videoId : videoUrl;
  };

  return (
    <View style={styles.container}>
      {videos?.map((video, index) => (
        <>
          <View key={video.VideoID} style={styles.videoContainer}>
            {index !== playingIndex ? (
              <TouchableOpacity
                onPress={() => handlePlayButtonClick(index)}
                style={styles.playButtonContainer}>
                <Entypo
                  name="controller-play"
                  style={{alignSelf: 'center'}}
                  size={50}
                  color="white"
                />
              </TouchableOpacity>
            ) : null}

            <View key={video.VideoID} style={[styles.videoPlayer,{pointerEvents: index !== playingIndex ? "none" : "auto"}]}>
              <YoutubeIframe
                key={video.VideoID}
                videoId={getVideoId(video.Video)}
                height={210}
                play={playingIndex === index}
                playListStartIndex={0}
                forceAndroidAutoplay={false}
                onChangeState={event => {
                  if (event === 'ended') {
                    setPlayingIndex(null); // Reset playing index when video ends
                  }
                }}
                webViewProps={{
                  allowsFullscreenVideo: true,
                  allowsInlineMediaPlayback: true,
                }}
                
              />
            </View>
          <Text style={styles.videoTitle}>{video.VideoName}</Text>
          </View>
        </>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    borderRadius: 15,
    backgroundColor: 'transparent',
    marginBottom: 50,
    marginHorizontal: '5%',
  },
  videoContainer: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: 240,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000000',
    elevation: 5,
    shadowOpacity: 1.0,
    display: 'flex',
    flexDirection: 'column',
  },
  playButtonContainer: {
    position: 'absolute',
    margin: 'auto',
    top: responsiveScreenHeight(8.8),
    zIndex: 99,
    width: '20%',
    height: '26%',
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  videoPlayer: {
    pointerEvents: 'none', // Disable touch events on the video player
  },
  videoTitle: {
    fontSize: 17,
    color: 'black',
    fontWeight: '600',
    alignSelf: 'center',
    // marginTop: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: 'grey',
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default VideoPlayer;

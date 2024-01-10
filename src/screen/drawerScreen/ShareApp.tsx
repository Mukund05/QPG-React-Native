import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import Header from '../../utils/Header';

interface shareOptions {
  title: string;
  message: string;
  url: string;
  social: any;
}

const ShareAppScreen: React.FC<{navigation:any}> = ({navigation}) => {
  // Share app to social media
  const handleFacebookShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via WhatsApp',
      message: 'some message',
      url: 'https://www.google.com/',
      social: Share.Social.FACEBOOK,
    };
    Share.shareSingle(shareOptions);
  };
  const handleWhatsappShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via WhatsApp',
      message: 'some message',
      url: 'https://www.google.com/',
      social: Share.Social.WHATSAPP,
    };
    Share.shareSingle(shareOptions);
  };
  const handleInstaShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via WhatsApp',
      message: 'some message',
      url: 'https://www.google.com/',
      social: Share.Social.INSTAGRAM,
    };
    Share.shareSingle(shareOptions);
  };
  const handleTwitterShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via WhatsApp',
      message: 'some message',
      url: 'https://www.google.com/',
      social: Share.Social.TWITTER,
    };
    Share.shareSingle(shareOptions);
  };

  const openShareMenu = () => {
    Share.open({
      title: 'Share App',
      message: 'Check out this amazing app!',
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  return (
    <>
    <Header
      title="Share App"
      leftIcon="menu"
      onPressLeftIcon={() => navigation.openDrawer()}
      bgColor="blue"
    />
    <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.header}>Share App</Text>
        <Text style={styles.content}>
          Welcome to our awesome app! Share it with your friends.
        </Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleFacebookShare}>
            <Icon
              name="facebook"
              size={30}
              color="#1877f2"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleWhatsappShare}>
            <Icon
              name="whatsapp"
              size={30}
              color="#25D366"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleInstaShare}>
            <Icon
              name="instagram"
              size={30}
              color="#C13584"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleTwitterShare}>
            <Icon
              name="twitter"
              size={30}
              color="#1DA1F2"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={openShareMenu}>
            <Icon
              name="ellipsis-h"
              size={30}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '30%',
    margin: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#2483ff',
  },
  content: {
    fontSize: 16,
    margin: 20,
    color: 'black',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    marginBottom: 10,
    margin: 18,
  },
});

export default ShareAppScreen;

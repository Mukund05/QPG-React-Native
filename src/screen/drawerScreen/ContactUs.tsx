import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Header from '../../utils/Header';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const ContactUs: React.FC<{navigation: any}> = ({navigation}) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@bestwaypublication.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:01147073550');
  };

  return (
    <>
      <Header
        title="Contact Us"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
      />
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.header}>Contact Us</Text>
          <TouchableOpacity
            style={styles.information}
            onPress={handleEmailPress}>
            <Text style={styles.text}>
              <Text style={styles.content}>Email ID - </Text>
              info@bestwaypublication.com
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.information}
            onPress={handlePhonePress}>
            <Text style={styles.text}>
              <Text style={styles.content}>Contact No. - </Text>
              011-47073550
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
    margin: responsiveScreenHeight(2),
    borderRadius: 10,
    paddingBottom: responsiveScreenHeight(4),
  },
  header: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
    margin: responsiveScreenHeight(2),
    color: '#2483ff',
  },
  content: {
    fontSize: responsiveFontSize(2),
    color: 'blue',
    fontWeight: 'bold',
  },
  information: {
    alignSelf: 'flex-start',
    marginLeft: responsiveScreenWidth(4),
    marginVertical: responsiveScreenHeight(1),
  },
  text: {
    fontSize: responsiveFontSize(2),
    alignSelf: 'flex-start',
    color: 'black',
    textAlign: 'justify',
    lineHeight: 25,
  },
});

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../utils/Header';

const ContactUs: React.FC<{navigation:any}> = ({navigation}) => {
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
        <Text style={styles.information}>
          <Text style={styles.content}>Email ID -  </Text>
          admin1234@gmail.com
        </Text>
        <Text style={styles.information}>
          <Text style={styles.content}>Contact No. -  </Text>
          +91 1234567890
        </Text>
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
    margin: 20,
    borderRadius: 10,
    paddingBottom: 20,
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
    color: 'blue',
    fontWeight: 'bold',
  },
  information: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: 'black',
    textAlign: 'justify',
    lineHeight: 25,
    marginLeft: 20,
    marginVertical: 10,
  },
});

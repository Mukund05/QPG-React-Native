import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../utils/Header';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';

const Help: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <>
      <Header
        title="Help"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
      />
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.header}>Help For Users</Text>
          <Text style={styles.content}>
            This is a demo project for the purpose of learning React Native.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            nostrum ipsum recusandae perferendis possimus dolores quas debitis
            natus vero voluptatum, earum sequi eos inventore assumenda
            voluptates omnis labore deleniti, sint temporibus quasi veniam a
            quod! Suscipit tenetur voluptas hic perferendis illum repellat,
            exercitationem quo, deserunt voluptatibus accusamus modi adipisci
            cumque? Lorem ipsum dolor sit
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.header}>Student's Essential Guide</Text>
          <Text style={styles.content}>
            This is a demo project for the purpose of learning React Native.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            nostrum ipsum recusandae perferendis possimus dolores quas debitis
            natus vero voluptatum, earum sequi eos inventore assumenda
            voluptates omnis labore deleniti, sint temporibus quasi veniam a
            quod! Suscipit tenetur voluptas hic perferendis illum repellat,
            exercitationem quo, deserunt voluptatibus accusamus modi adipisci
            cumque? Lorem ipsum dolor sit
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.header}>Teacher's Essential Guide</Text>
          <Text style={styles.content}>
            This is a demo project for the purpose of learning React Native.
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            nostrum ipsum recusandae perferendis possimus dolores quas debitis
            natus vero voluptatum, earum sequi eos inventore assumenda
            voluptates omnis labore deleniti, sint temporibus quasi veniam a
            quod! Suscipit tenetur voluptas hic perferendis illum repellat,
            exercitationem quo, deserunt voluptatibus accusamus modi adipisci
            cumque? Lorem ipsum dolor sit
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
    margin: responsiveScreenHeight(2),
    borderRadius: 10,
    marginBottom: responsiveScreenHeight(2),
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
    margin: responsiveScreenHeight(2),
    color: 'black',
    textAlign: 'justify',
    lineHeight: 22,
    letterSpacing:0.7,
    fontWeight: '300'
  },
});

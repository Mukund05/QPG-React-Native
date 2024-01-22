import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../utils/Header'
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions'

const PrivacyPolicy:React.FC<{navigation:any}> = ({navigation}) => {
  return (
    <>
    <Header
      title="Privacy Policy"
      leftIcon="menu"
      onPressLeftIcon={() => navigation.openDrawer()}
      bgColor="blue"
    />
    <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.header}>Privacy Policy</Text>
        <Text style={styles.content}>
          This is a demo project for the purpose of learning React Native.
        </Text>
      </View>
    </ScrollView>
    </>
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
    margin: responsiveScreenHeight(2),
    borderRadius: 10,
  },
  header: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
    margin: responsiveScreenHeight(2),
    color: "#2483ff",
  },
  content:{
    fontSize: responsiveFontSize(2),
    margin: responsiveScreenHeight(2),
    color: "black",
    fontWeight: '300',
    lineHeight: 22,
    textAlign: 'justify',
    letterSpacing: 0.5,
  }
})
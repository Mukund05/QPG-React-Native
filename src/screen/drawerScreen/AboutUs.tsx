import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../utils/Header'

const AboutUs:React.FC<{navigation:any}> = ({navigation}) => {
  return (
    <>
    <Header
      title="About Us"
      leftIcon="menu"
      onPressLeftIcon={() => navigation.openDrawer()}
      bgColor="blue"
    />
    <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.header}>About Us</Text>
        <Text style={styles.content}>
          This is a demo project for the purpose of learning React Native.
        </Text>
      </View>
    </ScrollView>
    </>
  )
}

export default AboutUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
    margin:20,
    borderRadius: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: "#2483ff",
  },
  content:{
    fontSize: 16,
    margin: 20,
    color: "black",
  }
})
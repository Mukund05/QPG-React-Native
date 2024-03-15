import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import PDFViewer from './VidPdfLogix.tsx/PDFViewer';
import Header from '../../../../utils/Header';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';

const Ebook: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  // const Ebooks = undefined;
  const {data} = route.params;
  // console.log("ebook screen",data);

  return (
    <>
      <Header
        title="E-Books"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
        rightIcon="home"
        onPressRightIcon={() => navigation.navigate('Dashboard')}
      />
      <ScrollView style={styles.container}>
        {data ? (
          <View style={styles.pdfContainer}>
            <PDFViewer pdfs={data} navigation={navigation} screen={'book'} />
          </View>
        ) : (
          <View>
            <Text style={styles.content}>No Ebooks Found!</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Ebook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    color: 'lightgrey',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.5),
    marginTop: responsiveScreenHeight(40),
  },
  pdfContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    marginVertical: responsiveScreenHeight(2),
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    objectFit: 'cover',
  },
});

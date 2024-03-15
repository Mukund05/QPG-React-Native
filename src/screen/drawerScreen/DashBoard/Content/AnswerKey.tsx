import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import PDFViewer from './VidPdfLogix.tsx/PDFViewer';
import Header from '../../../../utils/Header';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';

const AnswerKey: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {data}:any = route.params;
  console.log(data);

  const {className, subjectName} = route.params;
  //instead of className and subjectName, we need to take the pdfs from the api and display them here
  return (
    <>
    <Header
        title="Answer Key"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
        rightIcon='home'
        onPressRightIcon={() => navigation.navigate('Dashboard')}
      />
    <ScrollView style={styles.container}>
      {data ? (
        <View style={styles.pdfContainer}>
          <PDFViewer pdfs={data} navigation={navigation} screen={'pdf'} />
        </View>
      ) : (
        <View>
          <Text style={styles.content}>No Answer Key Found!</Text>
        </View>
      )}
    </ScrollView>
    </>
  );
};

export default AnswerKey;

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
    marginVertical: responsiveScreenHeight(1),
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: responsiveScreenHeight(1),
    overflow: 'hidden',
    objectFit: 'cover',
  },
});

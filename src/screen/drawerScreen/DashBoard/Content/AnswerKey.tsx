import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import PDFViewer from './VidPdfLogix.tsx/PDFViewer';
import Header from '../../../../utils/Header';

const AnswerKey: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {answerKey}:any = route.params;
  // console.log(answerKey);

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
      {answerKey.length > 0 ? (
        <View style={styles.pdfContainer}>
          <PDFViewer pdfs={answerKey} navigation={navigation} screen={'pdf'} />
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
    fontSize: 20,
    marginTop: 20,
  },
  pdfContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    marginVertical: 5,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    objectFit: 'cover',
  },
});

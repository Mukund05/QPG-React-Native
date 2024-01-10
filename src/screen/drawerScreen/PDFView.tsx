import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import Pdf from 'react-native-pdf';
import Header from '../../utils/Header';

const PdfView: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {pdfUrl, screen} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Header
        title="View PDF"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
      />

      <Pdf
        style={styles.pdfs}
        horizontal={true}
        source={{
          uri: `https://bwptestpapers.com/public/${screen}/${pdfUrl}`,
          cache: true,
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          setIsLoading(false);
        }}
        trustAllCerts={false}
        onError={(error: any) => {
          setError(error);

        }}
        enablePaging={true}
        renderActivityIndicator={() => {
          return <ActivityIndicator size="large" color="blue" />;
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    height: '100%',
    zIndex: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  pdfContainer: {
    flex: 1,
    width: '100%',
  },
  pdfs: {
    flex: 1,
    width: '100%',
    height: '100%',
    // marginVertical: 5,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export default PdfView;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';

interface PDFViewerProps {
  pdfs: {
    PdfID : number;
    ClassID: number;
    SubjectID: number;
    Title: string;
    Pdf: string;
    PdfStatus: number;
    created_at: string;
    updated_at: string;
    BookID: number;   //only for ebook screen
    Book: string;     //only for ebook screen
  }[];
}

const PDFViewer: React.FC<
  PDFViewerProps & {navigation: any; screen: string}
> = ({pdfs, navigation, screen}) => {
  // const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePdfClick = (Pdf: string) => {
    // setSelectedPdf(pdfId);
    navigation.navigate('Pdf View',{pdfUrl: Pdf, screen: screen});
  };

  return (
    <View style={styles.container}>
      {pdfs?.map(pdf => (
        <TouchableOpacity
          key={screen==='book' ? pdf.BookID :pdf.PdfID}
          onPress={() => handlePdfClick(screen==='book' ? pdf.Book :pdf.Pdf)}
          style={styles.pdfItem}>
          <View style={styles.pdfInfo} >
            <Icon name="file-pdf-o" size={responsiveFontSize(20)} color="red" />
            <Text style={styles.pdfTitle} numberOfLines={2} ellipsizeMode='tail'>{screen==='book' ? pdf.Title :pdf.Title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    gap: 10,
    backgroundColor: 'transparent',
    marginVertical: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pdfItem: {
    overflow: 'hidden',
    // position: 'relative',
    width: responsiveScreenWidth(43),
    height: responsiveScreenHeight(24),
    backgroundColor: 'transparent',
    borderRadius: responsiveScreenHeight(1),
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: -3,
    // },
    // shadowColor: '#000000',
    // elevation: 5,
    // shadowOpacity: 1.0,
    marginBottom: responsiveHeight(1),
    margin: 10,
  },
  pdfInfo: {
    alignSelf: 'center',
  },
  pdfTitle: {
    fontSize: responsiveFontSize(1.9),
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: responsiveHeight(1),
    maxWidth: '90%'
  },
  desc: {
    fontSize: responsiveFontSize(1.2),
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default PDFViewer;

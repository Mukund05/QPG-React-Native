// DigitalContentScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import {getEbooks, getPdfs, getVideos} from '../../../api/api';
import {fetchUser, fetchtoken} from '../../../utils/fetchItem';
import Header from '../../../utils/Header';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';

const DigitalContentScreen: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {classId, SubjectID,className,subjectName} = route.params;

  // console.log(classId,SubjectID)
  const [video, setVideo] = useState<any>([]);
  const [ebook, setEbook] = useState<any>([]);
  const [answerKey, setAnswerKey] = useState<any>([]);
  const [userrole, setUserRole] = useState<any>(3);
  const [clicked,setClicked] = useState<boolean>(false)
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = await fetchtoken();
        const response = await getVideos(token, classId, SubjectID);
        setVideo(response.data.success === 'false' ? [] : response.data);
      } catch (error) {
        console.log('Error Fetching Video', error);
      }
    };

    const fetchEbook = async () => {
      try {
        const token = await fetchtoken();
        const response = await getEbooks(token, classId, SubjectID);
        setEbook(response.data.success === 'false' ? [] : response.data);
      } catch (error) {
        console.log('Error Fetching Ebook', error);
      }
    };

    const fetchPdf = async () => {
      try {
        const token = await fetchtoken();
        const response = await getPdfs(token, classId, SubjectID);
        setAnswerKey(response.data.success === 'false' ? [] : response.data);
      } catch (error) {
        console.log('Error Fetching Ebook', error);
      }
    };

    const fetchRole = async () => {
      const {role} = await fetchUser();
      setUserRole(role);
    };

    fetchRole();
    fetchVideo();
    fetchEbook();
    fetchPdf();
  }, []);

  const handlePress =async (screen:any,data:any) => {
    console.log(data)
    if(data===undefined || data.length===0){
      setClicked(true)
      Toast.show({
        type:'success',
        text1: `No ${screen} Found!`,
        visibilityTime: 1500,
        position: 'top'
      })
    }else{
      setClicked(false);
      // console.log('Data:',data)
      navigation.navigate(screen, {data})
    }
  } 

  return (
    <>
      <Header
        title={`${subjectName}`}
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
        rightIcon="home"
        onPressRightIcon={() => navigation.navigate('Dashboard')}
      />
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.item,{backgroundColor:'#A1EEBD'}]}
            onPress={()=>handlePress('Animations',video)}>
            <Image
              style={styles.image}
              source={require('../../../assets/images/animated_videos.png')}
            />
            <Text style={[styles.text,{color:'black'}]}>Animation</Text>
            <Image
              style={styles.rightIcon}
              source={require('../../../assets/images/Back.png')}
            />
          </TouchableOpacity>

          {userrole === 3 ? (
            <>
              <TouchableOpacity
                style={styles.item}
                onPress={() => handlePress('E-Books', ebook)}>
                <Image
                  style={styles.image}
                  source={require('../../../assets/images/e_book.png')}
                />
                <Text style={styles.text}>E-Books</Text>
                <Image
                  style={styles.rightIcon}
                  source={require('../../../assets/images/Back.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={() => handlePress('Answer Key', answerKey)}>
                <Image
                  style={styles.image}
                  source={require('../../../assets/images/test_paper.png')}
                />
                <Text style={styles.text}>Answer Key</Text>
                <Image
                  style={styles.rightIcon}
                  source={require('../../../assets/images/Back.png')}
                />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
  },
  item: {
    backgroundColor: '#A1EEBD',
    borderRadius: 5,
    padding: responsiveScreenHeight(2),
    margin: responsiveScreenHeight(1),
    width: '90%',
  },
  text: {
    color: 'black',
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    marginLeft: responsiveScreenHeight(10),
  },
  image: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenHeight(5),
    alignSelf: 'center',
    position: 'absolute',
    top: 10,
    left: 20,
  },
  rightIcon: {
    width: responsiveScreenWidth(8),
    height: responsiveScreenHeight(2),
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 25,
    right: 20,
  },
});

export default DigitalContentScreen;

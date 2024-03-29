// SubjectsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {getSubjects} from '../../../api/api';
import {fetchtoken} from '../../../utils/fetchItem';
import Header from '../../../utils/Header';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const SubjectsScreen: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {classId,className} = route.params; // Class name from previous screen (ClassesScreen)

  // const [loader, setLoader] = React.useState<boolean>(false);
  const [subject, setSubject] = React.useState<
    {
      SubjectID: number;
      ClassID: number;
      SubjectName: string;
      SubjectStatus: number;
      SubjectMedium: string;
      created_at: string;
      updated_at: string;
      CreatedBy: number;
      UpdatedBy: number;
    }[]
  >([]);

  React.useEffect(() => {
    const fetchSubject = async () => {
      try {
        // setLoader(true);
        const token = await fetchtoken();
        const response = await getSubjects(token as string, classId as string);
        setSubject(response.data);
        // setLoader(false);
      } catch (error) {
        console.log('Subject Screen', error);
        // setLoader(false);
      }
    };
    fetchSubject();
  }, []);

  const handleSubjectPress = (SubjectID: Number,subjectName:string) => {
    // console.log('Subject Screen', SubjectID);
    navigation.navigate('Digital Content', {classId, SubjectID,className,subjectName});
  };

  // if (loader) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <>
      <Header
        title="Subjects"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
        rightIcon='home'
        onPressRightIcon={() => navigation.navigate('Dashboard')}
      />
      <ScrollView>
        <View style={styles.container}>
          {subject.map(item => (
            <TouchableOpacity
              key={item.SubjectID}
              style={styles.item}
              onPress={() => handleSubjectPress(item.SubjectID,item.SubjectName)}>
              <Icon
                name="open-book"
                style={styles.icon}
                size={30}
                color="black"
              />
              <Text style={styles.text}>{item.SubjectName}</Text>
            </TouchableOpacity>
          ))}
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
  },
  item: {
    backgroundColor: '#A1EEBD',
    borderRadius: 5,
    padding: responsiveScreenHeight(2.2),
    margin: responsiveScreenHeight(1),
    width: '90%',
  },
  text: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginLeft: responsiveScreenWidth(12),
  },
  icon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default SubjectsScreen;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  ViewToken,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {getClasses} from '../../../api/api';
import {fetchtoken} from '../../../utils/fetchItem';
import Header from '../../../utils/Header';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {ListItem} from '../../../Animation/ListItem';
import {useSharedValue} from 'react-native-reanimated';

const ClassesScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [classes, setClasses] = useState<
    {ClassID: string; ClassName: string}[]
  >([]);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  // const [loader, setLoader] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        // setLoader(true);
        const token = await fetchtoken();
        const response = await getClasses(token as string);
        setClasses(response.data);

        // setLoader(false);
      } catch (error) {
        console.log('Class Screen', error);
        // setLoader(false);
      }
    };
    fetchClass();
  }, []);

  const handleClassPress = (classId: string, className: string) => {
    navigation.navigate('Subjects', {classId, className});
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
        title="Classes"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
      />
      {/* <ScrollView>
        <View style={styles.container}>
          {classes?.map(item => (
            <TouchableOpacity
              key={item.ClassID}
              style={styles.item}
              onPress={() => handleClassPress(item.ClassID, item.ClassName)}>
              <FontAwesome5Icon
                style={styles.icon}
                name="book"
                size={20}
                color="black"
              />
              <Text style={styles.text}>{item.ClassName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView> */}
      <FlatList
        data={classes}
        contentContainerStyle={{paddingVertical: 20}}
        onViewableItemsChanged={({viewableItems: vItems}) => {
          viewableItems.value = vItems;
        }}
        renderItem={({item}) => {
          return (
            <ListItem
              item={item}
              viewableItems={viewableItems}
              handleClassPress={handleClassPress}
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  item: {
    backgroundColor: '#A1EEBD',
    borderRadius: 5,
    width: '90%',
    padding: responsiveScreenHeight(2),
    margin: responsiveScreenHeight(1),
  },
  text: {
    color: 'black',
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default ClassesScreen;

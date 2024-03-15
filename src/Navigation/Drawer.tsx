// src/navigation/DashboardNavigator.tsx
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import {
  Profile,
  DashboardScreen,
  AboutUs,
  DirectorMessage,
  PunchScreen,
  ContactUs,
  PrivacyPolicy,
  Help,
  ShareApp,
} from '../screen/drawerScreen/Index';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar, Title} from 'react-native-paper';
import {Alert, StyleSheet, Text, View} from 'react-native';
import ChangePasswordScreen from '../screen/drawerScreen/Profile/ChangePassword/ChangePassword';
import ClassesScreen from '../screen/drawerScreen/DashBoard/ClassScreen';
import SubjectsScreen from '../screen/drawerScreen/DashBoard/SubjectScreen';
import DigitalContentScreen from '../screen/drawerScreen/DashBoard/DigitalContent';
import Animation from '../screen/drawerScreen/DashBoard/Content/Animation';
import Ebook from '../screen/drawerScreen/DashBoard/Content/Ebook';
import AnswerKey from '../screen/drawerScreen/DashBoard/Content/AnswerKey';
import PDFView from '../screen/drawerScreen/PDFView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image_Base_Url, logoutUser} from '../api/api';
import {fetchUser} from '../utils/fetchItem';
import {useSelector} from 'react-redux';
import OrderPage from '../screen/drawerScreen/manageOrder/OrderPage';
import OrderDetails from '../screen/drawerScreen/manageOrder/OrderDetails';
import AddSchool from '../screen/drawerScreen/manageSchool/AddSchool';
import OrderHistory from '../screen/drawerScreen/manageOrder/OrderHistory';
import ViewHistory from '../screen/drawerScreen/manageOrder/ViewHistory';
import SubmitReport from '../screen/drawerScreen/SubmitReport';
import ViewSchool from '../screen/drawerScreen/manageSchool/ViewSchool';
import EditSchool from '../screen/drawerScreen/manageSchool/EditSchool';
import Toast from 'react-native-toast-message';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReportDetails from '../screen/drawerScreen/ReportDetails';

const Drawer = createDrawerNavigator();

type DrawerItem = {
  label: string;
  icon: string;
  navigateTo: string;
};

const DrawerList: DrawerItem[] = [
  {
    label: 'Dashboard',
    icon: 'home',
    navigateTo: 'Dashboard',
  },
  {
    label: 'Profile',
    icon: 'user',
    navigateTo: 'Complete Your Profile',
  },
  {
    label: 'Manage Order',
    icon: 'edit-3',
    navigateTo: 'Order History',
  },
  {
    label: 'Report Details',
    icon: 'file-text',
    navigateTo: 'Report Details',
  },
  {
    label: 'Manage School',
    icon: 'plus-circle',
    navigateTo: 'View Schools',
  },
  {
    label: 'About Us',
    icon: 'info',
    navigateTo: 'About Us',
  },
  {
    label: 'Director Message',
    icon: 'message-circle',
    navigateTo: 'Director Message',
  },
  {
    label: 'Contact Us',
    icon: 'phone',
    navigateTo: 'Contact Us',
  },
  {
    label: 'Privacy Policy',
    icon: 'book',
    navigateTo: 'Privacy Policy',
  },
  {
    label: 'Help',
    icon: 'help-circle',
    navigateTo: 'Help',
  },
  {
    label: 'Share App',
    icon: 'share',
    navigateTo: 'Share App',
  },
];

const DrawerLayout: React.FC<{
  icon: any;
  label: string;
  navigateTo: string;
}> = ({icon, label, navigateTo}) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    const isPunchIn = await AsyncStorage.getItem('punchIn');
    if (isPunchIn === 'true') {
      Alert.alert(
        'Punch In',
        'You are currently punched in. Please punch out to logout.',
      );
      return;
    }
    await AsyncStorage.removeItem('punchIn');
    Alert.alert('Signout', 'Are you sure you want to Signout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');

            // Check if token exists before making the API call
            if (token) {
              // Make your API call to logout here, using the bearer token
              const response = await logoutUser(token);

              if (response.status === 200) {
                console.log('Logout successful');
              } else {
                console.log('Logout failed');
              }

              // Remove the token from AsyncStorage
              await AsyncStorage.removeItem('token');

              // Remove user data if 'remember' is not true
              const {remember} = await fetchUser();

              if (!remember) {
                await AsyncStorage.removeItem('user');
              }
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen' as never}],
              });
              Toast.show({
                type: 'success',
                text1: 'Logout Success',
                position: 'top',
              });
            }
          } catch (error) {
            console.error('Error during logout:', error);
          }
        },
      },
    ]);
  };

  return (
    <DrawerItem
      icon={({color, size}) => <Icon name={icon} color={color} size={size} />}
      label={label}
      onPress={() =>
        label === 'Sign Out'
          ? handleLogout()
          : navigation.navigate(navigateTo as never)
      }
    />
  );
};

const DrawerItemList: React.FC = () => {
  const {role} = useSelector((state: any) => state?.user?.user);

  //check user role and show drawer list accordingly
  return DrawerList.map((item, index) => {
    if (role === 'Admin' || role === 'Manager' || role === 'Executive') {
      return (
        <DrawerLayout
          key={index}
          icon={item.icon}
          label={item.label}
          navigateTo={item.navigateTo}
        />
      );
    } else {
      if (item.label === 'Manage Order' || item.label === 'Manage School' || item.label === 'Report Details') {
        return null;
      } else {
        return (
          <DrawerLayout
            key={index}
            icon={item.icon}
            label={item.label}
            navigateTo={item.navigateTo}
          />
        );
      }
    }
  });
};

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Complete Your Profile" component={Profile} />
      <Stack.Screen name="About Us" component={AboutUs} />
      <Stack.Screen name="Director Message" component={DirectorMessage} />
      <Stack.Screen name="Punch Screen" component={PunchScreen} />
      <Stack.Screen name="Contact Us" component={ContactUs} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicy} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Share App" component={ShareApp} />
      <Stack.Screen name="Change Password" component={ChangePasswordScreen} />
      <Stack.Screen name="Classes" component={ClassesScreen} />
      <Stack.Screen name="Subjects" component={SubjectsScreen} />
      <Stack.Screen name="Digital Content" component={DigitalContentScreen} />
      <Stack.Screen name="Animations" component={Animation} />
      <Stack.Screen name="E-Books" component={Ebook} />
      <Stack.Screen name="Answer Key" component={AnswerKey} />
      <Stack.Screen name="Pdf View" component={PDFView} />
      <Stack.Screen name="Order Page" component={OrderPage} />
      <Stack.Screen name="Order Details" component={OrderDetails} />
      <Stack.Screen name="Add School" component={AddSchool} />
      <Stack.Screen name="Order History" component={OrderHistory} />
      <Stack.Screen name="View History" component={ViewHistory} />
      <Stack.Screen name="SubmitReport" component={SubmitReport} />
      <Stack.Screen name="View Schools" component={ViewSchool} />
      <Stack.Screen name="Edit School" component={EditSchool} />
      <Stack.Screen name="Report Details" component={ReportDetails} />
    </Stack.Navigator>
  );
};

const DrawerContent: React.FC = props => {
  const user = useSelector((state: any) => state.user?.user);
  // console.log(user)
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('Complete Your Profile' as never)
            }>
            <View style={styles.userInfoSection}>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Avatar.Image
                  source={{
                    uri: user?.profile_pic
                      ? `${Image_Base_Url + user.profile_pic}`
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC',
                  }}
                  size={50}
                  style={{marginTop: 5}}
                />
                <View style={{marginLeft: 10, flexDirection: 'column'}}>
                  <Title style={styles.title}>{user?.name}</Title>
                  <Text style={styles.caption} numberOfLines={1}>
                    {user?.email}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.drawerSection}>
            <DrawerItemList />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerLayout
          icon="log-out"
          label="Sign Out"
          navigateTo="LoginScreen"
        />
      </View>
    </View>
  );
};

const DashboardNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerContent />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="StackNav" component={StackNavigation} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    padding: responsiveScreenHeight(1.4),
    backgroundColor: 'skyblue',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: responsiveFontSize(2),
    marginTop: responsiveScreenHeight(0.4),
    fontWeight: 'bold',
  },
  caption: {
    fontSize: responsiveFontSize(1.5),
    lineHeight: 14,
    color: '#6e6e6e',
    width: '100%',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: responsiveScreenWidth(4),
  },
  drawerSection: {
    paddingTop: responsiveScreenHeight(1),
    height: '100%',
  },
  bottomDrawerSection: {
    paddingBottom: responsiveScreenHeight(1.3),
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    backgroundColor: '#554994',
  },
});

export default DashboardNavigator;

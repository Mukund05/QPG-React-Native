import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {Image_Base_Url, updateProfile} from '../../../api/api';
import {fetchtoken} from '../../../utils/fetchItem';
import {useToast} from 'react-native-toast-notifications';
import {setUser} from '../../../store/Features/UserSlice';
import Header from '../../../utils/Header';
import Toast from 'react-native-toast-message';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import RNScreenshotPrevent from 'react-native-screenshot-prevent';

const Profile: React.FC<{navigation: any}> = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState(user ? user.contact_no : '');
  const [role, setRole] = useState(user ? user.role : '');
  const [image, setImage] = useState('');
  const profileImage = user ? user.profile_pic : undefined;

  const [loader, setLoader] = useState(false);
  //camera permission when clicking camera icon

  const toast = useToast();
  const handleUpdateProfile = async () => {
    if (name === '') {
      Toast.show({
        type: 'warning',
        text1: 'Please enter your name',
        visibilityTime: 1500,
        position: 'top',
      });
      return;
    }
    // Implement your update profile logic here
    const profileData = new FormData();
    profileData.append('name', name);
    if (email != '') {
      profileData.append('email', email);
    }
    profileData.append('contact_no', contactNo);
    if (image) {
      profileData.append('profile_pic', {
        uri: image,
        name: 'profile_pic',
        type: 'image/jpg',
      });
    }

    const userId = user ? user.id : 0;
    const token = await fetchtoken();

    if (userId && token) {
      try {
        setLoader(true);

        const response = await updateProfile(token, userId, profileData);

        if (response.data.status === 1) {
          setLoader(false);
          Toast.show({
            type: 'success',
            text1: 'Profile updated successfully',
            visibilityTime: 1500,
            position: 'top',
          })

          const updatedUser = {
            ...user,
            ...response.data,
          };
          dispatch(setUser(updatedUser));
          return;
        }
      } catch (error) {
        console.log('Error updating profile:', error);
      } finally {
        setLoader(false);
      }
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('Change Password');
  };

  const handleImage = async () => {
    try {
      const galleryPermission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;

      const permissionResult = await request(galleryPermission);
      if(permissionResult === RESULTS.DENIED){
        console.log('Gallery permission Rejected');
        return ;
      }
      const response = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      const compressedImage: string = response.path;

      setImage(compressedImage);
    } catch (error) {
      console.log('Gallery Permission Error:', error);
    }
  };

  const handleCamera = async () => {
    try {
      const cameraPermission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;

      const permissionResult = await request(cameraPermission);

      if (permissionResult === RESULTS.GRANTED) {
        console.log('Camera permission granted');

        const response = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });

        setImage(response.path);
      }
    } catch (error) {
      console.log('Camera Permission Error:', error);
    }
  };
  //prevent taking screenshot
  RNScreenshotPrevent.enabled(true)
  if (!__DEV__) RNScreenshotPrevent.enableSecureView()
  useEffect(()=>{
    return () => {
      RNScreenshotPrevent.enabled(false)
      if (!__DEV__) RNScreenshotPrevent.disableSecureView()
    }
  },[])
  return (
    <SafeAreaView>
      <Header
        title="Complete Your Profile"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Image at the top center */}
          <View style={styles.profile}>
            <TouchableOpacity onPress={handleImage}>
              {image || profileImage ? (
                <Image
                  style={styles.profileImage}
                  source={
                    image
                      ? {uri: image}
                      : {uri: `${Image_Base_Url + profileImage}`}
                  }
                />
              ) : (
                <Image
                  style={styles.profileImage}
                  source={require('./user.jpg')}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.camera} onPress={handleCamera}>
              <Icon name="camera" size={28} color="#D8D8D8" />
            </TouchableOpacity>
          </View>

          {/* Change Password link */}
          <TouchableOpacity
            style={styles.changePasswordLink}
            onPress={handleChangePassword}>
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>

          {/* Text inputs for name, email, contact no, and role */}
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="black"
          />
          <TextInput
            style={styles.input}
            value={email ? email : user.email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="black"
            editable={false}
          />
          <TextInput
            style={styles.input}
            value={contactNo}
            onChangeText={setContactNo}
            placeholder="Contact No"
            placeholderTextColor="black"
            editable={false}
          />
          <TextInput
            style={styles.input}
            value={role}
            editable={false}
            placeholder="Role"
            placeholderTextColor="black"
          />

          {/* Update Profile button */}
          <TouchableOpacity
            style={styles.updateProfileButton}
            onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  changePasswordLink: {
    marginBottom: 20,
    alignSelf: 'flex-end',
    marginEnd: 40,
  },
  changePasswordText: {
    color: 'blue',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  input: {
    height: 55,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
  },
  updateProfileButton: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
    width: '90%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  profile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  camera: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#270082',
    borderRadius: 50,
    padding: 5,
    margin: 5,
  },
});

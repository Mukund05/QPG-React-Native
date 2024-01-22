import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {changePassword} from '../../../../api/api';
import {fetchtoken} from '../../../../utils/fetchItem';
import PasswordInput from './PasswordInput'; // Make sure to import the PasswordInput component
import Header from '../../../../utils/Header';
import Toast from 'react-native-toast-message';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

const ChangePasswordScreen: React.FC<{navigation: any}> = ({navigation} ) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const Toast = useToast();

  const handleUpdateProfile = async () => {
    // Add your logic for updating the changing password
    if (
      oldPassword.trim() === '' ||
      newPassword.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      Toast.show({
        type: 'warning',
        text1: 'Please fill all the fields',
        visibilityTime: 1500,
        position: 'top',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'warning',
        text1: 'Password does not match',
        visibilityTime: 1500,
        position: 'top',
      })
      return;
    }

    if (oldPassword === newPassword || oldPassword === confirmPassword) {
      Toast.show({
        type: 'warning',
        text1: 'New Password cannot be same as old password',
        visibilityTime: 1500,
        position: 'top',
      })
      return;
    }

    try {
      const token = await fetchtoken();
      const response = await changePassword(token, oldPassword, newPassword);

      if (response.data.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Password changed successfully',
          visibilityTime: 1500,
          position: 'top',
        })

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response.data.message,
        visibilityTime: 1500,
        position: 'top',
      })
    }
  };

  return (
    <>
    <Header
      title="Change Password"
      leftIcon="arrow-back"
      onPressLeftIcon={() => navigation.goBack()}
      bgColor="blue"
      rightIcon="home"
      onPressRightIcon={() => navigation.navigate('Dashboard')}
    />
    <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Image at the top center */}
        <Image style={styles.profileImage} source={require('../user.jpg')} />

        {/* Text inputs for name, email, contact no, and role */}
        <PasswordInput
          label="Current Password"
          value={oldPassword}
          onChangeText={text => setOldPassword(text)}
          placeholder="Current Password"
        />
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={text => setNewPassword(text)}
          placeholder="New Password"
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          placeholder="Confirm Password"
        />

        <TouchableOpacity
          style={styles.updateProfileButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
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
    marginTop: responsiveScreenHeight(2),
  },
  profileImage: {
    width: responsiveScreenWidth(40),
    height: responsiveScreenHeight(17),
    borderRadius: 75,
    marginBottom: responsiveScreenHeight(2),
  },
  updateProfileButton: {
    backgroundColor: 'blue',
    padding: responsiveScreenHeight(2),
    borderRadius: 5,
    width: '90%',
    marginTop: responsiveScreenHeight(2),
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default ChangePasswordScreen;

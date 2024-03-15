import React, {ReactNode} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
const {width, height} = Dimensions.get('window');

interface HeaderProps {
    leftIcon?: any;
    rightIcon?: any;
    title?: string;
    onPressLeftIcon?: () => void;
    onPressRightIcon?: () => void;
    bgColor?: string;
    headerTitleColor?: string;
    children?: ReactNode;
  }

const Header: React.FC<HeaderProps> = ({
  leftIcon,
  rightIcon,
  title,
  onPressLeftIcon,
  onPressRightIcon,
  bgColor,
  headerTitleColor,
  children,
}) => {
  const user = useSelector((state:any) => state.user);
  // console.log(user.user)
  return (
    <SafeAreaView>
      <View
        style={[styles.header, {backgroundColor: bgColor ? 'blue' : bgColor}]}>
        <Icon
          name={leftIcon}
          size={30}
          color="white"
          style={{marginRight: 'auto'}}
          onPress={onPressLeftIcon}
        />

        <Text style={[styles.headerTitle, {color: headerTitleColor?headerTitleColor:'white'}]} numberOfLines={1} ellipsizeMode='tail'>
          {title}
        </Text>

        <Icon
          name={rightIcon}
          size={30}
          color="white"
          style={{marginLeft: 'auto'}}
          onPress={onPressRightIcon}
        />
        {(user.user.role_id!==0 && user.user.role_id!==1) && children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: width,
    height: height*0.07,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    maxWidth: '60%'
    
  },
});

export default Header;

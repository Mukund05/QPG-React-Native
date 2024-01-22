import {Text} from 'react-native';
import {View} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {BaseToast, ErrorToast} from 'react-native-toast-message';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesginIcon from "react-native-vector-icons/AntDesign";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green'}}
      contentContainerStyle={{paddingHorizontal: 10}}
      text1Style={{
        fontSize: responsiveFontSize(2),
        fontWeight: '500',
      }}
      text2Style={{
        fontSize: responsiveFontSize(1.5),
        fontWeight: '400',
      }}
      renderLeadingIcon={() => (
        <FeatherIcon
          name="check-circle"
          color={'green'}
          style={{
            fontSize: 34,
            alignSelf: 'center',
            marginHorizontal: 10,
          }}
        />
      )}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: responsiveFontSize(2),
      }}
      text2Style={{
        fontSize: responsiveFontSize(1.5),
      }}
      swipeable={'true'}
      style={{borderLeftColor: 'red'}}
      contentContainerStyle={{paddingHorizontal: 10}}
      renderLeadingIcon={() => (
        <MaterialIcon
          name="error"
          color={'red'}
          style={{
            fontSize: 34,
            alignSelf: 'center',
            marginHorizontal: 10,
          }}
        />
      )}
    />
  ),

  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'orange'}}
      contentContainerStyle={{paddingHorizontal: 10}}
      text1Style={{
        fontSize: responsiveFontSize(2),
        fontWeight: '400',
      }}
      renderLeadingIcon={() => (
        <AntDesginIcon
          name="exclamationcircleo"
          color={'orange'}
          style={{
            fontSize: 34,
            alignSelf: 'center',
            marginHorizontal: 10,
          }}
        />
      )}
    />
  ),

  tomatoToast: (props: any) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{props.text1}</Text>
    </View>
  ),
};

export default toastConfig;

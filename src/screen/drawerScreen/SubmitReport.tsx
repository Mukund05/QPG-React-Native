import {View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, { useEffect, useRef } from 'react';
import Header from '../../utils/Header';
import { getAllSchools, sendRemarks } from '../../api/api';
import { fetchtoken } from '../../utils/fetchItem';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useToast } from 'react-native-toast-notifications';
import Toast from 'react-native-toast-message';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const SubmitReport: React.FC<{navigation: any}> = ({navigation}) => {
    const [school,setSchool] = React.useState<any>([]);
    const [schoolName,setSchoolName] = React.useState<any>([]);
    const [remarks,setRemarks] = React.useState<any>('');
    const toast = useToast()
    const fetchSchool = async () => {
      const token = await fetchtoken();
      const data = await getAllSchools(token);
      setSchool(data?.data);
    }

    useEffect(()=>{
      fetchSchool();
    },[])

    const handlesubmitReport =async () => {
      if(remarks === ''){
        Toast.show({
          type: 'warning',
          text1: 'Please enter remark',
          visibilityTime: 1500,
          position: 'top',
        });
      }
      // console.log('Report submitted',remarks);
      const token =await fetchtoken();
      sendRemarks(token,schoolName?.id,schoolName?.user_id,remarks).then((res) => {
        console.log('res',res);
        if(res?.status === true){
          Toast.show({
            type: 'success',
            text1: 'Report submitted successfully',
            visibilityTime: 1500,
            position: 'top',
          })
          navigation.goBack();
        }
      }).catch((err) => {
        console.log('err',err);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          visibilityTime: 1500,
          position: 'top',
        })
      })
    }

    const schoolSheetRef: any = useRef();

  return (
    <>
      <Header
        title="Submit Report"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor='blue'
      />
       <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.screenContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>School Name</Text>
            </View>
            {/* add school list using react native raw bottom sheet */}
            <TouchableOpacity onPress={() => schoolSheetRef.current?.open()}>
              <TextInput
                placeholder="Select School"
                placeholderTextColor="grey"
                style={styles.input}
                value={schoolName?.name ?? "Select School"}
                editable={false}
              />
            </TouchableOpacity>
            <RBSheet
              ref={schoolSheetRef as any}
              closeOnDragDown={true}
              closeOnPressMask={true}
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                },
                container: {
                  backgroundColor: '#113946',
                  borderBottomColor: 'black',
                  borderTopWidth: 2,
                },
              }}>              
              <ScrollView>
                {school.map((schoolItem: any) => (
                  <TouchableOpacity
                  key={schoolItem?.id}
                    onPress={() => {
                      setSchoolName(schoolItem);
                      schoolSheetRef.current?.close();
                    }}
                    style={styles.bottomContainer}>
                    <Text style={styles.filed}>{schoolItem.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </RBSheet>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Strength</Text>
            <TextInput
              style={styles.input}
              value={schoolName?.strength ?`${schoolName?.strength}` : "Strength"}
              placeholder="Strength"
              placeholderTextColor="grey"
              keyboardType="numeric"
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={schoolName?.email ? `${schoolName?.email}` : "Email ID"}
              onChangeText={()=>{}}
              placeholder="Enter Email ID"
              placeholderTextColor="grey"
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Person</Text>
            <TextInput
              style={styles.input}
              value={schoolName?.person ? `${schoolName?.person}` : "Contact Person Name"}
              onChangeText={()=>{}}
              placeholder="Contact Person Name"
              placeholderTextColor="grey"
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact No</Text>
            <TextInput
              style={styles.input}
              value={schoolName?.contact_no ? `${schoolName?.contact_no}` : "Contact No."}
              onChangeText={()=>{}}
              placeholder="Contact No."
              placeholderTextColor="grey"
              editable={false}
              maxLength={10}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={schoolName?.city ? `${schoolName?.city}` : "City"}
              onChangeText={()=>{}}
              placeholder="City"
              placeholderTextColor="grey"
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={schoolName?.state ? `${schoolName?.state}` : "State"}
              onChangeText={()=>{}}
              placeholder="Enter State"
              placeholderTextColor="grey"
              editable={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={schoolName?.country? `${schoolName?.country}` : "Country"}
              onChangeText={()=>{}}
              placeholder="Enter Country"
              placeholderTextColor="grey"
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Remark</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={remarks}
              onChangeText={(text) => setRemarks(text)}
              placeholder={"Enter Remark"}
              placeholderTextColor="grey"
              keyboardType='default'
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomViewContainer}>

        <TouchableOpacity style={styles.button} onPress={handlesubmitReport}>
          <View >
            <Text style={styles.buttonText}>Submit Report</Text>
          </View>
        </TouchableOpacity>

      </View>
    </>
  );
};

export default SubmitReport;

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    label: {
      fontSize: responsiveFontSize(2),
      marginBottom: 10,
      color: 'grey',
      fontWeight: '700',
    },
    input: {
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
      fontSize: responsiveFontSize(2),
      padding: 10,
      color: '#000',
    },
    bottomViewContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      paddingVertical: 20,
    },
    button: {
      marginHorizontal: 10,
      backgroundColor: '#000',
      padding: 10,
      borderRadius: 5,
      paddingHorizontal: 25,
      width:'90%'
    },
    buttonText: {
      color: '#fff',
      fontSize: responsiveFontSize(2.5),
      fontWeight: 'bold',
      textAlign:'center',
      letterSpacing:2,
      textTransform:'uppercase'
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filed: {
      color: 'white',
      fontSize: responsiveFontSize(2.4),
      fontWeight: 'bold',
      textTransform: 'capitalize',
      textAlign: 'center',
    },
    bottomContainer: {
      padding: 10,
      backgroundColor: '#1D5D9B',
      marginVertical: 5,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 10,
    },
    textArea: {
      textAlignVertical: 'top',  // This ensures the text starts from the top
      paddingTop: 10,  // Adjust the padding as needed
      height: 100,  // Set an initial height
      // Additional styles for the text area if needed
    }
  });

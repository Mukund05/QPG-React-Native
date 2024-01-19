import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../../utils/Header';
import RBSheet from 'react-native-raw-bottom-sheet';
import {fetchUser, fetchtoken} from '../../../utils/fetchItem';
import {
  getAllSchools,
  getClasses,
  getPrice,
  getSubjects,
} from '../../../api/api';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {useDispatch} from 'react-redux';
import {addOrder} from '../../../store/Features/OrderSlice';
import {useToast} from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const OrderPage: React.FC<{navigation: any}> = ({navigation}) => {
  const [schoolName, setSchoolName] = useState<any>('');
  const [className, setClassName] = useState<any>('');
  const [subject, setSubject] = useState<any>('');
  const [discount, setDiscount] = useState<any>('');
  const [price, setPrice] = useState<any>('');

  const [school, setSchool] = useState<any>([]);
  const [classes, setClasses] = useState<any>([]);
  const [subjects, setSubjects] = useState<any>([]);

  const [classID, setClassID] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');

  const [quantity, setQuantity] = useState<any>('1');

  const [total, setTotal] = useState<string>('');
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    // Increment the resetKey to trigger a re-render with initial state
    setResetKey((prevKey) => prevKey + 1);
  };

  const dispatch = useDispatch();
  const toast = useToast();
  // Fetch Token
  const getToken = async () => {
    try {
      return await fetchtoken();
    } catch (error) {
      console.log('ORDER PAGE::TOKEN FETCHING ERROR', error);
      throw error; // You might want to handle this error appropriately in your app
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = await getToken();
      if (!classID) return;
      const response = await getSubjects(token as string, classID);
      // console.log('Subjects API response:', response.data);
      setSubjects(response.data);
    } catch (error) {
      console.log('ORDER PAGE::SUBJECT FETCHING ERROR', error);
    }
  };

  const fetchPrice = async () => {
    // console.log('classID:', classID,'subjectId:', subjectId);
    try {
      const token = await getToken();
      if (!classID || !subjectId) return;
      const response = await getPrice(token as string, classID, subjectId);
      // console.log('Price API response:', response.data);
      setPrice(response.data);
    } catch (error) {
      console.log('ORDER PAGE::PRICE FETCHING ERROR', error);
    }
  };

  // Fetch Schools and classes
  useEffect(() => {
    // Fetch schools API and set the result to the schools state
    const fetchSchools = async () => {
      try {
        const token = await getToken();
        const response = await getAllSchools(token as string);
        setSchool(response.data);
      } catch (error) {
        console.log('ORDER PAGE::SCHOOL FETCHING ERROR', error);
      }
    };

    //Fetch classes API and set the result to the classes state
    const fetchClasses = async () => {
      try {
        const token = await getToken();
        const response = await getClasses(token as string);
        setClasses(response.data);
      } catch (error) {
        console.log('ORDER PAGE::CLASS FETCHING ERROR', error);
      }
    };

    fetchSchools();
    fetchClasses();
    if(classID) fetchSubjects();
    if(classID && subjectId) fetchPrice();
  }, []);

  // Fetch Subjects when className changes
  useEffect(() => {
    // console.log('classID:', classID);
    // console.log('subjectId:', subjectId)
  
    if (classID) fetchSubjects();
  }, [classID]);

  // Fetch Price when subject changes
  useEffect(() => {
    
    // console.log('classID:', classID,'subjectId:', subjectId);
    if (classID) fetchSubjects();
    if (classID && subjectId) fetchPrice();
  }, [classID, subjectId,triggerEffect]);

  // Calculate total amount when quantity or discount changes and set the result to the total state
  useEffect(() => {
    const totalAmount = price?.mrp * quantity;
    const discountAmount = totalAmount * (discount / 100);
    const finalAmount = totalAmount - discountAmount;
    // console.log('TOTAL AMOUNT',finalAmount);
    const roundedFinalAmount = finalAmount.toFixed(2);
    setTotal(roundedFinalAmount.toString());
  }, [discount, quantity, price]);

  useEffect(() => {
    // Reset all states when the resetKey changes
    setSchoolName('');
    setClassName('');
    setSubject('');
    setDiscount('');
    setPrice('');
    setQuantity('1');
    setTotal('');
    setTriggerEffect((prevValue) => !prevValue);
  }, [resetKey]);

  const ViewBook = () => {
    navigation.navigate('Order Details');
  };

  const handleSubmit = async () => {
    if (!price) {
      Alert.alert('Please Select Class and Subject');
      return;
    }

    //add validation on school name, class name and subject
    if (schoolName === '' || className === '' || subject === '') {
      Alert.alert('Please Enter Required Filed');
      return;
    }

    //add validation on discount
    if (Number(discount) > 100 || Number(discount) < 0) {
      Alert.alert('Please Enter Valid Discount');
      return;
    }

    const data = createData();

    // Retrieve existing data from AsyncStorage based on the user ID
    const {id} = await fetchUser(); // You need to implement a function to get the user ID

    try {
      const existingData = await AsyncStorage.getItem(id.toString());
      let newData = [];
      if (existingData) {
        // If there is existing data, parse it and append the new data
        newData = JSON.parse(existingData);
      }
      newData.push(data);

      // Save the updated data to AsyncStorage
      await AsyncStorage.setItem(id.toString(), JSON.stringify(newData));
    } catch (error) {
      // Handle the error appropriately, e.g., show an alert
      console.error('Error saving data to AsyncStorage:', error);
      toast.show('Error Saving Data', {
        type: 'danger',
        style: {width: '90%'},
      });
    }

    dispatch(addOrder(data)); //dispatch the data inside orderSlice
    // console.log(data);

    handleReset(); // Reset all states

    toast.show('Book Added Successfully', {
      type: 'success',
      style: {width: '90%'},
    });
    navigation.navigate("Order Page")
  };

  const createData = () => {
    const data: any = {};
    data['id']=uuidv4();
    data['SchoolItem'] = {
      label: schoolName,
      value: school.filter((item: any) => item.name === schoolName)[0].id,
    };
    data['ClassItem'] = {
      label: className,
      value: classID,
    };

    data['SubjecItem'] = {
      label: subject,
      value: subjectId,
    };

    (data['quantity'] = Number(quantity)),
      (data['discount'] = discount),
      (data['mrp'] = price);
    return data;
  };

  const handleQuantityUpdate = (type: string) => {
    if (type === 'increment') {
      setQuantity((prevQuantity: any) => {
        const newQuantity = Number(prevQuantity) + 1;

        return newQuantity.toString();
      });
    } else {
      setQuantity((prevQuantity: any) => {
        const newQuantity = Number(prevQuantity) - 1;

        return newQuantity.toString();
      });
    }
  };

  const schoolSheetRef: any = useRef();
  const classSheetRef: any = useRef();
  const subjectSheetRef: any = useRef();

  return (
    <>
      <Header
        title="Add Order"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
        children={
          <TouchableOpacity
            onPress={() => navigation.navigate('Order Details')}>
            <View style={{marginRight: 10}}>
              <Icon name="shopping-cart" size={25} color="white" />
            </View>
          </TouchableOpacity>
        }
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}> */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>School Name</Text>
              <Icon name="school" size={26} color="black" style={styles.icon} />
            </View>
            {/* add school list using react native raw bottom sheet */}
            <TouchableOpacity onPress={() => schoolSheetRef.current?.open()}>
              <TextInput
                placeholder="Select School"
                placeholderTextColor="grey"
                style={styles.input}
                value={schoolName}
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
                  borderBlockColor: 'black',
                  borderTopWidth: 2,
                },
              }}>
              <ScrollView>
                {school.map((schoolItem: any) => (
                  <TouchableOpacity
                    key={schoolItem?.id}
                    onPress={() => {
                      setSchoolName(schoolItem?.name);
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
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Class</Text>
              <Icon name="class" size={26} color="black" style={styles.icon} />
            </View>
            {/* add class list using react native raw bottom sheet */}
            <TouchableOpacity onPress={() => classSheetRef.current?.open()}>
              <TextInput
                placeholder="Select Class"
                placeholderTextColor="grey"
                style={styles.input}
                value={className}
                editable={false}
              />
            </TouchableOpacity>
            <RBSheet
              ref={classSheetRef as any}
              closeOnDragDown={true}
              closeOnPressMask={true}
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                },
                container: {
                  backgroundColor: '#113946',
                  borderBlockColor: 'black',
                  borderTopWidth: 2,
                  height: '35%',
                  paddingVertical: 10,
                },
              }}>
              <ScrollView>
                {classes.map((classItem: any) => (
                  <TouchableOpacity
                    key={classItem?.ClassID}
                    onPress={() => {
                      setClassName(classItem?.ClassName);
                      setClassID(classItem?.ClassID);
                      classSheetRef.current?.close();
                    }}
                    style={styles.bottomContainer}>
                    <Text style={styles.filed}>{classItem.ClassName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </RBSheet>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Subject</Text>
              <Icon
                name="subject"
                size={26}
                color="black"
                style={styles.icon}
              />
            </View>
            {/* add school list using react native raw bottom sheet */}
            <TouchableOpacity onPress={() => subjectSheetRef.current?.open()}>
              <TextInput
                placeholder="Select Subject"
                placeholderTextColor="grey"
                style={styles.input}
                value={subject}
                editable={false}
              />
            </TouchableOpacity>
            <RBSheet
              ref={subjectSheetRef as any}
              closeOnDragDown={true}
              closeOnPressMask={true}
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                },
                container: {
                  backgroundColor: '#113946',
                  borderBlockColor: 'black',
                  borderTopWidth: 2,
                  height: '40%',
                  paddingVertical: 10,
                },
              }}>
              <ScrollView>
                {subjects.map((subjectItem: any) => (
                  <TouchableOpacity
                    key={subjectItem?.SubjectID}
                    onPress={() => {
                      setSubject(subjectItem?.SubjectName);
                      setSubjectId(subjectItem?.SubjectID);
                      subjectSheetRef.current?.close();
                    }}
                    style={styles.bottomContainer}>
                    <Text style={styles.filed}>{subjectItem.SubjectName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </RBSheet>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Discount (%)</Text>
              <Icon
                name="discount"
                size={26}
                color="black"
                style={styles.icon}
              />
            </View>

            <TouchableOpacity>
              <TextInput
                placeholder="Enter Discount"
                placeholderTextColor="grey"
                style={styles.input}
                value={discount}
                maxLength={2}
                onChangeText={setDiscount}
                keyboardType="numeric"
              />
            </TouchableOpacity>
          </View>

          {subject != '' && price !== '' && (
            <View style={styles.priceContainer}>
              <View style={styles.priceTable}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCellHeader}>
                    <Text style={styles.tableCellHeaderText}>
                      Price Details
                    </Text>
                  </View>
                  <View style={styles.tableCellHeader}>
                    <Text style={styles.tableCellHeaderText}>Amount</Text>
                  </View>
                </View>

                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>MRP</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>
                      {price ? price?.mrp : 'No Price'}
                    </Text>
                  </View>
                </View>

                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>Quantity</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => handleQuantityUpdate('decrement')}
                        style={styles.circleIcon}>
                        <Icon name="horizontal-rule" size={20} color="black" />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        value={quantity ? quantity : '1'}
                        onChangeText={text => setQuantity(text)}
                        maxLength={8}
                      />
                      <TouchableOpacity
                        style={styles.circleIcon}
                        onPress={() => handleQuantityUpdate('increment')}>
                        <Icon name="add" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={[styles.tableFooter]}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        styles.tableCellText,
                        {fontSize: 20, fontWeight: '500'},
                      ]}>
                      Sub Total :
                    </Text>
                    {discount && (
                      <Text
                        style={[
                          styles.tableCellText,
                          {fontSize: 20, fontWeight: '500'},
                        ]}>
                        Discount :
                      </Text>
                    )}
                  </View>
                  <View style={styles.tableCell}>
                    <Text
                      style={[
                        styles.tableCellText,
                        {fontSize: 20, fontWeight: '500'},
                      ]}>
                      ₹ {price ? price?.mrp * quantity : 0}
                    </Text>
                    {discount && (
                      <Text
                        style={[
                          styles.tableCellText,
                          {fontSize: 20, fontWeight: '500'},
                        ]}>
                        {discount ? discount : 0}%
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.finalPrice}>
                <Text style={styles.subtotal}>
                  TOTAL AMOUNT :{' '}
                  {total !== 'NaN' ? `₹ ${total}` : 'Invalid Price'}
                </Text>
              </View>
            </View>
          )}
          {/* </KeyboardAvoidingView> */}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.button}>Add Book</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ViewBook}>
          <Text style={styles.button}>View Book</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    // paddingVertical: 20,
  },
  inputContainer: {
    width: '94%',
    marginVertical: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    includeFontPadding: true,
    borderColor: 'grey',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  icon: {
    marginTop: 10,
    paddingEnd: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    color: 'white',
    backgroundColor: '#11235A',
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  bottomContainer: {
    padding: 10,
    backgroundColor: '#1D5D9B',
    marginVertical: 5,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  filed: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  priceContainer: {
    width: '94%',
    marginVertical: 10,
    alignItems: 'center',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 40,
  },
  priceTable: {
    marginTop: responsiveHeight(3),
    borderWidth: 1,
    width: '90%',
    borderColor: '#000',
    borderRadius: 5,
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableCellHeader: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  tableCellHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableCellText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalPrice: {
    width: '90%',
    alignItems: 'flex-end',
    paddingEnd: 12,
    margin: 10,
    marginBottom: 20,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  circleIcon: {
    borderWidth: 1,
    backgroundColor: '#1D5D9B',
    borderRadius: 50,
    padding: 1,
  },
  quantityInput: {
    textAlign: 'center',
    paddingVertical: 3,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default OrderPage;

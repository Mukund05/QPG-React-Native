import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../utils/Header';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addOrder,
  deleteOrder,
  updateQuantity,
} from '../../../store/Features/OrderSlice';
import {useToast} from 'react-native-toast-notifications';
import {placeOrder} from '../../../api/api';
import {fetchtoken} from '../../../utils/fetchItem';
import Toast from 'react-native-toast-message';

const OrderDetails: React.FC<{navigation: any}> = ({navigation}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.user.user.id);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [orderData, setOrderData] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      try {
        if (orderData.length === 0) {
          const storedOrderData: any = await AsyncStorage.getItem(
            userId.toString(),
          );
          setOrderData(JSON.parse(storedOrderData) || []);
        }
      } catch (error) {
        console.log('ORDER DETAILS::ERROR IN GETTING DATA', error);
      }
    };
    getData();
  }, [orderData, userId]);

  useEffect(() => {
    // Calculate the total amount based on the subtotals of all items
    const total: any = orderData.reduce(
      (sum: number, item: any) =>
        sum + parseFloat(subTotal(item.mrp.mrp, item.quantity, item.discount)),
      0,
    );
    setTotalAmount(total.toFixed(2));
  }, [orderData]);

  const handleQuantityUpdate = (
    itemId: string,
    quantity: any,
    type: string,
  ) => {
    if (type === 'sub' && quantity === 1) {
      Toast.show({
        type: 'error',
        text1: 'Quantity cannot be less than 1',
        visibilityTime: 1000,
        position: 'top',
      });
      return;
    }
    const newQuantity = type === 'add' ? quantity + 1 : quantity - 1;
    dispatch(updateQuantity({itemId, newQuantity}));
    updateAsyncStorage(itemId, newQuantity);
    Toast.show({
      type: 'success',
      text1: 'Quantity updated successfully',
      visibilityTime: 1000,
      position: 'top',
    });
  };

  const handleSubmit = async () => {
    // Implement your logic for placing the order
    const order = orderData;
    // console.log('ORDER DETAILS::ORDER DATA', order);
    const data = {
      userId: userId,
      totalMRP: totalAmount,
      BookHistory: order,
    };
    // console.log("Final Order Data",data)
    try {
      const token = await fetchtoken();
      const response = await placeOrder(token, data);
      // console.log("Response from place order",response);
      if (response.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Order placed successfully',
          visibilityTime: 1500,
          position: 'top',
        });
        setOrderData([]);
        await AsyncStorage.removeItem(userId.toString());
        dispatch(addOrder([]));
      }
    } catch (error) {
      console.log('Error in placing order', error);
    }
  };

  const subTotal = (price_mrp: any, quantity: any, discount: any) => {
    const totalAmount = price_mrp * quantity;
    const discountAmount = totalAmount * (discount / 100);
    const finalAmount = totalAmount - discountAmount;
    const roundedFinalAmount = finalAmount.toFixed(2);
    return roundedFinalAmount.toString();
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => confirmDeleteItem(itemId),
        },
      ],
      {cancelable: false},
    );
  };

  const confirmDeleteItem = (itemId: string) => {
    Toast.show({
      type: 'success',
      text1: 'Item deleted successfully',
      visibilityTime: 1000,
      position: 'top',
    });
    dispatch(deleteOrder(itemId));
    deleteFromAsyncStorage(itemId);
  };

  const updateAsyncStorage = async (itemId: string, newQuantity: number) => {
    try {
      const storedOrderData: any = await AsyncStorage.getItem(
        userId.toString(),
      );
      const parsedOrderData = JSON.parse(storedOrderData);
      const updatedOrderData = parsedOrderData.map((item: any) => {
        if (item.id === itemId) {
          return {...item, quantity: newQuantity};
        }
        return item;
      });
      await AsyncStorage.setItem(
        userId.toString(),
        JSON.stringify(updatedOrderData),
      );
      setOrderData(updatedOrderData); // Update local state with new data
    } catch (error) {
      console.error('Error updating Async Storage:', error);
    }
  };

  const deleteFromAsyncStorage = async (itemId: string) => {
    try {
      const storedOrderData: any = await AsyncStorage.getItem(
        userId.toString(),
      );
      const parsedOrderData = JSON.parse(storedOrderData);
      const updatedOrderData = parsedOrderData.filter(
        (item: any) => item.id !== itemId,
      );
      await AsyncStorage.setItem(
        userId.toString(),
        JSON.stringify(updatedOrderData),
      );
      setOrderData(updatedOrderData); // Update local state with new data
    } catch (error) {
      console.error('Error deleting from Async Storage:', error);
    }
  };

  return (
    <>
      <Header
        title="Order Details"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
      />
      <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
        <View style={styles.container}>
          {totalAmount > 0 ? (
            <Text style={styles.header}>Total Amount : ₹{totalAmount}</Text>
          ) : (
            <Text style={styles.header}>No Order Details</Text>
          )}

          {orderData?.map((item: any, index: any) => (
            <View style={styles.orderCard} key={index}>
              <View style={styles.icon}>
                <Icon
                  name="delete"
                  size={25}
                  color="red"
                  onPress={() => handleDeleteItem(item.id)}
                />
              </View>
              <View style={styles.details}>
                <View style={styles.field}>
                  <Text style={styles.label}>School Name :</Text>
                  <Text style={styles.value} numberOfLines={1}>
                    {item?.SchoolItem.label}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Class Name :</Text>
                  <Text style={styles.value}>{item?.ClassItem.label} </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Subject Name :</Text>
                  <Text
                    style={styles.value}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {item?.SubjecItem.label}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Actual Price :</Text>
                  <Text style={styles.value}>₹ {item?.mrp.mrp} </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Qunatity :</Text>
                  <View style={styles?.iconContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        handleQuantityUpdate(item?.id, item?.quantity, 'sub')
                      }
                      style={[styles.circleIcon, {marginEnd: 15}]}>
                      <Icon name="horizontal-rule" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.value}>{item?.quantity}</Text>
                    <TouchableOpacity
                      style={[styles.circleIcon, {marginStart: 15}]}
                      onPress={() =>
                        handleQuantityUpdate(item?.id, item?.quantity, 'add')
                      }>
                      <Icon name="add" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Discount (%) :</Text>
                  <Text style={styles.value}>
                    {item.discount === '' ? '0' : item?.discount}%{' '}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>SubTotal :</Text>
                  <Text style={styles?.value}>
                    ₹ {subTotal(item?.mrp?.mrp, item?.quantity, item?.discount)}{' '}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {orderData.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.bottomBut}
            onPress={() => handleSubmit()}>
            <View>
              <Text style={styles.bottomText}>Place Order</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default OrderDetails;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: responsiveScreenHeight(100),
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  orderCard: {
    width: '90%',
    maxHeight: responsiveScreenHeight(50),
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    marginVertical: 10,
    padding: 10,
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    marginTop: 40,
    marginHorizontal: 10,
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'grey',
    marginEnd: 12,
    alignItems: 'flex-start',
  },
  value: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'green',
    maxWidth: '67%',
    alignSelf: 'flex-end',
    marginStart: 'auto',
    // textAlign: 'right',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginStart: 'auto',
  },
  circleIcon: {
    borderWidth: 1,
    backgroundColor: '#1D5D9B',
    borderRadius: 50,
    padding: 1,
    // marginHorizontal: 25,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    // backgroundColor: 'white',
    paddingVertical: 20,
  },
  bottomBut: {
    marginHorizontal: 10,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 25,
    width: '90%',
  },
  bottomText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
});

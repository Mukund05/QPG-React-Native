import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../../../utils/Header';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUser} from '../../../utils/fetchItem';
import { deleteOrder } from '../../../store/Features/OrderSlice';

const OrderDetails: React.FC<{navigation: any}> = ({navigation}) => {
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [data, setData] = React.useState<any>(null);
  const dispatch=useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const {id} = await fetchUser();
        const orderData = await AsyncStorage.getItem(id.toString());
        console.log('ORDER DETAILS::ORDER DATA', orderData);
        setData(JSON.parse(orderData as any));
      } catch (error) {
        console.log('ORDER DETAILS::ERROR IN GETTING DATA', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    // Calculate the total amount based on the subtotals of all items
    if (data) {
      const total = data.reduce(
        (sum: number, item: any) => sum + parseFloat(subTotal(item.mrp.mrp, item.quantity, item.discount)),
        0
      );
      setTotalAmount(total.toFixed(2));
    }
  }, [data]);

  const handleQuantityUpdate = (type: string) => {
    if (type === 'increment') {
      setTotalAmount(totalAmount + 1);
    } else {
      if (totalAmount > 0) {
        setTotalAmount(totalAmount - 1);
      }
    }
  };

  const handleSubmit = () => {};

  const subTotal = (price_mrp: any, quantity: any, discount: any) => {
    const totalAmount = price_mrp * quantity;
    const discountAmount = totalAmount * (discount / 100);
    const finalAmount = totalAmount - discountAmount;
    // console.log('TOTAL AMOUNT',finalAmount);
    const roundedFinalAmount = finalAmount.toFixed(2);
    return roundedFinalAmount.toString();
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch(deleteOrder(itemId));
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
          {totalAmount ? (
            <Text style={styles.header}>Total Amount : ₹{totalAmount}</Text>
          ) : (
            <Text style={styles.header}>No Order Details</Text>
          )}

          {data?.map((item: any,index:any) => ( 
            <View style={styles.orderCard} key={index}>
              <View style={styles.icon}>
                <Icon name="delete" size={25} color="red" onPress={()=>handleDeleteItem(item.id)}/>
              </View>
              <View style={styles.details}>
                <View style={styles.field}>
                  <Text style={styles.label}>School Name :</Text>
                  <Text style={styles.value} numberOfLines={1}>
                    {item.SchoolItem.label}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Class Name :</Text>
                  <Text style={styles.value}>{item.ClassItem.label} </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Subject Name :</Text>
                  <Text
                    style={styles.value}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {item.SubjecItem.label}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Actual Price :</Text>
                  <Text style={styles.value}>₹ {item.mrp.mrp} </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Qunatity :</Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      onPress={() => handleQuantityUpdate('decrement')}
                      style={[styles.circleIcon, {marginEnd: 15}]}>
                      <Icon name="horizontal-rule" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.value}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={[styles.circleIcon, {marginStart: 15}]}
                      onPress={() => handleQuantityUpdate('increment')}>
                      <Icon name="add" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Discount :</Text>
                  <Text style={styles.value}>{item.discount}% </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>SubTotal :</Text>
                  <Text style={styles.value}>₹ {subTotal(item.mrp.mrp,item.quantity,item.discount)} </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bottomBut}
          onPress={() => handleSubmit()}>
          <View>
            <Text style={styles.bottomText}>Place Order</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    marginEnd: 12,
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    maxWidth: '70%',
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

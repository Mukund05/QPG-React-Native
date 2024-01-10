import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import Header from '../../../utils/Header';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';

const OrderDetails: React.FC<{navigation: any}> = ({navigation}) => {
  const [totalAmount, setTotalAmount] = React.useState<number>(0);

  const handleQuantityUpdate = (type: string) => {
    if (type === 'increment') {
      setTotalAmount(totalAmount + 1);
    } else {
      if (totalAmount > 0) {
        setTotalAmount(totalAmount - 1);
      }
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
          {totalAmount ? (
            <Text style={styles.header}>Total Amount : ₹{totalAmount}</Text>
          ) : (
            <Text style={styles.header}>No Order Details</Text>
          )}

          <View style={styles.orderCard}>
            <View style={styles.icon}>
              <Icon name="delete" size={25} color="red" />
              <Icon name="edit" size={25} color="green" />
            </View>
            <View style={styles.details}>
              <View style={styles.field}>
                <Text style={styles.label}>School Name :</Text>
                <Text style={styles.value} numberOfLines={1} >Bal Bharti School Vidya Public School</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Class Name :</Text>
                <Text style={styles.value}>Class 4th </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Subject Name :</Text>
                <Text style={styles.value}>तनुश्री हिंदी मीनिंग</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Actual Price :</Text>
                <Text style={styles.value}>₹40000 </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Qunatity :</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => handleQuantityUpdate('decrement')}
                    style={styles.circleIcon}>
                    <Icon name="horizontal-rule" size={20} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.value}>0</Text>
                  <TouchableOpacity
                    style={styles.circleIcon}
                    onPress={() => handleQuantityUpdate('increment')}>
                    <Icon name="add" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Discount :</Text>
                <Text style={styles.value}>80% </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>SubTotal :</Text>
                <Text style={styles.value}>₹88987.00 </Text>
              </View>
            </View>
          </View>
          
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    marginEnd: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    maxWidth: '70%',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  circleIcon: {
    borderWidth: 1,
    backgroundColor: '#1D5D9B',
    borderRadius: 50,
    padding: 1,
    marginHorizontal: 15,
  },
});

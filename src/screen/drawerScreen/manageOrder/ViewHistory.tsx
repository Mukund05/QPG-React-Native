import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Header from '../../../utils/Header';
import {ScrollView} from 'react-native';
import {responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';

const ViewHistory: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {data} = route.params;
  const list = data.details;

  const calculateTotal = (
    mrp: Number | any,
    quantity: Number | any,
    discount: Number | any,
  ) => {
    const total = mrp * quantity - (mrp * quantity * discount) / 100;
    return total.toFixed(2);
  };
  // console.log(data)
  return (
    <>
      <Header
        title="View History"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
        rightIcon="home"
        onPressRightIcon={() =>
          navigation.reset({
            index: 0,
            routes: [{name: 'Dashboard' as never}],
          })
        }
      />
      <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
        <View style={styles.container}>
          {data.total_amount ? (
            <Text style={styles.header}>
              Total Amount : ₹{data.total_amount}
            </Text>
          ) : (
            <Text style={styles.header}>No Order Details</Text>
          )}

          {list.map((element: any) => (
            <View style={styles.orderCard} key={element.id}>
              <View style={styles.details}>
                <View style={styles.field}>
                  <Text style={styles.label}>School Name </Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value} numberOfLines={1}>
                    {element.school}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Class Name </Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value}>{element.class} </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Subject Name </Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value}>{element.subject}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Actual Price (₹)</Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value}>₹{element.mrp} </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Quantity </Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value}>{element.quantity}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Discount (%) </Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value}>{element.discount===null ? `0` : element.discount}% </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Donation (₹) </Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value}>₹{element.donation===null ? `0` : element.donation} </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>SubTotal (₹)</Text>
                  <Text style={styles.comma}>:</Text>
                  <Text style={styles.value}>
                    ₹{' '}
                    {calculateTotal(
                      element.mrp,
                      element.quantity,
                      element.discount,
                    )}{' '}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default ViewHistory;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: responsiveScreenHeight(100),
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  header: {
    marginVertical: responsiveScreenHeight(1),
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: 'green',
  },
  orderCard: {
    width: '90%',
    maxHeight: responsiveScreenHeight(50),
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    marginVertical: responsiveScreenHeight(1),
    padding: responsiveScreenHeight(0.5),
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  details: {
    marginVertical: responsiveScreenHeight(2),
    marginHorizontal: responsiveScreenWidth(2),
  },
  field: {
    // display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: responsiveScreenHeight(0.5),
    
  },
  label: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'grey',
    marginEnd: 12,
    minWidth: responsiveScreenWidth(29),
  },
  value: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'green',
    maxWidth: '50%',
    marginEnd: responsiveScreenWidth(2),
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  comma:{
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'grey',
    marginEnd: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});
